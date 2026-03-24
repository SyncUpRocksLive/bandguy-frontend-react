
export enum TrackType {
	Guitar = 'Guitar',
	Vocals = 'Vocals',
	RhythmGuitar = 'RhythmGuitar',
}

export enum TrackFormat {
	// Lyric File Format (Contains times, and chords)
	Lyric = 'Lyric',
	// Plain text (Static - no time information)
	Text = 'Text,'
}

export interface Track {
	id: number;
	songId: number;
	fileSetId: number;
	name: TrackType;
	type: TrackType;
	format: TrackFormat;
	createdAt: number;
	versionNumber: number;
	configuration?: string;
}

export interface Song {
	id: number;
	ownerId: string;
	name: string;
	durationMilliseconds: number;
	createdAt: number;
	configuration?: string;
	tracks: Track[];
}
