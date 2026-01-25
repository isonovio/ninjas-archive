<script lang="ts">
    import { TimelineFilter } from "$lib/types/timeline";
    import Timeline from "$lib/components/Timeline.svelte";

    const prefilter = new TimelineFilter(["match"]);
</script>

<svelte:head>
    <title>Ninjas Archive - Matches</title>
</svelte:head>

<Timeline {prefilter} />
