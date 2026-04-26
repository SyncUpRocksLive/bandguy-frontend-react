import { Client } from "@/Types/Client";

export interface UserState {
	displayName: string;
	username: string;
	userId: string;
}

export interface ConnectedUser extends UserState {
	isBandLeader: boolean;
	role: string; // Not Set, Drummer, Guitar, Vocals, ...
	client: Client;
}

export enum PeerOperationMode {
	Solo = 'Solo',
	Host = 'Host',
	Guest = 'Guest'
}

export enum SongPlayStatus {
	Play = 'Play',
	Pause = 'Pause',
	Stop = 'Stop'
}
