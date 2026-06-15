<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { type Oevent, compareOevent } from "$lib/types/official-event";
    import { queryOeventFilter, type FilterState } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import CandidatesBox from "./CandidatesBox.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    function cycleOevent(oeventSlug: string): void {
        const state = queryOeventFilter(params, oeventSlug);
        if (state === "none") {
            params.append("oevent", oeventSlug);
        } else if (state === "yes") {
            params.delete("oevent", oeventSlug);
            params.append("oevent-not", oeventSlug);
        } else {
            params.delete("oevent-not", oeventSlug);
        }
        onUpdate();
    }

    const candidates = $derived([...new Set(timeline.flatMap((i) => i.related.events))].toSorted(compareOevent));
    function getState(event: Oevent): FilterState {
        return queryOeventFilter(params, event.slug);
    }
    function getHandler(event: Oevent): () => void {
        return () => cycleOevent(event.slug);
    }
    function display(event: Oevent): string {
        return event.name;
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Events">
        <CandidatesBox {candidates} {getState} {getHandler} {display} />
    </FilterBox>
{/if}
