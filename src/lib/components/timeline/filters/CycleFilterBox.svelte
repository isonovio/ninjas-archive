<script lang="ts" generics="T">
    import type { Entry } from "$lib/types/timeline";
    import type { FilterState } from "$lib/types/timeline-filter";
    import { queryParamKey, setParamKey } from "$lib/types/timeline-filter";
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
        return queryParamKey(params, paramKey, toParamValue(item));
    }

    function getMainHandler(item: T): () => void {
        return () => {
            const current = queryParamKey(params, paramKey, toParamValue(item));
            setParamKey(params, paramKey, toParamValue(item), current === "disregard" ? "include" : "disregard");
            onUpdate();
        };
    }

    function getAltHandler(item: T): () => void {
        return () => {
            const current = queryParamKey(params, paramKey, toParamValue(item));
            setParamKey(params, paramKey, toParamValue(item), current === "exclude" ? "include" : "exclude");
            onUpdate();
        };
    }
</script>

{#if candidates.length > 1}
    <FilterBox {label}>
        <CandidatesBox {candidates} {getState} {getMainHandler} {getAltHandler} {display} {compact} />
    </FilterBox>
{/if}
