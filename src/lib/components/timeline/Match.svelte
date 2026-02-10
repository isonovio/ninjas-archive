<script lang="ts">
    import { type Match } from "$lib/types/match";
    import LinkExternal from "$lib/components/snippets/LinkExternal.svelte";
    import LinkStream from "$lib/components/snippets/LinkStream.svelte";
    import LinkPlayers from "$lib/components/snippets/LinkPlayers.svelte";
    export let match: Match;
</script>

<div class="relative">
    <div class="absolute -top-3 left-3 z-10 bg-white px-1 text-prim-700 font-light">
        {#if match.url}
            <LinkExternal name={match.slug} url={match.url} />
        {:else}
            {match.slug}
        {/if}
    </div>
    <div class="absolute -top-4 left-16 z-20 grid grid-cols-[202px_60px_auto] font-medium text-xl">
        <div class="relative inline-block ml-auto pl-2 bg-white text-nowrap text-right team-{match.outcomes[0]}">
            {match.matchup[0]}
            {#if match.teamInvolves[0].length > 0}
                <div class="absolute -bottom-3 right-0">
                    <LinkPlayers players={match.teamInvolves[0]} />
                </div>
            {/if}
        </div>
        <div class="inline-block bg-white text-center font-extrabold font-mono">
            <span class="team-{match.outcomes[0]}">{match.result[0]}</span>:<span class="team-{match.outcomes[1]}">{match.result[1]}</span>
        </div>
        <div class="relative inline-block pr-2 bg-white team-{match.outcomes[1]}">
            {match.matchup[1]}
            {#if match.teamInvolves[1].length > 0}
                <div class="absolute -bottom-3 left-0">
                    <LinkPlayers players={match.teamInvolves[1]} />
                </div>
            {/if}
        </div>
    </div>
    <div class="absolute -top-2 right-0 bg-white px-2 text-amber-700 text-xs">
        {match.title}
    </div>

    <div class="mt-4 pt-6 pb-2 pl-4 border-t border-l border-prim-700">
        <div>
            {#each match.maps as map}
                <div class="flex justify-between border-b border-dashed border-gray-300">
                    <div class="text-nowrap">
                        <span class="inline-block w-14 text-prim-700 font-light">
                            {#if map.url}
                                <LinkExternal name={map.slug} url={map.url} />
                            {:else}
                                {map.slug}
                            {/if}
                        </span>
                        <span class="inline-block w-10 text-prim-800 font-medium">
                            {map.map}
                        </span>
                        <span class="inline-block w-35 text-right team-{map.outcomes[0]}">
                            {match.matchup[0]}
                        </span>
                        <span class="inline-block w-6 text-right font-extrabold font-mono team-{map.outcomes[0]}">
                            {map.result[0]}
                        </span>
                        <span class="inline-block font-extrabold font-mono">:</span>
                        <span class="inline-block w-6 font-extrabold font-mono team-{map.outcomes[1]}">
                            {map.result[1]}
                        </span>
                        <span class="inline-block w-35 team-{map.outcomes[1]}">
                            {match.matchup[1]}
                        </span>
                    </div>
                    <div class="flex justify-end flex-wrap gap-x-4">
                        {#if map.streams}
                            {#each map.streams as stream}
                                <LinkStream {stream} />
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
        @apply text-green-600 font-bold;
    }
    .team-lose {
        @apply text-red-600;
    }
    .team-draw {
        @apply text-gray-700;
    }
</style>
