import {
    type Daterange,
    type DaterangeRaw,
    daterangeFromRaw,
} from "./daterange";
import { type ExternalLink } from "./externlink";
import {
    type LineupShorthand,
    processLineupShorthand,
} from "./official-lineup";
import { type ObracketRaw, obracketFromRaw } from "./official-bracket";
import {
    type Omatch,
    type OmatchTag,
    type OmatchContext,
} from "./official-match";

type OeventRaw = {
    slug: string;
    name: string;
    duration: DaterangeRaw;
    links?: ExternalLink[];
    tags?: OmatchTag[];
    participants?: LineupShorthand[];
    brackets: ObracketRaw[];
    note?: string;
};

const oeventBlob = import.meta.glob<OeventRaw>("$data/**/events/*.json", {
    eager: true,
});

const oeventsRaw = Object.values(oeventBlob) satisfies OeventRaw[];

export type Oevent = {
    slug: string;
    name: string;
    duration: Daterange;
    links: ExternalLink[];
    note?: string;
};

function processOeventRaw(raw: OeventRaw): [Oevent, Omatch[]] {
    const event = {
        slug: raw.slug,
        name: raw.name,
        duration: daterangeFromRaw(raw.duration),
        links: raw.links ?? [],
        note: raw.note,
    };

    const ctx: OmatchContext = {
        event,
        brackets: [],
        tags: new Set(raw.tags ?? []),
        lineupShorthands: new Map(
            (raw.participants ?? []).map(processLineupShorthand),
        ),
    };

    const matches = raw.brackets
        .map((b) => obracketFromRaw(b, ctx))
        .map(([_, ms]) => ms)
        .flat();

    return [event, matches];
}

export const [allOevents, allOmatches]: [
    ReadonlyMap<string, Oevent>,
    Omatch[],
] = (() => {
    const csEvents: Map<string, Oevent> = new Map();
    const allMatches: Omatch[] = [];

    oeventsRaw.forEach((raw) => {
        const [csEvent, matches] = processOeventRaw(raw);
        csEvents.set(csEvent.slug, csEvent);
        allMatches.push(...matches);
    });

    return [csEvents, allMatches];
})();
