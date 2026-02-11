import { type Player, allPlayers } from "./player";
import { type Team, allTeams } from "./team";
import { allRosters } from "./roster";

export type LineupRaw = {
    name?: string;
    team?: string;
    roster?: string;
    players?: string[];
    shorthand?: string;
};

export type Lineup = {
    teamname: string;
    players: Player[];
    team?: Team;
};

// precedence: shorthand > name = players > team > roster
export const lineupFromRaw = (
    raw: LineupRaw,
    shorthands: ReadonlyMap<string, Lineup> = new Map(),
): Lineup => {
    if (raw.shorthand) {
        return shorthands.get(raw.shorthand)!;
    }

    var teamname: string | undefined = undefined;
    var players: Player[] | undefined = undefined;
    var team: Team | undefined = undefined;
    if (raw.roster) {
        const roster = allRosters.get(raw.roster)!;
        team = roster.team;
        teamname = roster.team.name;
        players = roster.players;
    }
    if (raw.players) {
        players = raw.players.map((id) => allPlayers.get(id)!);
    }
    if (raw.team) {
        team = allTeams.get(raw.team)!;
        teamname = team.name;
    }
    if (raw.name) {
        teamname = raw.name;
    }
    return {
        teamname: teamname!,
        players: players ?? [],
        team: team,
    };
};

export type LineupShorthandRaw = {
    shorthand: string;
    lineup: LineupRaw;
};

export const lineupShorthandFromRaw = (
    raw: LineupShorthandRaw,
): [string, Lineup] => {
    const lineup = lineupFromRaw(raw.lineup);
    return [raw.shorthand, lineup];
};
