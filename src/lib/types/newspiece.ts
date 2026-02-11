import { Temporal } from "$lib/utils/temporal";
import { type EntryBase } from "./timeline";
import { type Related, type RelatedRaw, relatedFromRaw } from "./related";
import { type ExternalLink } from "./externlink";

type NewspieceRaw = {
    slug: string;
    title: string;
    date: string;
    related: RelatedRaw;
    links: ExternalLink[];
};

const newsRaw = import.meta.glob<NewspieceRaw>("$lib/data/news/*.json", {
    eager: true,
});

export interface Newspiece extends EntryBase {
    genre: "newspiece";
    slug: string;
    title: string;
    date: Temporal.PlainDate;
    related: Related;
    links: ExternalLink[];
}

export const allNewspieces: Newspiece[] = Object.values(newsRaw).map((v) => {
    return {
        ...v,
        genre: "newspiece" as const,
        date: Temporal.PlainDate.from(v.date),
        related: relatedFromRaw(v.related),
    };
});

export const newspieceCompare = (a: Newspiece, b: Newspiece) => {
    const dateCmp = Temporal.PlainDate.compare(a.date, b.date);
    if (dateCmp !== 0) return dateCmp;
    return a.slug.localeCompare(b.slug);
};
