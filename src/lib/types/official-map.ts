import { type ExternalLink } from "./externlink";
import {
    type Rewatch,
    type RewatchRaw,
    rewatchFromRaw,
} from "./official-rewatch";
import { Outcome, outcomeFromResults } from "./official-outcome";

export type OmapRaw = {
    id: number;
    map: string;
    result: string;
    links?: ExternalLink[];
    rewatches?: RewatchRaw[];
    note?: string;
};

export type Omap = {
    id: number;
    map: string;
    results: [number, number];
    outcomes: [Outcome, Outcome];
    links: ExternalLink[];
    rewatches: Rewatch[];
    note?: string;
};

export function omapFromRaw(raw: OmapRaw): Omap {
    const resultPattern = /^[0-9]+:[0-9]+$/;
    if (!resultPattern.test(raw.result)) {
        throw new Error(`Invalid result format: ${raw.result}`);
    }
    const results = raw.result.split(":").map(Number) as [number, number];

    return {
        id: raw.id,
        map: raw.map,
        results,
        outcomes: outcomeFromResults(results),
        links: raw.links ?? [],
        rewatches: raw.rewatches?.map(rewatchFromRaw) ?? [],
        note: raw.note,
    };
}

export function sumOmapResults(maps: Omap[]): [number, number] {
    const result: [number, number] = [0, 0];
    for (const map of maps) {
        result[0] += map.outcomes[0] == Outcome.WIN ? 1 : 0;
        result[1] += map.outcomes[1] == Outcome.WIN ? 1 : 0;
    }
    return result;
}
