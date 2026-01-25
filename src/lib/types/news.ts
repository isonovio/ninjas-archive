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

export type NewsEntry = {
    genre: "news-entry";
    slug: string;
    title: string;
    date: Date;
    involves: string[];
    urls: Map<string, string>;
};

export const news: NewsEntry[] = Object.values(newsRaw).map((v) => {
    return {
        ...v,
        genre: "news-entry",
        date: new Date(v.date),
        urls: new Map(Object.entries(v.urls)),
    };
});
