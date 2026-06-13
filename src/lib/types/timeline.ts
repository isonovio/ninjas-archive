import { Temporal } from "$lib/utils/temporal";
import { type Related } from "./related";
import { Newspiece, allNewspieces } from "./newspiece";
import { Match } from "./official-match";
import { allMatches } from "./official-event";
import { Genre } from "./timeline-genre";

export interface EntryBase {
    genre: Genre;
    related: Related;
    date: Temporal.PlainDate;
}

export type Entry = Newspiece | Match;

export const allEntries: Entry[] = [...allNewspieces, ...allMatches];

export type dailyTimeline = {
    date: Temporal.PlainDate;
    entries: Entry[];
};

export namespace Entry {
    export function compare(a: Entry, b: Entry): number {
        const dateCmp = Temporal.PlainDate.compare(a.date, b.date);
        if (dateCmp !== 0) return dateCmp;

        const genreCmp = Genre.compare(a.genre, b.genre);
        if (genreCmp !== 0) return genreCmp;

        switch (a.genre) {
            case Genre.NEWSPIECE:
                return Newspiece.compare(a, b as Newspiece);
            case Genre.MATCH:
                return Match.compare(a, b as Match);
        }
    }

    export function groupByDate(entries: Entry[]): dailyTimeline[] {
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
                const sortedEntries = entries.toSorted(Entry.compare).toReversed();
                return { date, entries: sortedEntries };
            })
            .toSorted((a, b) => Temporal.PlainDate.compare(b.date, a.date));
    }
}
