import { writable } from "svelte/store";
import { PeerOperationMode, PeerRole, type ISyncUpOrchestrator } from '@/Types/Types';
import type { JamChannelDetail } from '@shared/services/syncuprocks/musician/JamChannels';
import { LogError, LogInfo } from "@shared/services/Logger";

export interface PeerStoreItems {
	/** Current connection mode */
	peerMode: PeerOperationMode;
	peerRole: PeerRole;
	connectedChannelDetail: JamChannelDetail | null;
}

/** Peer Store - managing host/guest connections based on peer mode */
function createPeerStore () {
	let orchestrator: ISyncUpOrchestrator | null = null;
	
	const { subscribe, update } = writable<PeerStoreItems>({
		peerMode: PeerOperationMode.None,
		peerRole: PeerRole.Player,
		connectedChannelDetail: null
	});

	function updateState(patch: Partial<PeerStoreItems>) {
		update((state) => {
			return { ...state, ...patch };
		});
	}

	return {
		subscribe,
		updateState,

		/** Initiate Orchestrator - used for remote peer management connectivity in different peer modes. */
		linkOrchestrator: (inst: ISyncUpOrchestrator) => { 
			if (!inst) {
				LogError('Unable to set NULL orchestrator!', 'PeerStore::linkOrchestrator()');
				return;
			}

			LogInfo('Setting orchestrator', 'PeerStore::linkOrchestrator()')
			orchestrator = inst; 
		},
        
        /** TODO: Kick a specific user out of jam */
        kickMember: () => {
            // Validate locally if we are the Host Or Peer Role that allows kicking
            //orchestrator?.sendCommand('KICK_MEMBER', { peerId });
        },

		/** TODO: Request update of our leader/peer roles status, current song/set/time, and peers */
        requestStatus: () => {
            //orchestrator?.sendCommand('REQ_LEADER', {});
        },


	};
}

/** Single PeerStore Instance */
export const peerStore = createPeerStore();
