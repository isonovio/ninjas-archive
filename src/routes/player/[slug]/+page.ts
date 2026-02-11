import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { allPlayers } from "$lib/types/player";

export const load: PageLoad = ({ params }) => {
    if (allPlayers.has(params.slug)) {
        return {
            player: allPlayers.get(params.slug)!,
        };
    }

    error(404, "Not found");
};
