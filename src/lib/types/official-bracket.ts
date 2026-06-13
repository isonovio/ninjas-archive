import {
    type Daterange,
    type DaterangeRaw,
    daterangeFromRaw,
} from "./daterange";
import type { ExternalLink } from "./externlink";
import { type Lineup, processLineupShorthand } from "./official-lineup";
import { type LineupShorthand } from "./official-lineup";
import {
    type Omatch,
    type OmatchRaw,
    type OmatchContext,
    type OmatchTag,
    omatchFromRaw,
} from "./official-match";
import { type Oevent } from "./official-event";

type ObracketFormat =
    | "single-elimination"
    | "double-elimination"
    | "round-robin"
    | "swiss";

export type ObracketRaw = {
    slug: string;
    name?: string;
    duration?: DaterangeRaw;
    format?: ObracketFormat;
    tags?: OmatchTag[];
    links?: ExternalLink[];
    participants?: LineupShorthand[];
    brackets?: ObracketRaw[];
    matches?: OmatchRaw[];
    note?: string;
};

export type Obracket = {
    slug: string;
    name: string;
    duration?: Daterange;
    format?: ObracketFormat;
    links: ExternalLink[];
    note?: string;
    event: Oevent;
    parents: Obracket[];
    isTransparent: boolean;
};

export function obracketFromRaw(
    raw: ObracketRaw,
    ctx: OmatchContext,
): [Obracket, Omatch[]] {
    const linksFromParent =
        ctx.brackets.length > 0 && ctx.brackets.at(-1)!.isTransparent
            ? ctx.brackets.at(-1)!.links
            : [];
    const linksFromSelf = raw.links ?? [];
    const links = [...linksFromParent, ...linksFromSelf];

    const bracket: Obracket = {
        slug: raw.slug,
        name: raw.name ?? "",
        duration: raw.duration ? daterangeFromRaw(raw.duration) : undefined,
        links,
        note: raw.note,
        event: ctx.event,
        parents: ctx.brackets,
        isTransparent: raw.name ? false : true,
    };

    const newCtx: OmatchContext = {
        event: ctx.event,
        brackets: [...ctx.brackets, bracket],
        tags: new Set([...ctx.tags, ...(raw.tags ?? [])]),
        lineupShorthands: new Map<string, Lineup>([
            ...ctx.lineupShorthands,
            ...(raw.participants ?? []).map(processLineupShorthand),
        ]),
    };

    if (raw.brackets && raw.matches) {
        throw new Error("Cannot have both brackets and matches");
    } else if (raw.brackets) {
        const matches = raw.brackets
            .map((b) => obracketFromRaw(b, newCtx))
            .map(([_, ms]) => ms)
            .flat();
        return [bracket, matches];
    } else if (raw.matches) {
        const matches = raw.matches.map((m) => omatchFromRaw(m, newCtx));
        return [bracket, matches];
    } else {
        return [bracket, []];
    }
}
