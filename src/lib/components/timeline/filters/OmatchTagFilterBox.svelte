<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { Genre } from "$lib/types/timeline-genre";
    import { type OmatchTag, displayOmatchTag } from "$lib/types/official-match";
    import { queryOmatchTagFilter, type FilterState } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import CandidatesBox from "./CandidatesBox.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    function cycleTag(tag: OmatchTag): void {
        const state = queryOmatchTagFilter(params, tag);
        if (state === "none") {
            params.append("match-tag", tag);
        } else if (state === "yes") {
            params.delete("match-tag", tag);
            params.append("match-tag-not", tag);
        } else {
            params.delete("match-tag-not", tag);
        }
        onUpdate();
    }

    const candidates = $derived([...new Set(timeline.filter((i) => i.genre === Genre.MATCH).flatMap((i) => [...i.tags]))].toSorted());
    function getState(tag: OmatchTag): FilterState {
        return queryOmatchTagFilter(params, tag);
    }
    function getHandler(tag: OmatchTag): () => void {
        return () => cycleTag(tag);
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Match Types">
        <CandidatesBox {candidates} {getState} {getHandler} display={displayOmatchTag} compact={false} />
    </FilterBox>
{/if}
