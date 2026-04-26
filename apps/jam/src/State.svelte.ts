import type { MessageBusEvent } from '@/Types/MessageBus';

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

	constructor() {
		// Initialize from localStorage or defaults
		this.loadFromStorage();
	}

	loadFromStorage() {
		// TODO: load user, peerMode, etc. from localStorage if needed
	}

	saveToStorage() {
		// TODO: persist state
	}
}

// Export a single instance
export const appState = new AppState();
