<script lang="ts">
    import { timelineGroupSortByDate, type TimelineItem, TimelineFilter, filterTimeline, timeline, timelineFilterFromParams, type Genre } from "$lib/types/timeline";
    import { players } from "$lib/types/player";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    import NewsEntry from "$lib/components/NewsEntry.svelte";
    import Match from "$lib/components/Match.svelte";

    export let prefilter = new TimelineFilter();
    const prefilteredTimeline = filterTimeline(timeline, prefilter);
    const searchParams = page.url.searchParams;
    const filterFromParams: TimelineFilter = timelineFilterFromParams(searchParams);
    const filteredTimeline = filterTimeline(prefilteredTimeline, filterFromParams);
    const sortedTimeline = timelineGroupSortByDate(filteredTimeline);

    const filterCandidates = (() => {
        const genreCandidates: Map<Genre, Boolean> | undefined = (() => {
            const uniqueGenres = new Set(
                prefilteredTimeline.map((i) => {
                    return i.genre;
                }),
            );
            if (uniqueGenres.size < 2) {
                return undefined;
            }
            const genreToggles = [...uniqueGenres].map((g) => {
                if (filterFromParams.genres) {
                    return [g, filterFromParams.genres.has(g)] as [Genre, Boolean];
                } else {
                    return [g, false] as [Genre, Boolean];
                }
            });
            return new Map(genreToggles);
        })();

        const playerCandidates: Map<string, Boolean> | undefined = (() => {
            const uniquePlayers: Set<string> = new Set(
                prefilteredTimeline
                    .map((i) => {
                        return i.involves;
                    })
                    .flat(),
            );
            if (uniquePlayers.size < 2) {
                return undefined;
            }
            const playerToggles = [...uniquePlayers].map((p) => {
                if (filterFromParams.players) {
                    return [p, filterFromParams.players.has(p)] as [string, Boolean];
                } else {
                    return [p, false] as [string, Boolean];
                }
            });
            return new Map(playerToggles);
        })();

        return { genres: genreCandidates, players: playerCandidates };
    })();
    let temp = true;
</script>

<div class="w-7xl mx-auto flex">
    <div class="sticky top-0 h-screen w-64 bg-gray-200">
        <div>Filters</div>
        {#if filterCandidates.genres}
            <div>Genres</div>
            <div class="pl-2">
                {#each filterCandidates.genres as [genre, toggle]}
                    <button
                        class="block {toggle ? 'font-bold' : 'font-normal'}"
                        on:click={() => {
                            if (toggle) {
                                searchParams.delete("genre", genre);
                            } else {
                                searchParams.append("genre", genre);
                            }
                            goto(`?${searchParams.toString()}`, { replaceState: true });
                        }}>{genre}</button
                    >
                {/each}
            </div>
        {/if}
    </div>

    <div class="pt-6 pl-6 flex flex-col gap-4">
        {#each sortedTimeline as [date, items]}
            <div class="relative border-t-2 border-l-2">
                <div class="absolute -top-6 -left-6 p-2 bg-white font-bold text-xl text-sec-700">
                    {date.toString()}
                </div>
                <div class="pl-12 py-6 flex flex-col gap-2">
                    {#each items as item}
                        <div class="relative">
                            <div class="absolute flex gap-2">
                                {#each item.involves as player}
                                    {#if players.has(player)}
                                        <div class="text-sm text-gray-500">
                                            @{players.get(player)!.nickname}
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                            {#if item.genre == "news"}
                                <NewsEntry entry={item} />
                            {:else if item.genre == "match"}
                                <Match match={item} />
                            {:else}
                                {item}
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";
</style>
