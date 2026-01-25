<script lang="ts">
    import { type TimelineFilter } from "$lib/types/timeline";
    import Timeline from "$lib/components/Timeline.svelte";

    const prefilter: TimelineFilter = { genres: new Set(["match"]) };
</script>

<svelte:head>
    <title>Ninjas Archive - Matches</title>
</svelte:head>

<Timeline {prefilter} />
