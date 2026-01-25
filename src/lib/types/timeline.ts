import { news, type NewsEntry } from "$lib/types/news";

interface TimelineItem {
    genre: NewsEntry["genre"] | "birthday";
    involves: string[];
    date: Date;
}

export const timeline: TimelineItem[] = news;

export function timelineGroupSortByDate(
    items: TimelineItem[],
): [Date, TimelineItem[]][] {
    const map = new Map<Date, TimelineItem[]>();
    items.forEach((item) => {
        const date = item.date;
        const group = map.get(date) || [];
        group.push(item);
        map.set(date, group);
    });
    return [...map].sort(
        ([dateA], [dateB]) => dateB.getTime() - dateA.getTime(),
    );
}
