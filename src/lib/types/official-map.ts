import { type ExternalLink } from "./externlink";
import {
    type Rewatch,
    type RewatchRaw,
    rewatchFromRaw,
} from "./official-rewatch";
import { type Outcome, outcomesFromResults } from "./official-outcome";

export type MatchMapRaw = {
    id: number;
    map: string;
    result: string;
    links?: ExternalLink[];
    rewatches?: RewatchRaw[];
    note?: string;
};

export type MatchMap = {
    id: number;
    map: string;
    results: [number, number];
    outcomes: [Outcome, Outcome];
    links: ExternalLink[];
    rewatches: Rewatch[];
    note?: string;
};

export const matchMapFromRaw = (raw: MatchMapRaw): MatchMap => {
    const resultPattern = /^[0-9]+:[0-9]+$/;
    if (!resultPattern.test(raw.result)) {
        throw new Error(`Invalid result format: ${raw.result}`);
    }
    const results = raw.result.split(":").map(Number) as [number, number];

    return {
        id: raw.id,
        map: raw.map,
        results,
        outcomes: outcomesFromResults(results),
        links: raw.links ?? [],
        rewatches: raw.rewatches?.map(rewatchFromRaw) ?? [],
        note: raw.note,
    };
};

export const sumMapResults = (maps: MatchMap[]): [number, number] => {
    var result: [number, number] = [0, 0];
    for (const map of maps) {
        result[0] += map.outcomes[0] == "win" ? 1 : 0;
        result[1] += map.outcomes[1] == "win" ? 1 : 0;
    }
    return result;
};
