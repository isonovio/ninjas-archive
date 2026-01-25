import { Temporal } from "$lib/utils/temporal";

type PlayerRaw = {
    slug: string;
    nickname: string;
    name: string;
    birthday: string;
};

const playersRaw = import.meta.glob<PlayerRaw>("$lib/data/players/*.json", {
    eager: true,
});

export type Player = {
    slug: string;
    nickname: string;
    name: string;
    birthday: Temporal.PlainDate;
};

export const players: Map<string, Player[]> = Object.values(playersRaw)
    .map((v) => {
        return {
            ...v,
            birthday: Temporal.PlainDate.from(v.birthday),
        };
    })
    .reduce((map, player) => {
        map.set(player.slug, player);
        return map;
    }, new Map());
