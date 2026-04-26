import { PeerOperationMode, SongPlayStatus } from "@/Types/Types";
import { JamChannelDetail } from "@shared/services/syncuprocks/musician/JamChannels";
import { writable } from "svelte/store";

export interface SyncStoreItems {
	peerMode: PeerOperationMode;
	availableRemoteChannels?: JamChannelDetail[];
	connectedChannelDetail?: JamChannelDetail;
	currentSetId?: number;
	currentSongId?: number;
	songPlayStatus: SongPlayStatus;
}

// This store handles current song status, modes, tracks, setlists, etc
function createSyncStore () {
	const { subscribe, update } = writable<SyncStoreItems>({
		peerMode: PeerOperationMode.Solo,
		availableRemoteChannels: undefined,
		connectedChannelDetail: undefined,
		currentSetId: undefined,
		currentSongId: undefined,
		songPlayStatus: SongPlayStatus.Stop
	});

	function updateState(patch: Partial<SyncStoreItems>) {
		update((state) => {
			const newState = { ...state, ...patch };

			// your existing logic
			if (newState.peerMode === "Host") {
				//BroadcastMessage({ type: "STATE_UPDATE", state: newState });
			}

			return newState;
		});
	}

	return {
		subscribe,
		updateState
	};
}

export const syncStore = createSyncStore();
