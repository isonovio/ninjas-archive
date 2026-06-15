<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import DateFilterBox from "./DateFilterBox.svelte";
    import YearFilterBox from "./YearFilterBox.svelte";
    import GenreFilterBox from "./GenreFilterBox.svelte";
    import OmatchTagFilterBox from "./OmatchTagFilterBox.svelte";
    import PlayerFilterBox from "./PlayerFilterBox.svelte";
    import TeamFilterBox from "./TeamFilterBox.svelte";
    import OeventFilterBox from "./OeventFilterBox.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    const hasFilter = $derived(params.size > 0);

    function clearFilter(): void {
        params.delete("from");
        params.delete("to");
        params.delete("year");
        params.delete("year-not");
        params.delete("genre");
        params.delete("genre-not");
        params.delete("match-tag");
        params.delete("match-tag-not");
        params.delete("team");
        params.delete("team-not");
        params.delete("player");
        params.delete("player-not");
        params.delete("oevent");
        params.delete("oevent-not");
        onUpdate();
    }
</script>

<div class="h-full overflow-y-scroll overflow-x-hidden max-w-48 hover:max-w-none py-10 flex flex-col gap-4">
    <div class="flex justify-between">
        <div class="text-xl font-bold">Filters</div>
        {#if hasFilter}
            <button class="cursor-pointer text-base pt-1/2 hover:text-gray-400" onclick={() => clearFilter()}>[Clear]</button>
        {/if}
    </div>
    <DateFilterBox {params} {onUpdate} />
    <YearFilterBox {params} {timeline} {onUpdate} />
    <GenreFilterBox {params} {timeline} {onUpdate} />
    <OmatchTagFilterBox {params} {timeline} {onUpdate} />
    <TeamFilterBox {params} {timeline} {onUpdate} />
    <PlayerFilterBox {params} {timeline} {onUpdate} />
    <OeventFilterBox {params} {timeline} {onUpdate} />
</div>
