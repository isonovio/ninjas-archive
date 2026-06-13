<script lang="ts">
    import { Genre } from "$lib/types/timeline-genre";
    import { GenreFilter } from "$lib/types/timeline-filter";
    import Timeline from "$lib/components/timeline/Timeline.svelte";

    const prefilter = new GenreFilter(Genre.MATCH);
</script>

<svelte:head>
    <title>Officials | Ninjas Archive</title>
</svelte:head>

<Timeline {prefilter} />
