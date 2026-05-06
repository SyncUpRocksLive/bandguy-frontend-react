<script lang="ts">
	import { peerStore } from '@/Stores/PeerStore.svelte';
	import { PeerOperationMode } from '@/Types/Types';
	import JamJoin from '@/Components/JamSessions/JamJoin.svelte';
	import SetView from './SetView.svelte';

	let isConnected = $state(false);
</script>

<div class="guest-container">
	{#if !isConnected}
		<JamJoin />
	{:else}
		<!-- <SetView mode="guest" setId={appState.store.currentSetId} /> -->
		 <p>TODO - SetView</p>
	{/if}
</div>

<style>
	.guest-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin: 1px;
		padding: 5px;
		overflow-y: auto;
	}
</style>
