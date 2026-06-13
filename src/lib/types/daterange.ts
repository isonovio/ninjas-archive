import { Temporal } from "$lib/utils/temporal";

export type DateRangeRaw = {
    start: string;
    end: string;
};

export type DateRange = [Temporal.PlainDate, Temporal.PlainDate];

export namespace DateRange {
    export function fromRaw(raw: DateRangeRaw): DateRange {
        return [
            Temporal.PlainDate.from(raw.start),
            Temporal.PlainDate.from(raw.end),
        ];
    }
}
