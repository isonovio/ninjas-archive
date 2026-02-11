<script lang="ts">
    import { type Newspiece } from "$lib/types/newspiece";
    import LinkExternal from "$lib/components/snippets/LinkExternal.svelte";
    import LinkPlayers from "$lib/components/snippets/LinkPlayers.svelte";

    export let newspiece: Newspiece;
</script>

<div class="py-3 flex justify-between gap-4">
    <div class="relative self-start shrink-0 font-bold text-xl text-sky-700">
        <span>{newspiece.title}</span>
        <div class="absolute -bottom-3">
            <LinkPlayers players={newspiece.related.players} />
        </div>
    </div>
    <div class="shrink flex flex-wrap gap-x-2 justify-end text-sm">
        {#each newspiece.links as link}
            <LinkExternal {link} />
        {/each}
    </div>
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";
</style>
