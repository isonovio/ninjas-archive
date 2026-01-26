import { Temporal } from "$lib/utils/temporal";

import { news, type NewsEntry } from "$lib/types/news";
import { matches, type Match } from "$lib/types/match";

export type Genre = "news" | "match";

export interface TimelineItemBase {
    genre: Genre;
    involves: string[];
    date: Temporal.PlainDate;
}

export type TimelineItem = NewsEntry | Match;

export const timeline: TimelineItem[] = [...news, ...matches];

export function timelineGroupSortByDate(
    items: TimelineItem[],
): [Temporal.PlainDate, TimelineItem[]][] {
    const map = new Map<
        string,
        { date: Temporal.PlainDate; items: TimelineItem[] }
    >();
    items.forEach((item) => {
        const dateKey = item.date.toString();
        if (!map.has(dateKey)) {
            map.set(dateKey, { date: item.date, items: [] });
        }
        map.get(dateKey)!.items.push(item);
    });
    return [...map.values()]
        .map(
            ({ date, items }) =>
                [date, items] as [Temporal.PlainDate, TimelineItem[]],
        )
        .sort(([dateA], [dateB]) => Temporal.PlainDate.compare(dateB, dateA));
}

export function filterTimeline(
    timeline: TimelineItem[],
    filter: TimelineFilter | undefined,
) {
    if (!filter) return timeline;

    return timeline.filter((item) => {
        const { genres, players, dates } = filter;
        if (genres.size > 0) return genres.has(item.genre);
        if (players.size > 0)
            return item.involves.some((p) => new Set(players).has(p));
        const { from, to } = dates;
        if (from) return Temporal.PlainDate.compare(item.date, from) >= 0;
        if (to) return Temporal.PlainDate.compare(item.date, to) <= 0;
        return true;
    });
}

export class TimelineFilter {
    genres: Set<Genre> = new Set();
    players: Set<string> = new Set();
    dates: {
        from?: Temporal.PlainDate;
        to?: Temporal.PlainDate;
    } = { from: undefined, to: undefined };

    constructor(ops?: {
        genres?: Genre[];
        players?: string[];
        fromDate?: Temporal.PlainDate;
        toDate?: Temporal.PlainDate;
    }) {
        if (ops?.genres) this.genres = new Set(ops.genres);
        if (ops?.players) this.players = new Set(ops.players);
        if (ops?.fromDate) this.dates.from = ops.fromDate;
        if (ops?.toDate) this.dates.to = ops.toDate;
    }
}

export function timelineFilterFromParams(
    params: URLSearchParams,
): TimelineFilter {
    const genres = params.getAll("genre").map((g) => g as Genre);
    const players = params.getAll("player");
    const fromDate = params.get("from")
        ? Temporal.PlainDate.from(params.get("from")!)
        : undefined;
    const toDate = params.get("to")
        ? Temporal.PlainDate.from(params.get("to")!)
        : undefined;
    return {
        genres: new Set(genres),
        players: new Set(players),
        dates: { from: fromDate, to: toDate },
    };
}

export function timelineFilterToParams(filter: TimelineFilter) {
    const params = new URLSearchParams();
    filter.genres.forEach((genre) => params.append("genre", genre));
    filter.players.forEach((player) => params.append("player", player));
    if (filter.dates.from) params.set("from", filter.dates.from.toString());
    if (filter.dates.to) params.set("to", filter.dates.to.toString());
    return params.toString();
}
