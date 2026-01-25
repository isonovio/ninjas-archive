<script lang="ts">
    import { TimelineFilter } from "$lib/types/timeline";
    import Timeline from "$lib/components/Timeline.svelte";

    const prefilter = new TimelineFilter(["news"]);
</script>

<svelte:head>
    <title>Ninjas Archive - News</title>
</svelte:head>

<Timeline {prefilter} />
