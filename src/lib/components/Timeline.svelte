<script lang="ts">
    import { timeline, timelineGroupSortByDate } from "$lib/types/timeline";
    const sortedTimeline = timelineGroupSortByDate(timeline);
</script>

<div>
    {#each sortedTimeline as [date, items]}
        <div class="border p-2">
            <div>
                {date.toLocaleDateString()}
                {#each items as item}
                    <div>
                        {item}
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";
</style>
