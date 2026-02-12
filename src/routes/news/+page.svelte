<script lang="ts">
    import { GenreFilter } from "$lib/types/timeline-filter";
    import Timeline from "$lib/components/timeline/Timeline.svelte";
    import { Genre } from "$lib/types/timeline-genre";

    const prefilter = new GenreFilter(Genre.NEWSPIECE);
</script>

<svelte:head>
    <title>News | Ninjas Archive</title>
</svelte:head>

<Timeline {prefilter} />
