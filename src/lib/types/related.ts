import { allPlayers, type Player } from "./player";
import { allTeams, type Team } from "./team";
import { allCSEvents, type CSEvent } from "./official-event";

export type RelatedRaw = {
    players?: string[];
    events?: string[];
    teams?: string[];
};

export type Related = {
    players: Player[];
    events: CSEvent[];
    teams: Team[];
};

export const relatedFromRaw = (raw: RelatedRaw): Related => {
    const players: Player[] =
        raw.players?.map((slug) => allPlayers.get(slug)!) ?? [];
    const teams: Team[] = raw.teams?.map((slug) => allTeams.get(slug)!) ?? [];
    const events: CSEvent[] =
        raw.events?.map((slug) => allCSEvents.get(slug)!) ?? [];
    return {
        players: players,
        events: events,
        teams: teams,
    };
};
