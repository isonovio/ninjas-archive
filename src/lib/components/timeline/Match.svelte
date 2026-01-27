<script lang="ts">
    import { type Match } from "$lib/types/match";
    import LinkExternal from "$lib/components/snippets/LinkExternal.svelte";
    import Stream from "$lib/components/snippets/Stream.svelte";
    export let match: Match;
</script>

<div class="relative">
    <div class="absolute -top-4 z-10 grid grid-cols-[250px_60px_auto] font-bold text-xl">
        <div class="inline-block ml-auto pl-2 bg-white text-right team-{match.outcomes[0]}">
            {match.matchup[0]}
        </div>
        <div class="inline-block bg-white text-center font-mono">
            <span class="team-{match.outcomes[0]}">{match.result[0]}</span>:<span class="team-{match.outcomes[1]}">{match.result[1]}</span>
        </div>
        <div class="inline-block pr-2 bg-white team-{match.outcomes[1]}">
            {match.matchup[1]}
        </div>
    </div>
    <div class="absolute -top-3 right-0 bg-white px-2 flex gap-3">
        <div class="text-amber-700">
            {match.title}
        </div>
        {#if match.url}
            <LinkExternal name="Info" url={match.url} />
        {/if}
    </div>

    <div class="mt-4 pt-3 pl-4 border-t border-l border-prim-700">
        <div>
            {#each match.maps as map, idx}
                <div class="flex justify-between">
                    <div class="text-nowrap">
                        <span class="inline-block min-w-10 text-prim-700 font-light">
                            {map.slug}
                        </span>
                        <span class="inline-block min-w-10 text-prim-800 font-medium">
                            {map.map}
                        </span>
                        <span class="inline-block min-w-35 text-right team-{map.outcomes[0]}">
                            {match.matchup[0]}
                        </span>
                        <span class="inline-block min-w-6 text-right font-extrabold font-mono team-{map.outcomes[0]}">
                            {map.result[0]}
                        </span>
                        <span class="inline-block font-extrabold font-mono">:</span>
                        <span class="inline-block min-w-6 font-extrabold font-mono team-{map.outcomes[1]}">
                            {map.result[1]}
                        </span>
                        <span class="inline-block min-w-35 team-{map.outcomes[1]}">
                            {match.matchup[1]}
                        </span>
                    </div>
                    <div class="flex justify-end flex-wrap gap-x-4">
                        {#if map.url}
                            <LinkExternal name="Info" url={map.url} />
                        {/if}
                        {#if map.streams}
                            {#each map.streams as stream}
                                <Stream {stream} />
                            {/each}
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    .team-win {
        @apply text-green-700;
    }
    .team-lose {
        @apply text-red-700;
    }
    .team-draw {
        @apply text-gray-700;
    }
</style>
