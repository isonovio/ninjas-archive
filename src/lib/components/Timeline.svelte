<script lang="ts">
    import { timelineGroupSortByDate, type TimelineItem, type TimelineFilter, filterTimeline, timeline, timelineFilterFromParams } from "$lib/types/timeline";
    import { players } from "$lib/types/player";
    import { page } from "$app/state";

    import NewsEntry from "$lib/components/NewsEntry.svelte";
    import Match from "$lib/components/Match.svelte";

    export let prefilter: TimelineFilter = {};
    const prefilteredTimeline = filterTimeline(timeline, prefilter);
    const filterFromParams: TimelineFilter = timelineFilterFromParams(page.url.searchParams);
    const filteredTimeline = filterTimeline(prefilteredTimeline, filterFromParams);

    const sortedTimeline = timelineGroupSortByDate(filteredTimeline);
</script>

<div class="pt-6 pl-6 flex flex-col gap-4">
    {#each sortedTimeline as [date, items]}
        <div class="relative border-t-2 border-l-2">
            <div class="absolute -top-6 -left-6 p-2 bg-white font-bold text-xl text-sec-700">
                {date.toString()}
            </div>
            <div class="pl-12 py-6 flex flex-col gap-2">
                {#each items as item}
                    <div class="relative">
                        <div class="absolute flex gap-2">
                            {#each item.involves as player}
                                {#if players.has(player)}
                                    <div class="text-sm text-gray-500">
                                        @{players.get(player)!.nickname}
                                    </div>
                                {/if}
                            {/each}
                        </div>
                        {#if item.genre == "news"}
                            <NewsEntry entry={item} />
                        {:else if item.genre == "match"}
                            <Match match={item} />
                        {:else}
                            {item}
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";
</style>
