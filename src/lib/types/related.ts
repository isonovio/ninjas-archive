import { type Player, allPlayers } from "./player";
import { allTeams, type Team } from "./team";
import { type Oevent, allOevents } from "./official-event";

export type RelatedRaw = {
    players?: string[];
    events?: string[];
    teams?: string[];
};

export type Related = {
    players: Player[];
    events: Oevent[];
    teams: Team[];
};

export function relatedFromRaw(raw: RelatedRaw): Related {
    const players: Player[] =
        raw.players?.map((slug) => allPlayers.get(slug)!) ?? [];
    const teams: Team[] = raw.teams?.map((slug) => allTeams.get(slug)!) ?? [];
    const events: Oevent[] =
        raw.events?.map((slug) => allOevents.get(slug)!) ?? [];
    return { players, events, teams };
}
