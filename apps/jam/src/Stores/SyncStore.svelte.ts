import { PeerOperationMode, SongPlayStatus } from "@/Types/Types";
import type { Song } from "@shared/services/syncuprocks/musician/Types";
import { JamChannelDetail } from "@shared/services/syncuprocks/musician/JamChannels";
import { writable, get } from "svelte/store";
import { CreateSongStore, SongBlob } from '@/Support/Stores/SongStore';
import { LogError, LogInfo, LogVerbose } from "@shared/services/Logger";
import { getFilesetDataByVersion } from "@shared/services/syncuprocks/musician/Api";

export interface TrackState {
	id: number;
	loading: boolean,
	data?: Blob,
}

export interface SyncStoreItems {
	peerMode: PeerOperationMode;
	availableRemoteChannels?: JamChannelDetail[];
	connectedChannelDetail?: JamChannelDetail;
	currentSetId?: number;
	currentSongId?: number;
	currentSong?: Song,
	currentSongTracks?: TrackState[];
	plabackTimeMilliseconds: number;
	songPlayStatus: SongPlayStatus;
}

// This store handles current song status, modes, tracks, setlists, etc
function createSyncStore () {
	const songStore = CreateSongStore();

	// Local mirror of the state
	let state: SyncStoreItems;

	const { subscribe, update } = writable<SyncStoreItems>({
		peerMode: PeerOperationMode.None,
		availableRemoteChannels: undefined,
		connectedChannelDetail: undefined,
		currentSetId: undefined,
		currentSongId: undefined,
		currentSong: undefined,
		currentSongTracks: undefined,
		plabackTimeMilliseconds: 0,
		songPlayStatus: SongPlayStatus.Stop
	});

	// Keep the local mirror updated
    const unsubscribe = subscribe((value) => {
        state = value;
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

		updateState({currentSongTracks: tracks});
		
		await Promise.all(song.tracks.map(async (track) => {
			// Already in db?
			LogVerbose(`Grabing track '${track.name}' for song '${song.name}'`);
			if (await songStore.exists(song.id, track.id, track.versionNumber!)) {
				const songBlob = await songStore.get(song.id, track.id, track.versionNumber!);

				if (song !== state.currentSong) {
					LogInfo("Song changed - skipping loading tracks")
					return;
				}

				if (songBlob) {				
					const trackState = tracks.find((t) => t.id === track.id);
					if (trackState) {
						trackState.data = songBlob.data;
						trackState.loading = false;

						updateState({currentSongTracks: tracks});
					}
				}
			}

			// TODO - check if song changed - if so - bail out

			// No - load from API and cache
			const data = await getFilesetDataByVersion(track.fileSetId!, track.versionNumber!);
			if (data.ok) {
				//data.value
				// Let's go ahead and ensure we cache before checking current state
			}

			if (song !== state.currentSong) {
				LogInfo("Song changed - skipping loading tracks")
				return;
			}
		}));

		LogVerbose("Completed grabbing tracks");
	}

	// async function loadSongTrack(songId: number, trackId: number, version: number) {
    //     const thisRequestKey = `${songId}-${trackId}-${version}`;
    //     activeRequestKey = thisRequestKey;

    //     // 1. Clear current song in UI immediately to prevent "stale" flashes
    //     updateState({ currentSong: undefined });

    //     // 2. Check Cache
    //     const cached = await songStore.get(songId, trackId, version);
    //     if (cached && activeRequestKey === thisRequestKey) {
    //         updateState({ currentSong: { ...state.currentSong, blob: cached } });
    //         return; 
    //     }

    //     // 3. Fetch from S3 (Parallel, No Abort)
    //     try {
    //         const freshData = await fetchFromS3(songId, trackId, version);
            
    //         const songBlob: SongBlob = {
    //             songId, trackId, version,
    //             format: 'json',
    //             timestamp: Date.now(),
    //             data: freshData
    //         };

    //         // ALWAYS cache the result
    //         await songStore.put(songBlob);

    //         // ONLY update UI if the user is still waiting for THIS specific song
    //         if (activeRequestKey === thisRequestKey) {
    //             updateState({ currentSong: { ...state.currentSong, blob: songBlob } });
    //         }
    //     } catch (e) {
    //         LogError("Background fetch failed", e);
    //     }
    // }

	return {
		subscribe,
		updateState,
		ensureCurrentSongLoaded
	};
}

export const syncStore = createSyncStore();
