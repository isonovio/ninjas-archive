import { Temporal } from "$lib/utils/temporal";

export type DaterangeRaw = {
    start: string;
    end: string;
};

export type Daterange = [Temporal.PlainDate, Temporal.PlainDate];

export function daterangeFromRaw(raw: DaterangeRaw): Daterange {
    return [
        Temporal.PlainDate.from(raw.start),
        Temporal.PlainDate.from(raw.end),
    ];
}
