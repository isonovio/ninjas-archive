<script lang="ts">
    import { TimelineFilter } from "$lib/types/timeline";
    import Timeline from "$lib/components/timeline/Timeline.svelte";

    const prefilter = new TimelineFilter({ genres: ["match"] });
</script>

<svelte:head>
    <title>Matches | Ninjas Archive</title>
</svelte:head>

<Timeline {prefilter} />
