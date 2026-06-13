import { type ExternalLink } from "./externlink";
import { timerangeFromString, type Timerange } from "./timerange";

export type VideoRaw = {
    link: ExternalLink;
    duration: string;
};

export type Video = {
    link: ExternalLink;
    duration: Timerange;
};

export function videoFromRaw(raw: VideoRaw): Video {
    const duration = timerangeFromString(raw.duration);
    const url = urlToTimed(raw.link.url, duration[0]);
    return {
        link: { ...raw.link, url: url },
        duration: duration,
    };
}

function urlToTimed(url: string, start: number): string {
    if (url.includes("youtu.be") || url.includes("kick.com")) {
        return `${url}?t=${start}`;
    } else if (url.includes("twitch.tv")) {
        const startHour = Math.floor(start / 3600);
        const startMinute = Math.floor((start % 3600) / 60);
        const startSecond = start % 60;
        return `${url}?t=${startHour}h${startMinute}m${startSecond}s`;
    } else {
        return url;
    }
}
