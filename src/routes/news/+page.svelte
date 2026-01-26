<script lang="ts">
    import { TimelineFilter } from "$lib/types/timeline";
    import Timeline from "$lib/components/Timeline.svelte";

    const prefilter = new TimelineFilter({ genres: ["news"] });
</script>

<svelte:head>
    <title>News | Ninjas Archive</title>
</svelte:head>

<Timeline {prefilter} />
