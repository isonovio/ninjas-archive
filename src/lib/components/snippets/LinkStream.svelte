<script lang="ts">
    import { type Stream, streamTimedUrl } from "$lib/types/match";
    import LinkExternal from "$lib/components/snippets/LinkExternal.svelte";
    import StreamingSVG from "$lib/assets/streaming.svelte";

    export let stream: Stream;
</script>

<div class="text-nowrap text-pink-900 flex gap-1">
    <div class="inline-block">
        <StreamingSVG />
        {stream.caster}
        [{stream.language.toUpperCase()}]
    </div>
    {#each stream.parts as part}
        <LinkExternal name={part.name} url={streamTimedUrl(part.url, part.duration)} />
    {/each}
    {#if stream.tags}
        {#each stream.tags as tag}
            <div class="inline-block">#{tag}</div>
        {/each}
    {/if}
</div>
