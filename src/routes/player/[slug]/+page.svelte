<script lang="ts">
    import { TimelineFilter } from "$lib/types/timeline";
    import Timeline from "$lib/components/Timeline.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    const prefilter = $derived(new TimelineFilter({ players: [data.player] }));
</script>

<svelte:head>
    <title>Ninjas Archive - News</title>
</svelte:head>

<Timeline {prefilter} />
