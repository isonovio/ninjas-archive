export enum Genre {
    NEWSPIECE = "newspiece",
    MATCH = "match",
}

export function displayGenre(genre: Genre): string {
    if (genre === Genre.MATCH) {
        return "Officials";
    } else if (genre === Genre.NEWSPIECE) {
        return "News";
    } else {
        throw new Error(`Unknown genre: ${genre}`);
    }
}

export function compareGenre(a: Genre, b: Genre): number {
    return a.localeCompare(b);
}
