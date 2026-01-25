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
    birthday: Date;
};

export const players: Player[] = Object.values(playersRaw).map((v) => {
    return {
        ...v,
        birthday: new Date(v.birthday),
    };
});
