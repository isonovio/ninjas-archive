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

    function toggleGenre(genre: Genre): void {
        if (queryGenreFilter(params, genre)) {
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
            <FilterItem active={queryGenreFilter(params, genre)} onclick={() => toggleGenre(genre)}>
                {displayGenre(genre)}
            </FilterItem>
        {/each}
    </FilterBox>
{/if}
