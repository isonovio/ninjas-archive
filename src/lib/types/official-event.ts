import {
    type DateRangeRaw,
    type DateRange,
    dateRangeFromRaw,
} from "./daterange";
import { type ExternalLink } from "./externlink";
import {
    type LineupShorthandRaw,
    lineupShorthandFromRaw,
} from "./official-lineup";
import { type BracketRaw, processRawBracket } from "./official-bracket";
import { type Match, type MatchContext } from "./official-match";

type CSEventRaw = {
    slug: string;
    name: string;
    duration: DateRangeRaw;
    links?: ExternalLink[];
    participants?: LineupShorthandRaw[];
    brackets: BracketRaw[];
    note?: string;
};

const csEventsBlob = import.meta.glob<CSEventRaw>("$lib/data/events/*.json", {
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

const processRawCSEvent = (raw: CSEventRaw): [CSEvent, Match[]] => {
    const event = {
        slug: raw.slug,
        name: raw.name,
        duration: dateRangeFromRaw(raw.duration),
        links: raw.links ?? [],
        note: raw.note,
    };

    const ctx: MatchContext = {
        event,
        brackets: [],
        lineupShorthands: new Map(
            (raw.participants ?? []).map(lineupShorthandFromRaw),
        ),
    };

    const matches = raw.brackets.flatMap((bracket) =>
        processRawBracket(bracket, ctx),
    );

    return [event, matches];
};

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
