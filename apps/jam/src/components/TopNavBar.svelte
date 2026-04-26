<script lang="ts">
	import { auth } from '../Auth.svelte';
	import { router } from '../Router.svelte';
	import { syncStore } from '@/Stores/SyncStore.svelte';
	import { PeerOperationMode } from '../Types/Types';
	import Configuration from './NavModals/Configuration.svelte';
	import HostModeStatus from './NavModals/HostModeStatus.svelte';
	import GuestModeStatus from './NavModals/GuestModeStatus.svelte';
	import UserProfile from './NavModals/UserProfile.svelte';
</script>

{#if auth.user}
	<header>
		<div style="padding: 3px 10px 0 10px; width: 100%; display: flex; flex-direction: row; color: white; background: rgba(155,155,155,.1); justify-content: center; align-items: center;">
			<a href="/">HOME</a> -
			<a href="#/" onclick={router.linkTo('Home').onclick}>JAM</a> -
			<a href="/mixingroom">MIXING ROOM</a>

			<div style="user-select: none;">
				- {$syncStore.peerMode}
			</div>

			<div style="flex: auto; display: flex; flex-direction: row; column-gap: 0; justify-content: right; align-items: right;">
				{#if $syncStore.peerMode === PeerOperationMode.Host}
					<HostModeStatus />
				{:else if $syncStore.peerMode === PeerOperationMode.Guest}
					<GuestModeStatus />
				{/if}
				<Configuration />
				<UserProfile />
			</div>
		</div>
	</header>
{:else}
	<header></header>
{/if}

<style>
	a {
		color: white;
		text-decoration: none;
		margin: 0 5px;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
