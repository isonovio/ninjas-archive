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
import {
    type MatchRaw,
    type Match,
    matchFromRaw,
    type MatchContext,
} from "./official-match";
import { type CSEvent } from "./official-event";

export type BracketRaw = {
    slug: string;
    name: string;
    duration?: DateRangeRaw;
    links?: ExternalLink[];
    participants?: LineupShorthandRaw[];
    num_matches: number;
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
    numMatches: number;
};

export const processRawBracket = (
    raw: BracketRaw,
    ctx: MatchContext,
): Match[] => {
    if (raw.brackets && raw.matches) {
        throw new Error("Cannot have both brackets and matches");
    }

    const bracket = {
        slug: raw.slug,
        name: raw.name,
        duration: raw.duration ? dateRangeFromRaw(raw.duration) : undefined,
        links: raw.links ?? [],
        note: raw.note,
        event: ctx.event,
        parents: ctx.brackets,
        numMatches: raw.num_matches,
    };

    const newCtx: MatchContext = {
        event: ctx.event,
        brackets: [...ctx.brackets, bracket],
        lineupShorthands: new Map<string, Lineup>([
            ...ctx.lineupShorthands,
            ...(raw.participants ?? []).map(lineupShorthandFromRaw),
        ]),
    };
    if (raw.num_matches === 0) {
        if (!raw.brackets) throw new Error("Bracket has no subbrackets");

        return raw.brackets.flatMap((b) => processRawBracket(b, newCtx));
    } else {
        if (!raw.matches) throw new Error("Bracket has no matches");
        return raw.matches.map((m) => matchFromRaw(m, newCtx));
    }
};
