<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { Player } from "$lib/types/player";
    import { EntryFilter } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import FilterItem from "./FilterItem.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    const candidates = $derived(
        [...new Set(timeline.flatMap((i) => i.related.players))].toSorted(Player.compare),
    );

    function togglePlayer(playerSlug: string): void {
        if (EntryFilter.hasPlayer(params, playerSlug)) {
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
            <FilterItem active={EntryFilter.hasPlayer(params, player.slug)} onclick={() => togglePlayer(player.slug)}>
                {player.nickname}
            </FilterItem>
        {/each}
    </FilterBox>
{/if}
