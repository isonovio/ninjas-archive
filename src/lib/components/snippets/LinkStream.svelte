<script lang="ts">
    import { type Stream } from "$lib/types/match";
    import LinkExternal from "$lib/components/snippets/LinkExternal.svelte";
    import StreamingSVG from "$lib/assets/streaming.svelte";

    export let stream: Stream;
</script>

<div class="text-nowrap">
    <StreamingSVG />
    {stream.caster}
    [{stream.language.toUpperCase()}]
    {#if stream.duration}
        ({stream.duration})
    {/if}
    {#if stream.tags}
        {#each stream.tags as tag}
            {` #${tag}`}
        {/each}
    {/if}
    <LinkExternal name="VOD" url={stream.url} />
</div>
