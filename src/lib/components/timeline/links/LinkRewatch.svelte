<script lang="ts">
    import { type Rewatch } from "$lib/types/official-rewatch";
    import LinkExternal from "$lib/components/timeline/links/LinkExternal.svelte";
    import StreamingSVG from "$lib/assets/streaming.svelte";

    interface Props { rewatch: Rewatch }
    let { rewatch }: Props = $props();
</script>

<div class="text-nowrap text-pink-800 flex gap-1">
    <div class="inline-block">
        <StreamingSVG />
        {rewatch.casters.map((c) => c.nickname).join(", ")}
        [{rewatch.language.toUpperCase()}]
    </div>
    {#each rewatch.parts as part}
        <LinkExternal link={part.link} />
    {/each}
    {#each rewatch.tags as tag}
        <div class="inline-block">#{tag}</div>
    {/each}
</div>
