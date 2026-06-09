<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { Genre, compare as genreCompare, display as genreDisplay } from "$lib/types/timeline-genre";
    import { paramsFilterHasGenre } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import FilterItem from "./FilterItem.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    const candidates = $derived(
        [...new Set(timeline.map((i) => i.genre))].toSorted(genreCompare),
    );

    function toggleGenre(genre: Genre): void {
        if (paramsFilterHasGenre(params, genre)) {
            params.delete("genre", genre);
        } else {
            params.append("genre", genre);
        }
        onUpdate();
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Genres">
        {#each candidates as genre}
            <FilterItem active={paramsFilterHasGenre(params, genre)} onclick={() => toggleGenre(genre)}>
                {genreDisplay(genre)}
            </FilterItem>
        {/each}
    </FilterBox>
{/if}
