<script lang="ts">
    import { type NewsEntry } from "$lib/types/news";
    import LinkExternal from "$lib/components/snippets/LinkExternal.svelte";

    export let entry: NewsEntry;
</script>

<div class="pt-3 flex justify-between gap-2">
    <div class="shrink-0 font-bold text-xl text-sky-700">
        {entry.title}
    </div>
    <div class="shrink flex flex-wrap gap-x-2 justify-end">
        {#each [...entry.urls] as [name, url]}
            <LinkExternal {name} {url} />
        {/each}
    </div>
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";
</style>
