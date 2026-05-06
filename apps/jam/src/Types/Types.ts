
export interface ISyncUpOrchestrator {
	
}

/**
 * Player: ReadOnly view
 * Leader: Ability to set current setlist/song/play position
 */
export enum PeerRole {
	Player = 'Player',
	Leader = 'Leader'
}

/** None: No current value set
 * Solo: No Remote Connections Posible
 * Host: Controlling master clock/and relaying any co-leader requests
 * Guest: Depending on PeerRole, may be co-leader. But, does not control clock.
 */
export enum PeerOperationMode {
	None = 'None',
	Solo = 'Solo',
	Host = 'Host',
	Guest = 'Guest'
}

export enum SongPlayStatus {
	Play = 'Play',
	Pause = 'Pause',
	Stop = 'Stop'
}
