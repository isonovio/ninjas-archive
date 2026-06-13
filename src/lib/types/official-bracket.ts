import { type DateRangeRaw, DateRange } from "./daterange";
import type { ExternalLink } from "./externlink";
import { type LineupShorthandRaw, Lineup } from "./official-lineup";
import {
    type MatchRaw,
    Match,
    type MatchTag,
    type MatchContext,
} from "./official-match";
import { type CSEvent } from "./official-event";

export type BracketRaw = {
    slug: string;
    name?: string;
    duration?: DateRangeRaw;
    format?: BracketFormat;
    tags?: MatchTag[];
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
    format?: BracketFormat;
    links: ExternalLink[];
    note?: string;
    event: CSEvent;
    parents: Bracket[];
    isTransparent: boolean;
};

export type BracketFormat =
    | "single-elimination"
    | "double-elimination"
    | "round-robin"
    | "swiss";

export namespace Bracket {
    export function fromRaw(
        raw: BracketRaw,
        ctx: MatchContext,
    ): [Bracket, Match[]] {
        const linksFromParent =
            ctx.brackets.length > 0 && ctx.brackets.at(-1)!.isTransparent
                ? ctx.brackets.at(-1)!.links
                : [];
        const linksFromSelf = raw.links ?? [];
        const links = [...linksFromParent, ...linksFromSelf];

        const bracket: Bracket = {
            slug: raw.slug,
            name: raw.name ?? "",
            duration: raw.duration
                ? DateRange.fromRaw(raw.duration)
                : undefined,
            links,
            note: raw.note,
            event: ctx.event,
            parents: ctx.brackets,
            isTransparent: raw.name ? false : true,
        };

        const newCtx: MatchContext = {
            event: ctx.event,
            brackets: [...ctx.brackets, bracket],
            tags: new Set([...ctx.tags, ...(raw.tags ?? [])]),
            lineupShorthands: new Map<string, Lineup>([
                ...ctx.lineupShorthands,
                ...(raw.participants ?? []).map(Lineup.shorthandFromRaw),
            ]),
        };

        if (raw.brackets && raw.matches) {
            throw new Error("Cannot have both brackets and matches");
        } else if (raw.brackets) {
            const matches = raw.brackets
                .map((b) => Bracket.fromRaw(b, newCtx))
                .map(([_, ms]) => ms)
                .flat();
            return [bracket, matches];
        } else if (raw.matches) {
            const matches = raw.matches.map((m) => Match.fromRaw(m, newCtx));
            return [bracket, matches];
        } else {
            return [bracket, []];
        }
    }
}
