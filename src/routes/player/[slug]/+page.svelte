<script lang="ts">
    import { TimelineFilter } from "$lib/types/timeline";
    import Timeline from "$lib/components/timeline/Timeline.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    let { player } = $derived(data);

    const prefilter = $derived(new TimelineFilter({ players: [player.slug] }));
</script>

<svelte:head>
    <title>{player.nickname} | Ninjas Archive</title>
</svelte:head>

<Timeline {prefilter} />
