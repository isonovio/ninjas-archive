<script lang="ts">
    import { timelineFiltered, type TimelineFilter } from "$lib/types/timeline";
    import Timeline from "$lib/components/Timeline.svelte";

    const timeline = timelineFiltered({ genres: new Set(["match"]) });
</script>

<svelte:head>
    <title>Ninjas Archive - Matches</title>
</svelte:head>

<Timeline {timeline} />
