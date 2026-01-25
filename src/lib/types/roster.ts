import { Temporal } from "$lib/utils/temporal";

type RosterRaw = {
    slug: string;
    team: string;
    players: string[];
    duration: {
        start: string;
        end: string;
    };
};

const rostersRaw = import.meta.glob<RosterRaw>("$lib/data/rosters/*.json", {
    eager: true,
});

export type Roster = {
    slug: string;
    team: string;
    players: string[];
    duration: {
        start: Temporal.PlainDate;
        end: Temporal.PlainDate;
    };
};

export const rosters: Map<string, Roster> = Object.values(rostersRaw)
    .map((v) => {
        return {
            ...v,
            duration: {
                start: Temporal.PlainDate.from(v.duration.start),
                end: Temporal.PlainDate.from(v.duration.end),
            },
        };
    })
    .reduce((map, roster) => {
        map.set(roster.slug, roster);
        return map;
    }, new Map());
