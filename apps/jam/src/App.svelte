<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { auth } from "./Auth.svelte";
	import { router } from "./Router.svelte";
	import Login from "./Components/Login.svelte";
	import Home from "./Components/Area/Home.svelte";
	import SetList from "./Components/Area/SetList.svelte";
	import SetView from "./Components/Area/SetView.svelte";
	import Guest from "./Components/Area/Guest.svelte";
	import TopNavBar from "./Components/TopNavBar.svelte";
	import { queryClient } from './QueryClient';

</script>

<QueryClientProvider client={queryClient}>
	{#if auth.isAuthenticated}
			<TopNavBar />

			{#if router.route.area === 'Home'}
				<Home />
			{:else if router.route.area === 'HostSets'}
				<SetList mode="host" />
			{:else if router.route.area === 'HostSetView'}
				<SetView mode="host" setId={router.route.params[0]} />
			{:else if router.route.area === 'SoloSets'}
				<SetList mode="solo" />
			{:else if router.route.area === 'SoloSetView'}
				<SetView mode="solo" setId={router.route.params[0]} />
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
