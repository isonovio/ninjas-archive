import { Temporal } from "$lib/utils/temporal";

type PlayerRaw = {
    slug: string;
    nickname: string;
    name: string;
    birthday?: string;
    nationality: string;
    tags?: string[];
};

const playersBlob = import.meta.glob<PlayerRaw>("$lib/data/players/*.json", {
    eager: true,
});

const playersRaw = Object.values(playersBlob) satisfies PlayerRaw[];

export type PlayerTag = "ninja";

export type Player = {
    slug: string;
    nickname: string;
    name: string;
    birthday?: Temporal.PlainDate;
    nationality: string;
    tags: PlayerTag[];
};

export const allPlayers: ReadonlyMap<string, Player> = playersRaw
    .map((v) => {
        return {
            ...v,
            birthday: v.birthday
                ? Temporal.PlainDate.from(v.birthday)
                : undefined,
            tags: v.tags ? v.tags.map((tag) => tag as PlayerTag) : [],
        };
    })
    .reduce((map, player) => {
        map.set(player.slug, player);
        return map;
    }, new Map<string, Player>());
