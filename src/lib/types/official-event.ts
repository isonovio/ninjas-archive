import { type DateRangeRaw, DateRange } from "./daterange";
import { type ExternalLink } from "./externlink";
import { type LineupShorthandRaw, Lineup } from "./official-lineup";
import { type BracketRaw, Bracket } from "./official-bracket";
import { type Match, type MatchContext, type MatchTag } from "./official-match";

type CSEventRaw = {
    slug: string;
    name: string;
    duration: DateRangeRaw;
    links?: ExternalLink[];
    tags?: MatchTag[];
    participants?: LineupShorthandRaw[];
    brackets: BracketRaw[];
    note?: string;
};

const csEventsBlob = import.meta.glob<CSEventRaw>("$data/**/events/*.json", {
    eager: true,
});

const csEventsRaw = Object.values(csEventsBlob) satisfies CSEventRaw[];

export type CSEvent = {
    slug: string;
    name: string;
    duration: DateRange;
    links: ExternalLink[];
    note?: string;
};

function processRawCSEvent(raw: CSEventRaw): [CSEvent, Match[]] {
    const event = {
        slug: raw.slug,
        name: raw.name,
        duration: DateRange.fromRaw(raw.duration),
        links: raw.links ?? [],
        note: raw.note,
    };

    const ctx: MatchContext = {
        event,
        brackets: [],
        tags: new Set(raw.tags ?? []),
        lineupShorthands: new Map(
            (raw.participants ?? []).map(Lineup.shorthandFromRaw),
        ),
    };

    const matches = raw.brackets
        .map((bracket) => Bracket.fromRaw(bracket, ctx))
        .map(([_, ms]) => ms)
        .flat();

    return [event, matches];
}

export const [allCSEvents, allMatches]: [
    ReadonlyMap<string, CSEvent>,
    Match[],
] = (() => {
    const csEvents: Map<string, CSEvent> = new Map();
    const allMatches: Match[] = [];

    csEventsRaw.forEach((raw) => {
        const [csEvent, matches] = processRawCSEvent(raw);
        csEvents.set(csEvent.slug, csEvent);
        allMatches.push(...matches);
    });

    return [csEvents, allMatches];
})();
