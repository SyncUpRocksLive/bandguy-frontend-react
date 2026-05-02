<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { syncStore } from '@/Stores/SyncStore.svelte';
	import { SongPlayStatus } from '@/Types/Types';
	import { LogInfo, LogVerbose } from '@shared/services/Logger';
	import SongView from '@/Components/SongView.svelte';
	import { getSetComplete } from '@shared/services/syncuprocks/musician/Api';
	import type { Song } from '@shared/services/syncuprocks/musician/Types';
	import { queryClient } from '@/QueryClient';

	interface Props {
		setId: number;
	}

	let { setId }: Props = $props();

	const query = createQuery(() => ({
		queryKey: ['setlist', $syncStore.currentSetId],
		queryFn: async () => {
			if (!$syncStore.currentSetId) return null;
			LogVerbose(`Downloading set overview for setId=${$syncStore.currentSetId}`);
			return await getSetComplete($syncStore.currentSetId, false);
		},
		refetchInterval: false,
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: false,
		enabled: !!$syncStore.currentSetId,
	}));

	function loadSong(song: Song) {
		if ($syncStore.currentSongId === song.id) {
			syncStore.updateState({ songPlayStatus: SongPlayStatus.Play });
			return;
		}

		syncStore.updateState({ currentSongId: song.id, currentSong: song, songPlayStatus: SongPlayStatus.Play });
		// TODO: Only load tracks we want to see - provide filter to limit
		syncStore.ensureCurrentSongLoaded();
	}

	function playSong() {
		syncStore.updateState({ songPlayStatus: SongPlayStatus.Play });
	}

	function pauseSong() {
		syncStore.updateState({ songPlayStatus: SongPlayStatus.Pause });
	}

	function nextSong() {
		if (query.isLoading || !query.data || !query.data.ok || query.data.value.songs.length === 0) {
			LogInfo("No Valid State");
			return;
		}

		let nextSong: Song = undefined; 
		if (!$syncStore.currentSong) {
			nextSong = query.data.value.songs[0];
		} else {
			const currentIndex = query.data.value.songs.indexOf($syncStore.currentSong);
			if (currentIndex < 0) {
				nextSong = query.data.value.songs[0];
			} else if (currentIndex + 1 >= query.data.value.songs.length) {
				// Reach end, stop
				pauseSong();
			} else {
				nextSong = query.data.value.songs[currentIndex + 1];
			}
		}

		// TODO: Scroll into view
		loadSong(nextSong);
	}

	// Update state
	$effect(() => {
		// TODO: Move to onMount - also, set first song as selected after query loads
		syncStore.updateState({currentSetId: setId})
	});

	onDestroy(() => {
    	console.log("Cleaning up downstream state...");
		syncStore.updateState({
			currentSetId: undefined,
			currentSongId: undefined,
			currentSong: undefined,
			songPlayStatus: SongPlayStatus.Stop
		});
  	});

	const errorMessage = $derived.by(() => {
		if (!query.isLoading) {
			if (query.isError) {
				return query.error.message;
			} else if (!query.data) {
				return "No Data Loaded";
			} else if (query.data.ok === false) {
				return query.data.error ?? "Unknown Error";
			}
		}
	
		return undefined;
	});

</script>

<div class="set-view">
	{#if query.isLoading}
		<div>Loading set...</div>
	{:else if errorMessage}
		<div>Error: {errorMessage}</div>
	{:else if query.data}
		<div class="set-container">
			<!-- Sidebar with controls and song list -->
			<div class="sidebar">
				<div class="controls">
					<button
						class="control-btn play-btn"
						class:pulse={$syncStore.songPlayStatus === SongPlayStatus.Play}
						onclick={playSong}
						title="Start playing"
					>
						▶
					</button>
					<button
						class="control-btn"
						onclick={pauseSong}
						title="Pause Playback"
					>
						⏸
					</button>
					<button
						class="control-btn"
						onclick={nextSong}
						title="Next"
					>
						⏭
					</button>
				</div>

				<div class="song-list">
					<ul>
						{#each query.data.value.songs as song (song.id)}
							<li>
								<button
									class="song-btn"
									class:active={$syncStore.currentSongId === song.id}
									onclick={() => loadSong(song)}
									title={`Play ${song.name || '?'}`}
								>
									▶ {song.name || '?'}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- Main content area -->
			<div class="main-content">
				{#if $syncStore.currentSongId}
					<SongView
						song={$syncStore.currentSong}
					/>
				{:else}
					<div class="no-song">Select a song to begin - g</div>
				{/if}
			</div>
		</div>
	{:else}
		<div>No set data</div>
	{/if}
</div>

<style>
	.set-view {
		position: relative;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.back-btn {
		position: absolute;
		bottom: 10px;
		right: 10px;
		padding: 0.5rem 1rem;
		background-color: #6c757d;
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		z-index: 10;
	}

	.back-btn:hover {
		background-color: #5a6268;
	}

	.set-container {
		display: flex;
		flex: 1;
		height: calc(100vh - 60px); /* Account for navbar */
	}

	.sidebar {
		width: 200px;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		flex-direction: column;
		border-right: 1px solid rgba(255, 255, 255, 0.3);
	}

	.controls {
		padding: 10px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
		display: flex;
		gap: 5px;
		justify-content: center;
	}

	.control-btn {
		padding: 8px 15px;
		background-color: #343a40;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1.2rem;
	}

	.control-btn:hover {
		background-color: #495057;
	}

	.play-btn.pulse {
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0% { opacity: 1; }
		50% { opacity: 0.7; }
		100% { opacity: 1; }
	}

	.song-list {
		flex: 1;
		overflow-y: auto;
		padding: 10px 0;
	}

	.song-list ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.song-list li {
		margin: 2px 0;
	}

	.song-btn {
		width: 100%;
		padding: 8px 10px;
		background-color: #343a40;
		color: white;
		border: none;
		text-align: left;
		cursor: pointer;
		font-size: 0.9rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		border-radius: 0;
		opacity: .4;
	}

	.song-btn:hover {
		background-color: #495057;
		opacity: 1;
	}

	.song-btn.active {
		background-color: rgba(100, 100, 200, 0.8);
		opacity: .8;
	}

	.main-content {
		flex: 1;
		background: rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
	}

	.no-song {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: white;
		font-size: 1.2rem;
	}
</style>
