import { type ExternalLink } from "./externlink";
import { type RewatchRaw, Rewatch } from "./official-rewatch";
import { Outcome } from "./official-outcome";

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

export namespace MatchMap {
    export function fromRaw(raw: MatchMapRaw): MatchMap {
        const resultPattern = /^[0-9]+:[0-9]+$/;
        if (!resultPattern.test(raw.result)) {
            throw new Error(`Invalid result format: ${raw.result}`);
        }
        const results = raw.result.split(":").map(Number) as [number, number];

        return {
            id: raw.id,
            map: raw.map,
            results,
            outcomes: Outcome.fromResults(results),
            links: raw.links ?? [],
            rewatches: raw.rewatches?.map(Rewatch.fromRaw) ?? [],
            note: raw.note,
        };
    }

    export function sumResults(maps: MatchMap[]): [number, number] {
        const result: [number, number] = [0, 0];
        for (const map of maps) {
            result[0] += map.outcomes[0] == Outcome.WIN ? 1 : 0;
            result[1] += map.outcomes[1] == Outcome.WIN ? 1 : 0;
        }
        return result;
    }
}
