import { Temporal } from "$lib/utils/temporal";
import {
    type DateRange,
    type DateRangeRaw,
    dateRangeFromRaw,
} from "./daterange";
import { allPlayers, type Player } from "./player";
import { allTeams, type Team } from "./team";

type RosterRaw = {
    slug: string;
    team: string;
    players: string[];
    duration?: DateRangeRaw;
};

const rostersBlob = import.meta.glob<RosterRaw>("$lib/data/rosters/*.json", {
    eager: true,
});

const rostersRaw = Object.values(rostersBlob) satisfies RosterRaw[];

export type Roster = {
    slug: string;
    team: Team;
    players: Player[];
    duration?: DateRange;
};

export const allRosters: ReadonlyMap<string, Roster> = Object.values(rostersRaw)
    .map((v) => {
        return {
            ...v,
            team: allTeams.get(v.team)!,
            players: v.players.map((player) => allPlayers.get(player)!),
            duration: v.duration ? dateRangeFromRaw(v.duration) : undefined,
        };
    })
    .reduce((map, roster) => {
        map.set(roster.slug, roster);
        return map;
    }, new Map<string, Roster>());
