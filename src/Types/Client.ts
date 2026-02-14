export enum ConnectState {
	NOT_SET = 'NOT_SET',
	CALLING = 'CALLING',
	OFFER = 'RECEIVED_OFFER',
	ANSWER = 'SEND_ANSWER',
	PEERING = 'ATTEMPT_TO_PEER',
	SYNCING = 'SYNCING',
	CONNECTED = 'CONNECTED',
	FAILED = 'FAILED',
	DISCONNECTED = 'DISCONNECTED',
}

export interface Client {
	name: string;
	state: ConnectState;
	peerConnection?: RTCPeerConnection;
	peerChannelRealtime?: RTCDataChannel;
	peerChannelSignalling?: RTCDataChannel;
}
