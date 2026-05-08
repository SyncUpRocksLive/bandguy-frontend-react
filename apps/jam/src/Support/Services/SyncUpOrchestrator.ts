// rtcManager.ts
import { peerStore } from '@/Stores/PeerStore.svelte';
import { syncStore, type SyncStoreItems } from '@/Stores/SyncStore.svelte';
import { PeerOperationMode, PeerRole, type ISyncUpOrchestrator } from '@/Types/Types'
import { LogError, LogInfo, LogVerbose } from '@shared/services/Logger';

class SyncUpOrchestrator implements ISyncUpOrchestrator {
	// Local cache of state
    private peerOperationMode: PeerOperationMode | null = null;
	private cachedSyncStoreItems: SyncStoreItems | null = null;

    constructor() {
		LogInfo('Created - watching peerStore / syncStore', 'SyncUpOrchestrator::constructor()');

        // Subscribe to PeerStore to manage the connection lifecycle
        peerStore.subscribe(state => {
            this.handleModeChange(state.peerMode);
        });

        // Subscribe to SyncStore to broadcast changes if we are the Host
        syncStore.subscribe(state => {
			if (this.peerOperationMode === PeerOperationMode.Host) {
				// TODO send
			}

			this.cachedSyncStoreItems = { ...state };
        });
    }

    private handleModeChange(mode: PeerOperationMode) {
		if (this.peerOperationMode === mode) return;

		this.peerOperationMode = mode;

		const context = `SyncUpOrchestrator::handleModeChange(${mode})`;
		LogVerbose(`Configuring PeerMode: ${mode}`, context);

		let peerRole = PeerRole.Leader;

		// TODO: store last mode to prevent invalid cleanup/re-init
        if (mode === PeerOperationMode.None || mode === PeerOperationMode.Solo) {
            // Remove channels, status, etc
			LogVerbose('closing connections', context);
        } else if (mode === PeerOperationMode.Host) {
            // Setup for host operations
        } else if (mode === PeerOperationMode.Guest) {
			// This may change later
			peerRole = PeerRole.Player;			
		} else {
			LogError('unsupported mode!!!', context);
			return
		}

		peerStore.updateState({peerRole: peerRole, connectedChannelDetail: null});
    }

    private broadcastSync(state: SyncStoreItems) {
        // Only broadcast essential playhead/status data to minimize jitter
        // const packet = {
        //     t: state.playbackTimeMilliseconds,
        //     s: state.songPlayStatus,
		//     sid: state.currentSetId,
        //     id: state.currentSongId,
        //     ts: Date.now() // For drift calculation
        // };
        // this.dataChannel?.send(JSON.stringify(packet));
    }
}

// Create the single instance
export const orchestrator = new SyncUpOrchestrator();
