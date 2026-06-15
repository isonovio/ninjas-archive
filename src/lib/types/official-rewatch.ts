import { type Talent, allTalents } from "./talent";
import { type Video, type VideoRaw, videoFromRaw } from "./video";

type RewatchTag = "official" | "incomplete";

export type RewatchRaw = {
    casters: string[];
    language: string;
    parts: VideoRaw[];
    tags?: string[];
};

export type Rewatch = {
    casters: Talent[];
    language: string;
    parts: Video[];
    tags: RewatchTag[];
};

export function rewatchFromRaw(raw: RewatchRaw): Rewatch {
    const casters = raw.casters.map((caster) => allTalents.get(caster)!);
    const parts = raw.parts.map(videoFromRaw);
    const tags = raw.tags?.map((tag) => tag as RewatchTag) ?? [];
    return {
        casters,
        language: raw.language,
        parts,
        tags,
    };
}
