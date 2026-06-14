<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { Genre, compareGenre, displayGenre } from "$lib/types/timeline-genre";
    import { queryGenreFilter } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import FilterItem from "./FilterItem.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    const candidates = $derived([...new Set(timeline.map((i) => i.genre))].toSorted(compareGenre));

    function cycleGenre(genre: Genre): void {
        const state = queryGenreFilter(params, genre);
        if (state === "none") {
            params.append("genre", genre);
        } else if (state === "yes") {
            params.delete("genre", genre);
            params.append("genre-not", genre);
        } else {
            params.delete("genre-not", genre);
        }
        onUpdate();
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Genres">
        {#each candidates as genre}
            <FilterItem state={queryGenreFilter(params, genre)} onclick={() => cycleGenre(genre)}>
                {displayGenre(genre)}
            </FilterItem>
        {/each}
    </FilterBox>
{/if}
