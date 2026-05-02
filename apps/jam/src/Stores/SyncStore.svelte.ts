import { PeerOperationMode, SongPlayStatus } from '@/Types/Types';
import type { Song, Track } from '@shared/services/syncuprocks/musician/Types';
import type { JamChannelDetail } from '@shared/services/syncuprocks/musician/JamChannels';
import { writable } from 'svelte/store';
import { CreateSongStore } from '@/Support/Stores/SongStore';
import { LogInfo, LogVerbose } from '@shared/services/Logger';
import { getFilesetDataByVersion } from '@shared/services/syncuprocks/musician/Api';
import { lyricsParser } from '@shared/parsers/lyrics/LyricsFileParser';
import type { Lyric } from '@shared/parsers/lyrics/Lyrics';

export type TrackData =
	| { type: 'audio' | 'binary'; content: Blob }
	| { type: 'lyrics'; content: Lyric }
	| { type: 'none'; content: undefined };

export interface TrackState {
	id: number;
	loading: boolean,
	error?: string,
	data?: TrackData,
}

export interface SyncStoreItems {
	peerMode: PeerOperationMode;
	availableRemoteChannels?: JamChannelDetail[];
	connectedChannelDetail?: JamChannelDetail;
	currentSetId?: number;
	currentSongId?: number;
	currentSong?: Song,
	currentSongTracks?: TrackState[];
	playbackTimeMilliseconds: number;
	songPlayStatus: SongPlayStatus;
}

// This store handles current song status, modes, tracks, setlists, etc
function createSyncStore() {
	const songStore = CreateSongStore();

	// Local mirror of the state
	let state: SyncStoreItems;
	let previousStatus: SongPlayStatus;
	let timerId: number | null = null;
	let lastTick: number = 0;

	const { subscribe, update } = writable<SyncStoreItems>({
		peerMode: PeerOperationMode.None,
		availableRemoteChannels: undefined,
		connectedChannelDetail: undefined,
		currentSetId: undefined,
		currentSongId: undefined,
		currentSong: undefined,
		currentSongTracks: undefined,
		playbackTimeMilliseconds: 0,
		songPlayStatus: SongPlayStatus.Stop
	});

	// Keep the local mirror updated
	const unsubscribe = subscribe((value) => {
		// 1. Detect if SongPlayStatus has changed
		const statusChanged = previousStatus !== value.songPlayStatus;
		
		// 2. Update the mirror and tracker
		state = value;
		previousStatus = value.songPlayStatus;

		if (!state.currentSong) {
			stopEngine();
			return;
		}

		// 3. Act on the change
		if (statusChanged) {
			if (state.songPlayStatus === SongPlayStatus.Play) {
				startEngine();
			} else {
				stopEngine();
			}
		}

		if (state.playbackTimeMilliseconds >= state.currentSong.durationMilliseconds) {
			// TODO: Emit song finished - 
		}
	});

	function updateState(patch: Partial<SyncStoreItems>) {
		update((state) => {
			const newState = { ...state, ...patch };

			// your existing logic
			if (newState.peerMode === "Host") {
				//BroadcastMessage({ type: "STATE_UPDATE", state: newState });
			}

			return newState;
		});
	}

	function startEngine() {
		if (timerId) return; // Guard against double-starts
		LogInfo("Engine: Started");
		lastTick = performance.now();
		tick();
	}

	function stopEngine() {
		if (timerId) {
			LogInfo("Engine: Stopped");
			cancelAnimationFrame(timerId);
			timerId = null;
		}
	}

	function tick() {
		const now = performance.now();
		const delta = now - lastTick;
		lastTick = now;

		// Update the store directly
		update((s) => ({
			...s,
			playbackTimeMilliseconds: s.playbackTimeMilliseconds + delta
		}));

		// Request the next frame
		timerId = requestAnimationFrame(tick);
	}

	async function parseBlob(track: Track, blob: Blob, trackState: TrackState): Promise<undefined> {
		try {
			if (track.format === 'Lyric') {
				trackState.data = { type: 'lyrics', content: lyricsParser(await blob.text()) };
			} else {
				trackState.error = `Unsupported format ${track.format}`;
			}
		} catch (e: any) {
			trackState.error = e.message;
		}
	}

	// TODO: Take a filter method to filter non-useful tracks
	async function ensureCurrentSongLoaded() {
		if (!state.currentSong) {
			LogInfo("No song loaded");
			return;
		}

		if (state.currentSong.tracks.length === 0) {
			LogInfo("No song tracks");
			return;
		}

		// TODO: save that we are loading song id, so if jumps around and back, we do not both try to laod same songs

		// Capture current song - and if it changes while we are loading, we may break out early and let other song load
		const song = state.currentSong;

		LogVerbose(`Grabing tracks for '${song.name}' # of tracks = ${song.tracks.length}`);

		// Setup track load status - all are loading
		const tracks: TrackState[] = song.tracks.map(track => ({
			id: track.id,
			loading: true,
			data: undefined
		}));
		updateState({ currentSongTracks: tracks });

		const trackMap = new Map(tracks.map(t => [t.id, t]));

		await Promise.all(song.tracks.map(async (track) => {
			if (song !== state.currentSong) {
				LogInfo("Song changed - skipping loading tracks")
				return;
			}

			const trackState = trackMap.get(track.id)!;

			LogVerbose(`Getting '${song.name}' - track '${track.name}'`);

			// Already in db?
			if (await songStore.exists(song.id, track.id, track.versionNumber!)) {
				const songBlob = await songStore.get(song.id, track.id, track.versionNumber!);

				if (song !== state.currentSong) {
					LogInfo("Song changed - skipping loading tracks")
					return;
				}

				if (songBlob) {
					LogVerbose(`Song '${song.name}' - track '${track.name}' - returned from cache`);
					await parseBlob(track, songBlob.data, trackState);
					trackState.loading = false;

					updateState({ currentSongTracks: Array.from(trackMap.values()) });
					return;
				}
			}

			if (song !== state.currentSong) {
				LogInfo("Song changed - skipping loading tracks")
				return;
			}

			// load from API and cache
			const data = await getFilesetDataByVersion(track.fileSetId!, track.versionNumber!);
			trackState.loading = false;

			if (data.ok) {
				LogVerbose(`Song '${song.name}' - track '${track.name}' - returned from web`);

				// Let's go ahead and ensure we cache before checking current state
				await songStore.put({
					songId: song.id,
					trackId: track.id,
					version: track.versionNumber!,
					format: track.format,
					timestamp: Date.now(),
					data: data.value,
				});

				await parseBlob(track, data.value, trackState);;

			} else {
				trackState.error = data.error.message;
			}

			if (song !== state.currentSong) {
				LogInfo("Song changed - skipping loading tracks")
				return;
			}

			updateState({ currentSongTracks: Array.from(trackMap.values()) });
		}));

		LogVerbose("Completed grabbing tracks");
	}

	return {
		subscribe,
		updateState,
		ensureCurrentSongLoaded
	};
}

export const syncStore = createSyncStore();
