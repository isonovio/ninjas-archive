import { Temporal } from "$lib/utils/temporal";

import { news, type NewsEntry } from "$lib/types/news";
import { matches, type Match } from "$lib/types/match";

type Genre = "news" | "match";

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
    filter: TimelineFilter,
) {
    const { genres, players, dates } = filter;
    return timeline.filter((item) => {
        if (genres && !genres.has(item.genre)) return false;
        if (players && !item.involves.some((p) => new Set(players).has(p)))
            return false;
        if (dates) {
            const { from, to } = dates;
            if (from && item.date < from) return false;
            if (to && item.date > to) return false;
        }
        return true;
    });
}

export type TimelineFilter = {
    genres?: Set<Genre>;
    players?: Set<string>;
    dates?: {
        from?: Temporal.PlainDate;
        to?: Temporal.PlainDate;
    };
};

export function timelineFilterFromParams(params: URLSearchParams) {
    const genres = params.getAll("genre").map((g) => g as Genre);
    const players = params.getAll("player");
    const fromDate = params.get("from")
        ? Temporal.PlainDate.from(params.get("from")!)
        : undefined;
    const toDate = params.get("to")
        ? Temporal.PlainDate.from(params.get("to")!)
        : undefined;
    const dates =
        fromDate || toDate ? { from: fromDate, to: toDate } : undefined;
    return {
        genres: genres.length > 0 ? new Set(genres) : undefined,
        players: players.length > 0 ? new Set(players) : undefined,
        dates,
    };
}

export function timelineFilterToParams(filter: TimelineFilter) {
    const params = new URLSearchParams();
    if (filter.genres) {
        filter.genres.forEach((genre) => params.append("genre", genre));
    }
    if (filter.players) {
        filter.players.forEach((player) => params.append("player", player));
    }
    if (filter.dates) {
        if (filter.dates.from) params.set("from", filter.dates.from.toString());
        if (filter.dates.to) params.set("to", filter.dates.to.toString());
    }
    return params.toString();
}
