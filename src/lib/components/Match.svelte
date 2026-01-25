<script lang="ts">
    import { type Match } from "$lib/types/match";
    import LinkExternal from "$lib/assets/link-external.svelte";
    export let match: Match;
</script>

<div class="relative">
    <div class="absolute -top-4 grid grid-cols-[200px_50px_auto] font-bold text-xl">
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
        {#if match.url}
            <a href={match.url} class="block text-sec-600 hover:text-sec-400">
                <svelte:component this={LinkExternal} />
                Match Page
            </a>
        {/if}
        <div class="text-amber-700">
            {match.title}
        </div>
    </div>

    <div class="mt-4 pt-3 pl-4 border-t border-l border-prim-700">
        <div>
            {#each match.maps as map, idx}
                <div class="flex justify-between">
                    <div class="shrink-0">
                        <div class="inline-block min-w-10">
                            {map.slug}
                        </div>
                        <div class="inline-block min-w-10">
                            {map.map}
                        </div>
                        <div class="inline-block min-w-20 text-right team-{map.outcomes[0]}">
                            {match.matchup[0]}
                        </div>
                        <div class="inline-block min-w-8 text-right font-mono team-{map.outcomes[0]}">
                            {map.result[0]}
                        </div>
                        <span>:</span>
                        <div class="inline-block min-w-8 font-mono team-{map.outcomes[1]}">
                            {map.result[1]}
                        </div>
                        <div class="inline-block min-w-20 team-{map.outcomes[1]}">
                            {match.matchup[1]}
                        </div>
                    </div>
                    <div class="flex justify-end flex-wrap gap-x-4">
                        {#if map.url}
                            <a href={map.url} class="inline-block text-sec-600 hover:text-sec-400">
                                <svelte:component this={LinkExternal} />
                                Map Page
                            </a>
                        {/if}
                        {#if map.streams}
                            {#each map.streams as stream}
                                <a href={stream.url} class="inline-block text-sec-600 hover:text-sec-400">
                                    <svelte:component this={LinkExternal} />
                                    VOD: {stream.caster}
                                    [{stream.language}]
                                    {#if stream.duration}
                                        ({stream.duration})
                                    {/if}
                                    {#if stream.tags}
                                        {#each stream.tags as tag}
                                            #{tag}
                                        {/each}
                                    {/if}
                                </a>
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
        @apply text-green-600;
    }
    .team-lose {
        @apply text-red-600;
    }
    .team-draw {
        @apply text-gray-600;
    }
</style>
