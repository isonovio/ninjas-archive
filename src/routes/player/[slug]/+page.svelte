<script lang="ts">
    import { PlayerFilter } from "$lib/types/timeline-filter";
    import Timeline from "$lib/components/timeline/Timeline.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    let { player } = $derived(data);

    const prefilter = $derived(new PlayerFilter(player.slug));
</script>

<svelte:head>
    <title>{player.nickname} | Ninjas Archive</title>
</svelte:head>

<Timeline {prefilter} />
