<script lang="ts">
    import { type TimelineFilter } from "$lib/types/timeline";
    import Timeline from "$lib/components/Timeline.svelte";

    const prefilter: TimelineFilter = { genres: new Set(["news"]) };
</script>

<svelte:head>
    <title>Ninjas Archive - News</title>
</svelte:head>

<Timeline {prefilter} />
