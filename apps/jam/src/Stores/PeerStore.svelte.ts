import { writable } from "svelte/store";
import { PeerOperationMode } from '@/Types/Types';
import type { JamChannelDetail } from '@shared/services/syncuprocks/musician/JamChannels';

export interface PeerStoreItems {
	/** Current connection mode */
	peerMode: PeerOperationMode;
	availableRemoteChannels?: JamChannelDetail[];
	connectedChannelDetail?: JamChannelDetail;
}

/** Peer Store - managing host/guest connections based on peer mode */
function createPeerStore () {
	const { subscribe, update } = writable<PeerStoreItems>({
		peerMode: PeerOperationMode.None,
		availableRemoteChannels: undefined,
		connectedChannelDetail: undefined
	});

	function updateState(patch: Partial<PeerStoreItems>) {
		update((state) => {
			const newState = { ...state, ...patch };

			// your existing logic
			//if (newState.peerMode === "Host") {
			//	//BroadcastMessage({ type: "STATE_UPDATE", state: newState });
			//}

			return newState;
		});
	}

	return {
		subscribe,
		updateState
	};
}

/** Single PeerStore Instance */
export const peerStore = createPeerStore();
