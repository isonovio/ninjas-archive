import { type Talent, allTalents } from "./talent";
import { type Video, type VideoRaw, videoFromRaw } from "./video";

export type RewatchTag = "official" | "incomplete";

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

export const rewatchFromRaw = (raw: RewatchRaw): Rewatch => {
    const casters = raw.casters.map((caster) => allTalents.get(caster)!);
    const parts = raw.parts.map((part) => videoFromRaw(part));
    const tags = raw.tags?.map((tag) => tag as RewatchTag) || [];
    return {
        casters,
        language: raw.language,
        parts,
        tags,
    };
};
