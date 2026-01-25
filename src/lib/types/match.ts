import { Temporal } from "$lib/utils/temporal";
import { type TimelineItemBase } from "$lib/types/timeline";
import { rosters } from "$lib/types/roster";

type EventRaw = {
    slug: string;
    name: string;
    duration: {
        start: string;
        end: string;
    };
    urls?: Record<string, string>;
    participants: Record<string, string>;
    matches: {
        slug: string;
        bracket: string[];
        date: string;
        matchup: {
            team1: string;
            team2: string;
        };
        url?: string;
        maps: {
            slug: string;
            map: string;
            result: string;
            url?: string;
            streams?: {
                url: string;
                caster: string;
                language: string;
                duration?: string;
                tags?: string[];
            }[];
            note?: string;
        }[];
        note?: string;
    }[];
    note?: string;
};

const eventsRaw = import.meta.glob<EventRaw>("$lib/data/events/*.json", {
    eager: true,
});

export interface Match extends TimelineItemBase {
    genre: "match";
    involves: string[];
    date: Temporal.PlainDate;
    eventName: string;
    bracket: string[];
    matchup: [string, string];
    result: [number, number];
    url?: string;
    maps: MatchMap[];
    note?: string;
}

type MatchMap = {
    slug: string;
    map: string;
    result: [number, number];
    url?: string;
    streams?: Stream[];
    note?: string;
};

type Stream = {
    url: string;
    caster: string;
    language: string;
    duration?: string;
    tags?: string[];
};

export const matches: Match[] = (() => {
    var result: Match[] = [];
    Object.values(eventsRaw).forEach((e) => {
        const teams: Map<string, { team: string; players: string[] }> =
            Object.entries(e.participants).reduce((map, [abbr, rosterSlug]) => {
                const roster = rosters.get(rosterSlug)!;
                map.set(abbr, { team: roster.team, players: roster.players });
                return map;
            }, new Map());

        e.matches.forEach((m) => {
            const involves: string[] = [m.matchup.team1, m.matchup.team2]
                .map((t) => {
                    return teams.get(t)?.players ?? [];
                })
                .flat();
            const team1 = teams.get(m.matchup.team1)?.team ?? m.matchup.team1;
            const team2 = teams.get(m.matchup.team2)?.team ?? m.matchup.team2;
            const maps: MatchMap[] = m.maps.map((mm) => {
                const [a, b] = mm.result.split(":").map(Number);
                return {
                    ...mm,
                    result: [a, b],
                };
            });
            var team1w = 0;
            var team2w = 0;
            maps.forEach((mm) => {
                if (mm.result[0] > mm.result[1]) {
                    team1w++;
                } else if (mm.result[0] < mm.result[1]) {
                    team2w++;
                }
            });

            const match: Match = {
                ...m,
                genre: "match",
                involves: involves,
                date: Temporal.PlainDate.from(m.date),
                eventName: e.name,
                matchup: [team1, team2],
                result: [team1w, team2w],
                maps: maps,
            };
            result.push(match);
        });
    });

    return result;
})();
