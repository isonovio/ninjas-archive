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

    function togglePlayer(playerSlug: string): void {
        if (queryPlayerFilter(params, playerSlug)) {
            params.delete("player", playerSlug);
        } else {
            params.append("player", playerSlug);
        }
        onUpdate();
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Players">
        {#each candidates as player}
            <FilterItem active={queryPlayerFilter(params, player.slug)} onclick={() => togglePlayer(player.slug)}>
                {player.nickname}
            </FilterItem>
        {/each}
    </FilterBox>
{/if}
