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
	import CreateJam from '../JamSessions/CreateJam.svelte';
	import { derived } from 'svelte/store';
	import { msToHMS } from '@shared/display/DisplayHelpers';

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
	
	function getDuration(set: SetOverview) {
		// FUTURE: Return duration as part of overview
		const ms = set.songs.reduce((acc, song) => acc + (song.durationMs ?? 0), 0);
		if (ms <= 0) {
			return '';
		}

		return msToHMS(ms);
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

	const createJamChannel = $derived.by(() => {
		if ($peerStore.peerMode === PeerOperationMode.Host && !$peerStore.connectedChannelDetail) {
			return true;
		}

		return false;
	});


</script>

<div style="flex: 1; display: flex; flex-direction: column; margin: 1px; padding: 5px; overflow-y: auto;">

	<div style="flex: 1; display: flex; flex-direction: column; background: rgba(0,0,0,.5); padding: 10px; color: white; overflow-y: auto;">
		{#if createJamChannel}
			<CreateJam />
		{:else}
			<!-- TODO: Clean this style up -->
			{#if query.isLoading}
				<div>Loading...</div>
			{:else if errorMessage}
				<div>Error: {errorMessage}</div>
			{:else if query.data && query.data.ok}
				{#each query.data.value as set (set.id)}
					<div style="width: 200px; height: 100px; margin: 4px;">
						<button class="btn btn-dark" onclick={() => playSet(set)}>
							▶ {set.name} ({set.songs.length} songs) {getDuration(set)}
						</button>
					</div>
				{/each}
			{/if}
		{/if}
	</div>
</div>

<style>
	.btn {
		display: inline-block;
		font-weight: 400;
		line-height: 1.5;
		text-align: center;
		text-decoration: none;
		vertical-align: middle;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		background-color: transparent;
		border: 1px solid transparent;
		padding: .35rem .75rem;
		font-size: 1rem;
		border-radius: 5px;
		transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	}

	.btn-dark {
		color: #fff;
		background-color: #1f3040;
		border-color: #343a40;
	}

	.btn:hover {
		color: #fff;
		background-color: #23272b;
		border-color: #1d2124;
	}
</style>
