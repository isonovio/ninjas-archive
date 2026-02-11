type TeamRaw = {
    slug: string;
    name: string;
};

const teamsBlob = import.meta.glob<TeamRaw>("$lib/data/teams/*.json", {
    eager: true,
});

const teamsRaw = Object.values(teamsBlob) satisfies TeamRaw[];

export type Team = {
    slug: string;
    name: string;
};

export const allTeams: ReadonlyMap<string, Team> = teamsRaw
    .map((v) => {
        return {
            ...v,
        };
    })
    .reduce((map, team) => {
        map.set(team.slug, team);
        return map;
    }, new Map<string, Team>());
