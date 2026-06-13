export enum Outcome {
    WIN = "win",
    DRAW = "draw",
    LOSE = "lose",
}

export function outcomeFromResults(
    results: [number, number],
): [Outcome, Outcome] {
    if (results[0] > results[1]) {
        return [Outcome.WIN, Outcome.LOSE];
    } else if (results[0] < results[1]) {
        return [Outcome.LOSE, Outcome.WIN];
    } else {
        return [Outcome.DRAW, Outcome.DRAW];
    }
}
