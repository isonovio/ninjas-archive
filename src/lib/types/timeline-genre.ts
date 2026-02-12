export enum Genre {
    NEWSPIECE = "newspiece",
    MATCH = "match",
}

export const display = (genre: Genre): string => {
    if (genre === Genre.MATCH) {
        return "Officials";
    } else if (genre === Genre.NEWSPIECE) {
        return "News";
    } else {
        throw new Error(`Unknown genre: ${genre}`);
    }
};

export const compare = (a: Genre, b: Genre) => {
    return a.localeCompare(b);
};
