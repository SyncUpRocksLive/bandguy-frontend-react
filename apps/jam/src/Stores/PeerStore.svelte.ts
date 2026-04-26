import { writable } from "svelte/store";

// Peering state
// function createPeerStore () {
// 	const { subscribe, update } = writable<SyncStoreItems>({
// 		peerMode: PeerOperationMode.Solo,
// 		availableRemoteChannels: undefined,
// 		connectedChannelDetail: undefined,
// 		currentSetId: undefined,
// 		currentSongId: undefined,
// 		songPlayStatus: SongPlayStatus.Stop
// 	});

// 	function updateState(patch: Partial<SyncStoreItems>) {
// 		update((state) => {
// 			const newState = { ...state, ...patch };

// 			// your existing logic
// 			if (newState.peerMode === "Host") {
// 				//BroadcastMessage({ type: "STATE_UPDATE", state: newState });
// 			}

// 			return newState;
// 		});
// 	}

// 	return {
// 		subscribe,
// 		updateState
// 	};
// }

// export const peerStore = createPeerStore();
