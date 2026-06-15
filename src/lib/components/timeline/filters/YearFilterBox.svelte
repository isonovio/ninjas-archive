<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { queryYearFilter, type FilterState } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import CandidatesBox from "./CandidatesBox.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    function cycleYear(year: number): void {
        const key = String(year);
        const state = queryYearFilter(params, year);
        if (state === "none") {
            params.append("year", key);
        } else if (state === "yes") {
            params.delete("year", key);
            params.append("year-not", key);
        } else {
            params.delete("year-not", key);
        }
        onUpdate();
    }

    const candidates = $derived([...new Set(timeline.map((i) => i.date.year))].toSorted((a, b) => b - a));
    function getState(year: number): FilterState {
        return queryYearFilter(params, year);
    }
    function getHandler(year: number): () => void {
        return () => cycleYear(year);
    }
    function display(year: number): string {
        return String(year);
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Year">
        <CandidatesBox {candidates} {getState} {getHandler} {display} />
    </FilterBox>
{/if}
