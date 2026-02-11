export type TimeRange = [number, number];

export const timeRangeFromString = (str: string): TimeRange => {
    const pattern =
        /^[0-9]+:[0-5][0-9]:[0-5][0-9]-[0-9]+:[0-5][0-9]:[0-5][0-9]$/;
    if (!pattern.test(str)) {
        throw new Error(`Invalid time range format: ${str}`);
    }
    const [startStr, endStr] = str.split("-");
    const [startHour, startMinute, startSecond] = startStr
        .split(":")
        .map(Number);
    const [endHour, endMinute, endSecond] = endStr.split(":").map(Number);
    const start = startHour * 3600 + startMinute * 60 + startSecond;
    const end = endHour * 3600 + endMinute * 60 + endSecond;
    return [start, end];
};
