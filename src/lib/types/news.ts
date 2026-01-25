import { Temporal } from "$lib/utils/temporal";
import { type TimelineItemBase } from "$lib/types/timeline";

type NewsEntryRaw = {
    slug: string;
    title: string;
    date: string;
    involves: string[];
    urls: Record<string, string>;
};

const newsRaw = import.meta.glob<NewsEntryRaw>("$lib/data/news/*.json", {
    eager: true,
});

export interface NewsEntry extends TimelineItemBase {
    genre: "news-entry";
    slug: string;
    title: string;
    date: Temporal.PlainDate;
    involves: string[];
    urls: Map<string, string>;
}

export const news: NewsEntry[] = Object.values(newsRaw)
    .map((v) => {
        return {
            ...v,
            genre: "news-entry" as const,
            date: Temporal.PlainDate.from(v.date),
            urls: new Map(Object.entries(v.urls)),
        };
    })
    .sort((a, b) => {
        return b.slug.localeCompare(a.slug);
    });
