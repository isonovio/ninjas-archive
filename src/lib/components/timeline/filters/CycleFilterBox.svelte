<script lang="ts" generics="T">
    import type { Entry } from "$lib/types/timeline";
    import type { FilterState } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import CandidatesBox from "./CandidatesBox.svelte";

    interface Props {
        label: string;
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
        paramKey: string;
        getCandidates: (timeline: Entry[]) => T[];
        toParamValue: (item: T) => string;
        display: (item: T) => string;
        compact?: boolean;
    }
    let { label, params, timeline, onUpdate, paramKey, getCandidates, toParamValue, display, compact = true }: Props = $props();

    const candidates = $derived(getCandidates(timeline));

    function getState(item: T): FilterState {
        const value = toParamValue(item);
        if (params.getAll(paramKey).includes(value)) return "yes";
        if (params.getAll(`${paramKey}-not`).includes(value)) return "no";
        return "none";
    }

    function getHandler(item: T): () => void {
        return () => {
            const value = toParamValue(item);
            const state = getState(item);
            if (state === "none") {
                params.append(paramKey, value);
            } else if (state === "yes") {
                params.delete(paramKey, value);
                params.append(`${paramKey}-not`, value);
            } else {
                params.delete(`${paramKey}-not`, value);
            }
            onUpdate();
        };
    }
</script>

{#if candidates.length > 1}
    <FilterBox {label}>
        <CandidatesBox {candidates} {getState} {getHandler} {display} {compact} />
    </FilterBox>
{/if}
