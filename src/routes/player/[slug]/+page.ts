import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { players } from "$lib/types/player";

export const load: PageLoad = ({ params }) => {
    if (players.has(params.slug)) {
        return {
            player: players.get(params.slug)!,
        };
    }

    error(404, "Not found");
};
