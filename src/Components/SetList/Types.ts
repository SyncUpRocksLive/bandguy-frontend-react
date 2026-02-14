import { SetOverview } from "@/Types/Sets/SetOverview";
import { SongTrack } from "@/Types/Sets/SongDetail";

export interface SetQueryResponse {
	sets: SetOverview[];
}

export interface SongDetailResponse {
	length?: string;
	duration: number;
	tracks: SongTrack[];
}
