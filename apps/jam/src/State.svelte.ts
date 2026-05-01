import type { MessageBusEvent } from '@/Types/MessageBus';

class AppState {
	// Global state equivalent to react-superstore
	// UI state
	ui = $state({
		isMenuOpen: false,
		lastError: null as string | null,
	});

	constructor() {
	}

	async loadFromStorage() {
		// TODO: load user, peerMode, etc. from localStorage if needed	
	}

	saveToStorage() {
		// TODO: persist state
	}
}

// Export a single instance
export const appState = new AppState();
