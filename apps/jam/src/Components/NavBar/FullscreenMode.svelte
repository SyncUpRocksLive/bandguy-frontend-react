<script lang="ts">
	import { auth } from "@shared/ui/stores/Auth.svelte";
	import { onMount } from 'svelte';

	let isFullscreen = $state(false);

	onMount(() => {
		function onFullscreenChange() {
			isFullscreen = Boolean(document.fullscreenElement);
		}

		if (document.fullscreenElement) {
			isFullscreen = true;
		}

		document.addEventListener('fullscreenchange', onFullscreenChange);

		return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
	});

	function toggleFullscreen() {
		if (!isFullscreen) {
			document.body.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	}

</script>

{#if auth.user}
	<button
		class="profile-button"
		onclick={() => toggleFullscreen()}
		title="Toggle Fullscreen"
		aria-label="User profile menu"
	>
		{#if !isFullscreen}
			<svg width="24px" height="24px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fill="var(--ci-primary-color, #ffffff)" points="208 48 208 16 16 16 16 208 48 208 48 70.627 208.687 231.313 231.313 208.687 70.627 48 208 48" class="ci-primary"></polygon> <polygon fill="var(--ci-primary-color, #ffffff)" points="464 304 464 441.373 299.313 276.687 276.687 299.313 441.373 464 304 464 304 496 496 496 496 304 464 304" class="ci-primary"></polygon> </g></svg>
		{:else}
			<svg width="24px" height="24px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="0" fill="none" width="20" height="20"></rect> <g> <path d="M3.4 2L2 3.4l2.8 2.8L3 8h5V3L6.2 4.8 3.4 2zm11.8 4.2L18 3.4 16.6 2l-2.8 2.8L12 3v5h5l-1.8-1.8zM4.8 13.8L2 16.6 3.4 18l2.8-2.8L8 17v-5H3l1.8 1.8zM17 12h-5v5l1.8-1.8 2.8 2.8 1.4-1.4-2.8-2.8L17 12z"></path> </g> </g></svg>
		{/if}
	</button>
{/if}

<style>
	.profile-button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		font-size: 1.5rem;
		padding: 0.5rem;
		border-radius: 0.25rem;
		transition: background-color 0.2s;
	}

	.profile-button:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.profile-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.profile-popover {
		background: white;
		border-radius: 0.5rem;
		max-width: 300px;
		width: 90%;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
	}

	.profile-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid #dee2e6;
		background-color: #f8f9fa;
		border-radius: 0.5rem 0.5rem 0 0;
	}

	.profile-header h4 {
		margin: 0;
		font-size: 1.1rem;
	}

	.profile-header button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background-color 0.2s;
	}

	.profile-header button:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.profile-body {
		padding: 1rem;
	}

	.user-info {
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.username {
		color: #6c757d;
		font-size: 0.875rem;
	}

	.profile-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.action-button {
		background-color: #6c757d;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background-color 0.2s;
	}

	.action-button:hover {
		background-color: #5a6268;
	}

	.logout-button {
		background-color: #dc3545;
	}

	.logout-button:hover {
		background-color: #c82333;
	}
</style>
