export interface SongOverview {
	id: number;	// Globally unique id of song
	version: number; // timestamp of last change - for caching
	title: string;
}

export interface SetOverview {
	id: number;
	name: string;
	songs: SongOverview[];
}
