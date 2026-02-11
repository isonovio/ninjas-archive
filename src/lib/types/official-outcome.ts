export type Outcome = "win" | "draw" | "lose";

export const outcomesFromResults = (
    results: [number, number],
): [Outcome, Outcome] => {
    if (results[0] > results[1]) {
        return ["win", "lose"];
    } else if (results[0] < results[1]) {
        return ["lose", "win"];
    } else {
        return ["draw", "draw"];
    }
};
