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

const talentFromRaw = (raw: TalentRaw): Talent => {
    return {
        ...raw,
        socials: raw.socials ?? [],
    };
};

export const allTalents: ReadonlyMap<string, Talent> = new Map(
    talentsRaw.map((talent) => [talent.slug, talentFromRaw(talent)]),
);
