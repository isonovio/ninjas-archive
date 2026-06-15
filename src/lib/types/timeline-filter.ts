import { Temporal } from "$lib/utils/temporal";
import { type Entry } from "./timeline";
import { Genre } from "./timeline-genre";
import { type OmatchTag } from "./official-match";

export interface EntryFilter {
    filter(e: Entry): boolean;
}

export class AndFilter implements EntryFilter {
    constructor(private filters: EntryFilter[]) {}

    filter(e: Entry): boolean {
        return this.filters.length > 0
            ? this.filters.every((filter) => filter.filter(e))
            : true;
    }
}

export class OrFilter implements EntryFilter {
    constructor(private filters: EntryFilter[]) {}

    filter(e: Entry): boolean {
        return this.filters.length > 0
            ? this.filters.some((filter) => filter.filter(e))
            : true;
    }
}

export class NotFilter implements EntryFilter {
    constructor(private notfilter: EntryFilter) {}

    filter(e: Entry): boolean {
        return !this.notfilter.filter(e);
    }
}

export class DateFromFilter implements EntryFilter {
    constructor(private fromdate: Temporal.PlainDate) {}

    filter(e: Entry): boolean {
        return Temporal.PlainDate.compare(e.date, this.fromdate) >= 0;
    }
}

export class DateToFilter implements EntryFilter {
    constructor(private todate: Temporal.PlainDate) {}

    filter(e: Entry): boolean {
        return Temporal.PlainDate.compare(e.date, this.todate) <= 0;
    }
}

export class GenreFilter implements EntryFilter {
    constructor(private genre: Genre) {}

    filter(e: Entry): boolean {
        return e.genre === this.genre;
    }
}

export class PlayerFilter implements EntryFilter {
    constructor(private playerSlug: string) {}

    filter(e: Entry): boolean {
        return e.related.players.some(
            (player) => player.slug === this.playerSlug,
        );
    }
}

export class TeamFilter implements EntryFilter {
    constructor(private teamSlug: string) {}

    filter(e: Entry): boolean {
        return e.related.teams.some((team) => team.slug === this.teamSlug);
    }
}

export class OmatchTagFilter implements EntryFilter {
    constructor(private tag: OmatchTag) {}

    filter(e: Entry): boolean {
        return e.genre === Genre.MATCH && e.tags.has(this.tag);
    }
}

export class YearFilter implements EntryFilter {
    constructor(private year: number) {}

    filter(e: Entry): boolean {
        return e.date.year === this.year;
    }
}

export class OeventFilter implements EntryFilter {
    constructor(private oeventSlug: string) {}

    filter(e: Entry): boolean {
        return e.related.events.some((event) => event.slug === this.oeventSlug);
    }
}

export function applyFilter(entries: Entry[], filter: EntryFilter): Entry[] {
    return entries.filter((entry) => filter.filter(entry));
}

export function filterFromParams(params: URLSearchParams): EntryFilter {
    const genres = params
        .getAll("genre")
        .map((genre) => new GenreFilter(genre as Genre));
    const genreFilter = new OrFilter(genres);
    const notGenres = params
        .getAll("genre-not")
        .map((genre) => new NotFilter(new GenreFilter(genre as Genre)));
    const matchTags = params
        .getAll("match-tag")
        .map((tag) => new OmatchTagFilter(tag as OmatchTag));
    const matchTagFilter = new OrFilter(matchTags);
    const notMatchTags = params
        .getAll("match-tag-not")
        .map((tag) => new NotFilter(new OmatchTagFilter(tag as OmatchTag)));
    const players = params
        .getAll("player")
        .map((slug) => new PlayerFilter(slug));
    const playerFilter = new OrFilter(players);
    const notPlayers = params
        .getAll("player-not")
        .map((slug) => new NotFilter(new PlayerFilter(slug)));
    const teams = params.getAll("team").map((slug) => new TeamFilter(slug));
    const teamFilter = new OrFilter(teams);
    const notTeams = params
        .getAll("team-not")
        .map((slug) => new NotFilter(new TeamFilter(slug)));
    const years = params
        .getAll("year")
        .map((y) => new YearFilter(Number(y)));
    const yearFilter = new OrFilter(years);
    const notYears = params
        .getAll("year-not")
        .map((y) => new NotFilter(new YearFilter(Number(y))));
    const oevents = params
        .getAll("oevent")
        .map((slug) => new OeventFilter(slug));
    const oeventFilter = new OrFilter(oevents);
    const notOevents = params
        .getAll("oevent-not")
        .map((slug) => new NotFilter(new OeventFilter(slug)));
    const from = params.get("from");
    const fromDateFilter = from
        ? new DateFromFilter(Temporal.PlainDate.from(from))
        : undefined;
    const to = params.get("to");
    const toDateFilter = to
        ? new DateToFilter(Temporal.PlainDate.from(to))
        : undefined;
    const filters = [
        genreFilter,
        ...notGenres,
        matchTagFilter,
        ...notMatchTags,
        yearFilter,
        ...notYears,
        teamFilter,
        ...notTeams,
        playerFilter,
        ...notPlayers,
        oeventFilter,
        ...notOevents,
        fromDateFilter,
        toDateFilter,
    ].filter((f) => f !== undefined);
    return new AndFilter(filters);
}

export type FilterState = "none" | "yes" | "no";

export function queryOmatchTagFilter(
    params: URLSearchParams,
    tag: OmatchTag,
): FilterState {
    if (params.getAll("match-tag").includes(tag)) return "yes";
    if (params.getAll("match-tag-not").includes(tag)) return "no";
    return "none";
}

export function queryGenreFilter(
    params: URLSearchParams,
    genre: Genre,
): FilterState {
    if (params.getAll("genre").includes(genre)) return "yes";
    if (params.getAll("genre-not").includes(genre)) return "no";
    return "none";
}

export function queryPlayerFilter(
    params: URLSearchParams,
    playerSlug: string,
): FilterState {
    if (params.getAll("player").includes(playerSlug)) return "yes";
    if (params.getAll("player-not").includes(playerSlug)) return "no";
    return "none";
}

export function queryTeamFilter(
    params: URLSearchParams,
    teamSlug: string,
): FilterState {
    if (params.getAll("team").includes(teamSlug)) return "yes";
    if (params.getAll("team-not").includes(teamSlug)) return "no";
    return "none";
}

export function queryYearFilter(
    params: URLSearchParams,
    year: number,
): FilterState {
    if (params.getAll("year").includes(String(year))) return "yes";
    if (params.getAll("year-not").includes(String(year))) return "no";
    return "none";
}

export function queryOeventFilter(
    params: URLSearchParams,
    oeventSlug: string,
): FilterState {
    if (params.getAll("oevent").includes(oeventSlug)) return "yes";
    if (params.getAll("oevent-not").includes(oeventSlug)) return "no";
    return "none";
}

export function queryDateFilter(
    params: URLSearchParams,
    key: "from" | "to",
): boolean {
    return params.get(key) !== null;
}
