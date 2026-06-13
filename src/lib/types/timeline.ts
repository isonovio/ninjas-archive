import { Temporal } from "$lib/utils/temporal";
import { type Related } from "./related";
import { type Newspiece, allNewspieces, compareNewspiece } from "./newspiece";
import { type Omatch, compareOmatch } from "./official-match";
import { allOmatches } from "./official-event";
import { Genre, compareGenre } from "./timeline-genre";

export interface EntryBase {
    genre: Genre;
    related: Related;
    date: Temporal.PlainDate;
}

export type Entry = Newspiece | Omatch;

export const allEntries: Entry[] = [...allNewspieces, ...allOmatches];

export type dailyTimeline = {
    date: Temporal.PlainDate;
    entries: Entry[];
};

export function compareEntry(a: Entry, b: Entry): number {
    const dateCmp = Temporal.PlainDate.compare(a.date, b.date);
    if (dateCmp !== 0) return dateCmp;

    const genreCmp = compareGenre(a.genre, b.genre);
    if (genreCmp !== 0) return genreCmp;

    switch (a.genre) {
        case Genre.NEWSPIECE:
            return compareNewspiece(a, b as Newspiece);
        case Genre.MATCH:
            return compareOmatch(a, b as Omatch);
    }
}

export function groupEntryByDate(entries: Entry[]): dailyTimeline[] {
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
            const sortedEntries = entries.toSorted(compareEntry).toReversed();
            return { date, entries: sortedEntries };
        })
        .toSorted((a, b) => Temporal.PlainDate.compare(b.date, a.date));
}
