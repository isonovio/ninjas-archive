<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { comparePlayer } from "$lib/types/player";
    import { queryPlayerFilter } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import FilterItem from "./FilterItem.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    const candidates = $derived([...new Set(timeline.flatMap((i) => i.related.players))].toSorted(comparePlayer));

    function cyclePlayer(playerSlug: string): void {
        const state = queryPlayerFilter(params, playerSlug);
        if (state === "none") {
            params.append("player", playerSlug);
        } else if (state === "yes") {
            params.delete("player", playerSlug);
            params.append("player-not", playerSlug);
        } else {
            params.delete("player-not", playerSlug);
        }
        onUpdate();
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Players">
        {#each candidates as player}
            <FilterItem state={queryPlayerFilter(params, player.slug)} onclick={() => cyclePlayer(player.slug)}>
                {player.nickname}
            </FilterItem>
        {/each}
    </FilterBox>
{/if}
