import type { PeerOperationMode, ConnectedUser, SongPlayStatus, StoreItems } from '@/Types/Types';
import type { MessageBusEvent } from '@/Types/MessageBus';

// Correct UserState interface
interface UserState {
	displayName: string;
	username: string;
	userId: string;
}

interface AppStoreItems extends StoreItems {
	messageBus: MessageBusEvent[] | null; // TODO: define MessageBus properly
}

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
	store = $state<AppStoreItems>({
		user: undefined,
		peerMode: 'Solo' as PeerOperationMode,
		connectedUsers: [],
		currentSetId: undefined,
		currentSongId: undefined,
		songPlayStatus: 'Stop' as SongPlayStatus,
		messageBus: null,
	});

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

	updateStore(updates: Partial<AppStoreItems>) {
		Object.assign(this.store, updates);
		this.saveToStorage();
	}

	setPeerMode(mode: PeerOperationMode) {
		this.updateStore({ peerMode: mode });
	}

	setCurrentSet(setId: number | undefined) {
		this.updateStore({ currentSetId: setId });
	}

	setCurrentSong(songId: number | undefined) {
		this.updateStore({ currentSongId: songId });
	}
}

// Export a single instance
export const appState = new AppState();
