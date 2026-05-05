<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { router } from '@/Router.svelte';
	import { auth } from '@/Auth.svelte';
	import { syncStore } from "@/Stores/SyncStore.svelte"
	import { peerStore } from "@/Stores/PeerStore.svelte"
	import { Log } from '@shared/services/Logger';
	import { getSetsOverview } from '@shared/services/syncuprocks/musician/Api';
	import type { SetOverview } from '@shared/services/syncuprocks/musician/Types';
	import { PeerOperationMode } from '@/Types/Types';

	let query = createQuery(() => ({
		queryKey: ['my.setlist', auth.user?.userId ?? 'none'],
		queryFn: async () => {
			console.log("Fetching for user:", auth.user?.userId);
			return await getSetsOverview(auth.user!.userId);
		},
		refetchInterval: 600000,
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
		enabled: !!auth.user?.userId,
	}));

	function playSet(set: SetOverview) {
		const route = $peerStore.peerMode === PeerOperationMode.Host ? 'HostSetView' : 'SoloSetView';
		Log('verbose', `Starting set=${set.name} route=${route}`);
		router.navigate(route, [set.id.toString()]);
	}

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

<div style="flex: 1; display: flex; flex-direction: column; margin: 1px; padding: 5px; overflow-y: auto;">
	<div style="background: rgba(255,255,255,.7); padding: 0px; justify-content: center; align-items: center;">
		<p style="font-weight: bold; margin: 0px; padding: 2px;">Set List</p>
	</div>

	<div style="flex: 1; display: flex; flex-direction: row; background: rgba(0,0,0,.9); padding: 10px; color: white; overflow-y: auto;">
		{#if query.isLoading}
			<div>Loading...</div>
		{:else if errorMessage}
			<div>Error: {errorMessage}</div>
		{:else if query.data && query.data.ok}
			{#each query.data.value as set (set.id)}
				<div style="width: 200px; height: 100px; margin: 4px;">
					<button
						class="btn btn-dark"
						style="padding: 2px 10px;"
						onclick={() => playSet(set)}
					>
						▶ {set.name} : {set.songs.length} songs 00:00:00 hrs
					</button>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.btn {
		display: inline-block;
		font-weight: 400;
		line-height: 1.5;
		color: #212529;
		text-align: center;
		text-decoration: none;
		vertical-align: middle;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		background-color: transparent;
		border: 1px solid transparent;
		padding: 0.375rem 0.75rem;
		font-size: 1rem;
		border-radius: 0.25rem;
		transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	}

	.btn-dark {
		color: #fff;
		background-color: #343a40;
		border-color: #343a40;
	}

	.btn:hover {
		color: #fff;
		background-color: #23272b;
		border-color: #1d2124;
	}
</style>
