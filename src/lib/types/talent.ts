import { Temporal } from "$lib/utils/temporal";
import { type ExternalLink } from "./externlink";

type TalentRaw = {
    slug: string;
    nickname: string;
    name?: string;
    socials?: ExternalLink[];
};

const talentsBlob = import.meta.glob<TalentRaw>("$lib/data/talents/*.json", {
    eager: true,
});

const talentsRaw = Object.values(talentsBlob) satisfies TalentRaw[];

export type TalentTag = "ninja";

export type Talent = {
    slug: string;
    nickname: string;
    name?: string;
    socials: ExternalLink[];
};

export const allTalents: ReadonlyMap<string, Talent> = talentsRaw
    .map((v) => {
        return {
            ...v,
            socials: v.socials ?? [],
        };
    })
    .reduce((map, talent) => {
        map.set(talent.slug, talent);
        return map;
    }, new Map<string, Talent>());
