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
    slug: string;
    eventSlug: string;
    eventName: string;
    bracket: string[];
    title: string;
    matchup: [string, string];
    result: [number, number];
    outcomes: [Outcome, Outcome];
    url?: string;
    maps: MatchMap[];
    note?: string;
}

type MatchMap = {
    slug: string;
    map: string;
    result: [number, number];
    outcomes: [Outcome, Outcome];
    url?: string;
    streams?: Stream[];
    note?: string;
};

export type Stream = {
    url: string;
    caster: string;
    language: string;
    duration?: string;
    tags?: string[];
};

type Outcome = "win" | "draw" | "lose";

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
            const maps: MatchMap[] = m.maps
                .map((mm) => {
                    const [team1s, team2s] = mm.result.split(":").map(Number);
                    const outcomes: [Outcome, Outcome] = (() => {
                        if (team1s > team2s) {
                            return ["win", "lose"];
                        } else if (team1s < team2s) {
                            return ["lose", "win"];
                        } else {
                            return ["draw", "draw"];
                        }
                    })();
                    return {
                        ...mm,
                        result: [team1s, team2s],
                        outcomes: outcomes,
                    };
                })
                .sort((a, b) => b.slug.localeCompare(a.slug)) as MatchMap[];
            var team1w = 0;
            var team2w = 0;
            maps.forEach((mm) => {
                if (mm.result[0] > mm.result[1]) {
                    team1w++;
                } else if (mm.result[0] < mm.result[1]) {
                    team2w++;
                }
            });
            const outcomes: [Outcome, Outcome] = (() => {
                if (team1w > team2w) {
                    return ["win", "lose"];
                } else if (team1w < team2w) {
                    return ["lose", "win"];
                } else {
                    return ["draw", "draw"];
                }
            })();
            const title = `${e.name} - ${m.bracket.join(" - ")}`;

            const match: Match = {
                ...m,
                genre: "match",
                involves: involves,
                date: Temporal.PlainDate.from(m.date),
                eventSlug: e.slug,
                eventName: e.name,
                title: title,
                matchup: [team1, team2],
                result: [team1w, team2w],
                outcomes: outcomes,
                maps: maps,
            };
            result.push(match);
        });
    });

    result.sort((a, b) => {
        const compEvent = b.eventSlug.localeCompare(a.eventSlug);
        if (compEvent !== 0) {
            return compEvent;
        }
        return b.slug.localeCompare(a.slug);
    });

    return result;
})();
