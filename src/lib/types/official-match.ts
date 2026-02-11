import { Temporal } from "$lib/utils/temporal";
import { type ExternalLink } from "./externlink";
import { type LineupRaw, type Lineup, lineupFromRaw } from "./official-lineup";
import {
    type MatchMapRaw,
    type MatchMap,
    matchMapFromRaw,
    sumMapResults,
} from "./official-map";
import { type EntryBase } from "./timeline";
import { type Related } from "./related";
import { type CSEvent } from "./official-event";
import { type Bracket } from "./official-bracket";
import { type Outcome, outcomesFromResults } from "./official-outcome";

export type MatchRaw = {
    id: number;
    name?: string;
    date: string;
    lineups: {
        team1: LineupRaw;
        team2: LineupRaw;
    };
    links?: ExternalLink[];
    maps: MatchMapRaw[];
    note?: string;
};

export interface Match extends EntryBase {
    genre: "match";
    related: Related;
    date: Temporal.PlainDate;

    id: number;
    name: string;
    lineups: [Lineup, Lineup];
    links: ExternalLink[];
    results: [number, number];
    outcomes: [Outcome, Outcome];
    maps: MatchMap[];
    note?: string;

    event: CSEvent;
    brackets: Bracket[];
}

export const matchFromRaw = (
    raw: MatchRaw,
    event: CSEvent,
    brackets: Bracket[],
    lineupShorthands: ReadonlyMap<string, Lineup>,
): Match => {
    if (brackets.length === 0) {
        throw new Error("No bracket provided");
    }

    const lineups: [Lineup, Lineup] = [
        lineupFromRaw(raw.lineups.team1, lineupShorthands),
        lineupFromRaw(raw.lineups.team2, lineupShorthands),
    ];

    const related: Related = {
        players: [...lineups[0].players, ...lineups[1].players],
        teams: lineups
            .filter((lineup) => lineup.team !== undefined)
            .map((lineup) => lineup.team!),
        events: [event],
    };

    const maps = raw.maps.map((map) => matchMapFromRaw(map));
    const results = sumMapResults(maps);
    const outcomes = outcomesFromResults(results);

    return {
        genre: "match",
        related,
        date: Temporal.PlainDate.from(raw.date),

        id: raw.id,
        name: raw.name ?? `Match ${raw.id}`,
        lineups,
        links: raw.links ?? [],
        results,
        outcomes,
        maps,
        note: raw.note,

        event,
        brackets,
    };
};

export const matchCompare = (a: Match, b: Match) => {
    const dateCmp = Temporal.PlainDate.compare(a.date, b.date);
    if (dateCmp !== 0) return dateCmp;
    const eventCmp = a.event.slug.localeCompare(b.event.slug);
    if (eventCmp !== 0) return eventCmp;
    a.brackets.forEach((bracket, i) => {
        const bracketCmp = bracket.slug.localeCompare(b.brackets[i].slug);
        if (bracketCmp !== 0) return bracketCmp;
    });
    return a.id - b.id;
};
