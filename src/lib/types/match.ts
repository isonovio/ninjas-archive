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
                caster: string;
                language: string;
                parts: {
                    name: string;
                    url: string;
                    duration?: string;
                }[];
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
    teamInvolves: [string[], string[]];
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
    caster: string;
    language: string;
    parts: {
        name: string;
        url: string;
        duration?: string;
    }[];
    tags?: string[];
};

export function streamTimedUrl(url: string, duration?: string): string {
    if (!duration) return url;

    const [start, _] = duration.split("-");
    const [startHour, startMinute, startSecond] = start.split(":").map(Number);

    if (url.includes("youtu.be")) {
        const startBySeconds =
            startHour * 3600 + startMinute * 60 + startSecond;
        return `${url}?t=${startBySeconds}`;
    } else if (url.includes("twitch.tv")) {
        return `${url}?t=${startHour}h${startMinute}m${startSecond}s`;
    } else {
        return url;
    }
}

type Outcome = "win" | "draw" | "lose";

export const matches: Match[] = (() => {
    var result: Match[] = [];
    Object.values(eventsRaw).forEach((e) => {
        const teams: Map<string, { team: string; players: string[] }> =
            Object.entries(e.participants).reduce((map, [abbr, rosterSlug]) => {
                const roster = rosters.get(rosterSlug)!;
                map.set(abbr, roster);
                return map;
            }, new Map());

        e.matches.forEach((m) => {
            const t1Involves = teams.get(m.matchup.team1)?.players ?? [];
            const t2Involves = teams.get(m.matchup.team2)?.players ?? [];
            const involves: string[] = [...t1Involves, ...t2Involves];
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
                teamInvolves: [t1Involves, t2Involves],
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
