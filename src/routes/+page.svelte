<script lang="ts">
    import { timeline } from "$lib/types/timeline";
    import Timeline from "$lib/components/Timeline.svelte";
</script>

<svelte:head>
    <title>Ninjas Archive</title>
</svelte:head>

<Timeline {timeline} />
