<script lang="ts">
    import { PlayerFilter, OrFilter } from "$lib/types/timeline-filter";
    import Timeline from "$lib/components/timeline/Timeline.svelte";

    const nayomyFilter = new PlayerFilter("nayomy");
    const qiyarahFilter = new PlayerFilter("qiyarah");
    const prefilter = new OrFilter([nayomyFilter, qiyarahFilter]);
</script>

<svelte:head>
    <title>The Twins | Ninjas Archive</title>
</svelte:head>

<Timeline {prefilter} />
