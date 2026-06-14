<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { compareTeam } from "$lib/types/team";
    import { queryTeamFilter } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import FilterItem from "./FilterItem.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    const candidates = $derived([...new Set(timeline.flatMap((i) => i.related.teams))].toSorted(compareTeam));

    function cycleTeam(teamSlug: string): void {
        const state = queryTeamFilter(params, teamSlug);
        if (state === "none") {
            params.append("team", teamSlug);
        } else if (state === "yes") {
            params.delete("team", teamSlug);
            params.append("team-not", teamSlug);
        } else {
            params.delete("team-not", teamSlug);
        }
        onUpdate();
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Teams">
        {#each candidates as team}
            <FilterItem state={queryTeamFilter(params, team.slug)} onclick={() => cycleTeam(team.slug)}>
                {team.name}
            </FilterItem>
        {/each}
    </FilterBox>
{/if}
