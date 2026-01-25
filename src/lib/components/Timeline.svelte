<script lang="ts">
    import { timelineGroupSortByDate, type TimelineItem } from "$lib/types/timeline";

    import NewsEntry from "$lib/components/NewsEntry.svelte";
    import Match from "$lib/components/Match.svelte";

    export let timeline: TimelineItem[];

    const sortedTimeline = timelineGroupSortByDate(timeline);
</script>

<div class="pt-6 pl-6 flex flex-col gap-4">
    {#each sortedTimeline as [date, items]}
        <div class="relative border-t-2 border-l-2">
            <div class="absolute -top-6 -left-6 p-2 bg-white font-bold text-xl text-sec-700">
                {date.toString()}
            </div>
            <div class="pl-12 py-6 flex flex-col gap-2">
                {#each items as item}
                    {#if item.genre == "news-entry"}
                        <NewsEntry entry={item} />
                    {:else if item.genre == "match"}
                        <Match match={item} />
                    {:else}
                        {item}
                    {/if}
                {/each}
            </div>
        </div>
    {/each}
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";
</style>
