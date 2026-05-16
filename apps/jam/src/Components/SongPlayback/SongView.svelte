<script lang="ts">
	import { onMount } from "svelte";
	import { syncStore } from "@/Stores/SyncStore.svelte";
	import { SongPlayStatus } from "../../Types/Types";
	import type { Song } from "@shared/services/syncuprocks/musician/Types";
	import BasicLyricViewer from "./BasicLyricViewer.svelte";
	import Metronome from "./Metronome.svelte";

	interface Props {
		song: Song;
	}

	let { song }: Props = $props();

	function restart() {
		syncStore.updateState({ playbackTimeMilliseconds: 0 });
	}
</script>

<div class="song-view">
	<div class="player-controls">
		<button
			onclick={() => restart()}
			title="Restart"
			class="control-button"
			disabled={!$syncStore.currentSong}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<!-- Circular path starts at 3.6 9 (slightly shifted) to create a gap -->
				<path d="M3.6 9a9 9 0 1 1-1.28 7.35" />
				<!-- Arrow head at the top-left -->
				<path d="M3 3v6h6" />
			</svg>
		</button>

		<input
			type="range"
			min="0"
			step="0"
			max={song.durationMilliseconds}
			bind:value={$syncStore.playbackTimeMilliseconds}
			class="seek-bar"
		/>
	</div>

	{#if $syncStore.currentSong && $syncStore.currentSongTracks}
		{#each $syncStore.currentSongTracks as track}
			{@const meta = $syncStore.currentSong.tracks.find(
				(t) => t.id === track.id,
			)!}

			<div class="lyrics-container">
				{#if track.error}
					Failed loading {meta.name}: {track.error}
				{:else if !track.loading && track.data?.type === "lyrics"}
					{#if meta.format === "Lyric"}
						<BasicLyricViewer
							lyrics={track.data.content}
							tick={$syncStore.playbackTimeMilliseconds}
						/>
					{/if}
				{/if}
			</div>
		{/each}

		<!-- <Metronome mode='tablet' /> -->
	{/if}
</div>

<style>
	.song-view {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 2px;
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
		flex-direction: row;
		align-items: center;
		gap: 1px;
		margin-bottom: 10px;
		padding: 2px;
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
		padding: 2px;
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

	.control-button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		font-size: 1.5rem;
		padding: 0.5rem;
	}

	.control-button:hover {
		background-color: rgba(210, 36, 36, 0.242);
		border-radius: 0.25rem;
	}

	.control-button:active {
		background-color: rgba(255, 255, 255, 0.2); /* Slightly brighter/darker than hover */
		transform: translateY(1px) scale(0.96);    /* Moves it down and shrinks it slightly */
		transition: transform 0.05s;               /* Makes the "click" feel snappier */
	}
</style>
