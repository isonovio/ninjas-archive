import { Temporal } from "$lib/utils/temporal";
import { type Related } from "./related";
import { type Newspiece, allNewspieces, newspieceCompare } from "./newspiece";
import { type Match, matchCompare } from "./official-match";
import { allMatches } from "./official-event";
import { Genre, compare as genreCompare } from "./timeline-genre";

export interface EntryBase {
    genre: Genre;
    related: Related;
    date: Temporal.PlainDate;
}

export type Entry = Newspiece | Match;

export const allEntries: Entry[] = [...allNewspieces, ...allMatches];

export const entryCompare = (a: Entry, b: Entry) => {
    const dateCmp = Temporal.PlainDate.compare(a.date, b.date);
    if (dateCmp !== 0) return dateCmp;

    const genreCmp = genreCompare(a.genre, b.genre);
    if (genreCmp !== 0) return genreCmp;

    switch (a.genre) {
        case Genre.NEWSPIECE:
            return newspieceCompare(a, b as Newspiece);
        case Genre.MATCH:
            return matchCompare(a, b as Match);
    }
};

export type dailyTimeline = {
    date: Temporal.PlainDate;
    entries: Entry[];
};

export const entriesGroupSortByDate = (entries: Entry[]): dailyTimeline[] => {
    const map = new Map<string, dailyTimeline>();
    entries.forEach((entry) => {
        const dateKey = entry.date.toString();
        if (!map.has(dateKey)) {
            map.set(dateKey, { date: entry.date, entries: [] });
        }
        map.get(dateKey)!.entries.push(entry);
    });
    return [...map.values()]
        .map(({ date, entries }) => {
            const sortedEntries = entries.toSorted(entryCompare).toReversed();
            return { date, entries: sortedEntries };
        })
        .toSorted((a, b) => Temporal.PlainDate.compare(b.date, a.date));
};
