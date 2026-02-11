<script lang="ts">
    import { GenreFilter } from "$lib/types/timeline-filter";
    import Timeline from "$lib/components/timeline/Timeline.svelte";

    const prefilter = new GenreFilter("match");
</script>

<svelte:head>
    <title>Officials | Ninjas Archive</title>
</svelte:head>

<Timeline {prefilter} />
