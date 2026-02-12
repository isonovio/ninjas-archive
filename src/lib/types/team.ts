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

const teamFromRaw = (raw: TeamRaw): Team => {
    return { ...raw };
};

export const allTeams: ReadonlyMap<string, Team> = new Map(
    teamsRaw.map((team) => [team.slug, teamFromRaw(team)]),
);
