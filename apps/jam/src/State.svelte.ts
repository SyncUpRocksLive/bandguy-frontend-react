import type { MessageBusEvent } from '@/Types/MessageBus';
import { CreateSongStore } from './Support/Stores/SongStore';

	// {#if appState.store.peerMode === PeerOperationMode.Host}
	// 	<BandLeaderService />
	// {/if}

	// {#if appState.store.peerMode === PeerOperationMode.Guest}
	// 	<FollowerService />
	// {/if}

	// {#if appState.store.peerMode !== PeerOperationMode.Solo}
	// 	<MessageChannelService />
	// {/if}

class AppState {
	// Global state equivalent to react-superstore
	// UI state
	ui = $state({
		isMenuOpen: false,
		lastError: null as string | null,
	});

	songStore = CreateSongStore();

	constructor() {
	}

	async loadFromStorage() {
		// TODO: load user, peerMode, etc. from localStorage if needed
		await this.songStore.initialize();
		await this.songStore.vacuum();
		
	}

	saveToStorage() {
		// TODO: persist state
	}
}

// Export a single instance
export const appState = new AppState();
