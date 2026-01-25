<script lang="ts">
    import { timelineFiltered, type TimelineFilter } from "$lib/types/timeline";
    import Timeline from "$lib/components/Timeline.svelte";

    const timeline = timelineFiltered({ genres: new Set(["news-entry"]) });
</script>

<svelte:head>
    <title>Ninjas Archive - News</title>
</svelte:head>

<Timeline {timeline} />
