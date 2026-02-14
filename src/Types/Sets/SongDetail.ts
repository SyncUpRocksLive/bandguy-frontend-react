
export enum TrackType {
	LeadVocals = 'LeadVocals',
	VocalsGuitar = 'VocalsGuitar',
	Vocals = 'Vocals',
	RhythmGuitar = 'RhythmGuitar',
}

export enum TrackFormat {
	// Lyric File Format (Contains times, and chords)
	Lyric = 'Lyric',
	// Plain text (Static - no time information)
	Text = 'Text,'
}

export interface SongTrack {
	id: string;
	type: TrackType;
	format: TrackFormat;
	description: string; // Lead, Solo, Guitar, Bass, Duet
}
