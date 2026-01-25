import { Temporal } from "$lib/utils/temporal";

import { news, type NewsEntry } from "$lib/types/news";

export interface TimelineItemBase {
    genre: NewsEntry["genre"] | "birthday";
    involves: string[];
    date: Temporal.PlainDate;
}

type TimelineItem = NewsEntry;

export const timeline: TimelineItem[] = news;

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
