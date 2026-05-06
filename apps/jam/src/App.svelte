<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { auth } from "./Auth.svelte";
	import { router } from "./Router.svelte";
	import Login from "./Components/User/Login.svelte";
	import Home from "./Components/Area/Home.svelte";
	import SetList from "./Components/Area/SetList.svelte";
	import SetView from "./Components/Area/SetView.svelte";
	import Guest from "./Components/Area/Guest.svelte";
	import TopNavBar from "./Components/NavBar/TopNavBar.svelte";
	import { peerStore } from "./Stores/PeerStore.svelte"
	import { queryClient } from './QueryClient';
	import { PeerOperationMode } from './Types/Types';
	import { onMount } from 'svelte';
	import { appState } from './State.svelte';
	import { orchestrator } from './Support/Services/SyncUpOrchestrator';

	onMount(async () => {
    	await appState.loadFromStorage();

		// Add in the implementation dependencies
		peerStore.linkOrchestrator(orchestrator);
  	});

	$effect(() => {
		// Based on route params - ensure our peerStore reflects proper config
		if (router.route.area.startsWith('Host')) {
			peerStore.updateState({peerMode: PeerOperationMode.Host});
		} else if (router.route.area.startsWith('Solo')) {
			peerStore.updateState({peerMode: PeerOperationMode.Solo});
		} else if (router.route.area.startsWith('Guest')) {
			peerStore.updateState({peerMode: PeerOperationMode.Guest});
		} else {
			peerStore.updateState({peerMode: PeerOperationMode.None});
		}
	});

</script>

<QueryClientProvider client={queryClient}>
	{#if auth.isAuthenticated}
		<TopNavBar />

		{#if router.route.area === 'Home'}
			<Home />
		{:else if router.route.area === 'HostSets'}
			<SetList />
		{:else if router.route.area === 'HostSetView'}
			<SetView setId={parseInt(router.route.params[0])} />
		{:else if router.route.area === 'SoloSets'}
			<SetList />
		{:else if router.route.area === 'SoloSetView'}
			<SetView setId={parseInt(router.route.params[0])} />
		{:else if router.route.area === 'Guest'}
			<Guest />
		{:else}
			<p>Unknown route: {router.route.area}</p>
			<button onclick={() => router.navigate("Home")}>Go Home</button>
		{/if}
	{:else}
		<Login />
	{/if}
</QueryClientProvider>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
