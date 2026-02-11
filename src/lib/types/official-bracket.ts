import {
    type DateRangeRaw,
    type DateRange,
    dateRangeFromRaw,
} from "./daterange";
import type { ExternalLink } from "./externlink";
import {
    type LineupShorthandRaw,
    type Lineup,
    lineupShorthandFromRaw,
} from "./official-lineup";
import { type MatchRaw, type Match, matchFromRaw } from "./official-match";
import { type CSEvent } from "./official-event";

export type BracketRaw = {
    slug: string;
    name: string;
    duration?: DateRangeRaw;
    links?: ExternalLink[];
    participants?: LineupShorthandRaw[];
    brackets?: BracketRaw[];
    matches?: MatchRaw[];
    note?: string;
};

export type Bracket = {
    slug: string;
    name: string;
    duration?: DateRange;
    links: ExternalLink[];
    note?: string;
    event: CSEvent;
    parents: Bracket[];
};

export const processRawBracket = (
    raw: BracketRaw,
    event: CSEvent,
    parents: Bracket[],
    lineupShorthands: ReadonlyMap<string, Lineup>,
): Match[] => {
    if (raw.brackets && raw.matches) {
        throw new Error("Cannot have both brackets and matches");
    }

    var newLineupShorthands: Map<string, Lineup> = new Map(lineupShorthands);
    raw.participants?.forEach((p) => {
        const [shorthand, lineup] = lineupShorthandFromRaw(p);
        newLineupShorthands.set(shorthand, lineup);
    });

    const bracket = {
        slug: raw.slug,
        name: raw.name,
        duration: raw.duration ? dateRangeFromRaw(raw.duration) : undefined,
        links: raw.links ?? [],
        note: raw.note,
        event,
        parents,
    };

    const newParents = [...parents, bracket];
    if (raw.brackets) {
        return raw.brackets.flatMap((b) =>
            processRawBracket(b, event, newParents, newLineupShorthands),
        );
    } else if (raw.matches) {
        return raw.matches.map((m) =>
            matchFromRaw(m, event, newParents, newLineupShorthands),
        );
    } else {
        return [];
    }
};
