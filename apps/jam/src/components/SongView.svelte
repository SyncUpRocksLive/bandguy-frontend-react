<script lang="ts">
	import { onMount } from 'svelte';
	import { syncStore } from "@/Stores/SyncStore.svelte"
	import { SongPlayStatus } from '../Types/Types';
	import type { Song } from '@shared/services/syncuprocks/musician/Types';
	import BasicLyricViewer from './SongPlayback/BasicLyricViewer.svelte';

	interface Props {
		song: Song;
	}

	let { song }: Props = $props();

	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
</script>

<div class="song-view">
	<div class="player-controls">
		<input
			type="range"
			min="0"
			max={duration}
			value={currentTime}
			class="seek-bar"
		/>
	</div>

	{#if $syncStore.currentSong && $syncStore.currentSongTracks}
		{#each $syncStore.currentSongTracks as track}
			{@const meta = $syncStore.currentSong.tracks.find(t => t.id === track.id)!}

			<div class="lyrics-container">
				{#if track.loading}
					Loading {meta.name}...
				{:else if track.error}
					Failed loading {meta.name}: {track.error}
				{:else if track.data?.type === 'lyrics'}
					{#if meta.format === 'Lyric'}
						<BasicLyricViewer lyrics={track.data.content} tick={$syncStore.playbackTimeMilliseconds} />
					{/if}
				{/if}
			</div>
		{/each}
	{/if}

</div>

<style>
	.song-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 20px;
		color: white;
	}

	.song-header {
		margin-bottom: 20px;
	}

	.song-header h2 {
		margin: 0 0 10px 0;
		font-size: 1.5rem;
	}

	.artist {
		margin: 0;
		color: rgba(255, 255, 255, 0.8);
		font-style: italic;
	}

	.player-controls {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 20px;
		padding: 15px;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 8px;
	}

	.time-display {
		text-align: center;
		font-size: 1.1rem;
		font-weight: bold;
	}

	.controls {
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	.control-btn {
		padding: 8px 16px;
		background-color: #343a40;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	.control-btn:hover:not(:disabled) {
		background-color: #495057;
	}

	.control-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.seek-bar {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: rgba(255, 255, 255, 0.3);
		outline: none;
		-webkit-appearance: none;
	}

	.seek-bar::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #007bff;
		cursor: pointer;
	}

	.seek-bar::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #007bff;
		cursor: pointer;
		border: none;
	}

	.video-container {
		flex: 1;
		margin-bottom: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 8px;
		min-height: 300px;
	}

	.video-container video {
		max-width: 100%;
		max-height: 100%;
		border-radius: 8px;
	}

	.no-video {
		text-align: center;
		color: rgba(255, 255, 255, 0.7);
	}

	.lyrics-container {
		flex: 1;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 8px;
		padding: 20px;
		overflow-y: auto;
	}

	.lyrics pre {
		margin: 0;
		white-space: pre-wrap;
		font-family: inherit;
		line-height: 1.5;
	}

	.no-lyrics {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		color: rgba(255, 255, 255, 0.7);
	}
</style>
