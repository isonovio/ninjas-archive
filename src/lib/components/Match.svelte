<script lang="ts">
    import { type Match } from "$lib/types/match";
    import LinkExternal from "$lib/assets/link-external.svelte";
    export let match: Match;

    const matchTitle = `${match.eventName} - ${match.bracket.join(" - ")}`;

    function outcome([team1Score, team2Score]: [number, number]) {
        if (team1Score > team2Score) {
            return ["win", "lose"];
        } else if (team1Score < team2Score) {
            return ["lose", "win"];
        } else {
            return ["draw", "draw"];
        }
    }
    const [t1MatchOut, t2MatchOut] = outcome(match.result);
    const mapsOut = match.maps.map((mm) => {
        const [t1Outcome, t2Outcome] = outcome(mm.result);
        return { t1: t1Outcome, t2: t2Outcome };
    });
</script>

<div class="relative">
    <div class="absolute grid grid-cols-[150px_50px_auto] font-bold text-xl">
        <div class="inline-block ml-auto pl-2 bg-white text-right team-{t1MatchOut}">
            {match.matchup[0]}
        </div>
        <div class="inline-block bg-white text-center font-mono">
            <span class="team-{t1MatchOut}">{match.result[0]}</span>:<span class="team-{t2MatchOut}">{match.result[1]}</span>
        </div>
        <div class="inline-block pr-2 bg-white team-{t2MatchOut}">
            {match.matchup[1]}
        </div>
    </div>
    <div class="absolute top-1 right-0 bg-white px-2 text-amber-700">
        {#if match.url}
            <a href={match.url} class="text-sec-600 hover:text-sec-400">
                <svelte:component this={LinkExternal} />
                {matchTitle}
            </a>
        {:else}
            {matchTitle}
        {/if}
    </div>

    <div class="mt-4 pt-3 pl-4 border-t border-l">
        <div>
            {#each match.maps as map, idx}
                <div class="flex justify-between">
                    <div class="shrink-0">
                        <div class="inline-block min-w-10">
                            Map {idx + 1}
                        </div>
                        <div class="inline-block min-w-10">
                            {map.map}
                        </div>
                        <div class="inline-block min-w-20 text-right team-{mapsOut[idx].t1}">
                            {match.matchup[0]}
                        </div>
                        <div class="inline-block min-w-8 text-right font-mono team-{mapsOut[idx].t1}">
                            {map.result[0]}
                        </div>
                        <span>:</span>
                        <div class="inline-block min-w-8 font-mono team-{mapsOut[idx].t2}">
                            {map.result[1]}
                        </div>
                        <div class="inline-block min-w-20 team-{mapsOut[idx].t2}">
                            {match.matchup[1]}
                        </div>
                    </div>
                    <div class="flex justify-end flex-wrap gap-x-4">
                        {#if map.url}
                            <a href={map.url} class="inline-block text-sec-600 hover:text-sec-400">
                                <svelte:component this={LinkExternal} />
                                Result
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
        @apply text-green-500;
    }
    .team-lose {
        @apply text-red-500;
    }
    .team-draw {
        @apply text-gray-500;
    }
</style>
