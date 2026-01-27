<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import { Temporal } from "$lib/utils/temporal";

    import { timelineGroupSortByDate, TimelineFilter, filterTimeline, timeline, timelineFilterFromParams, type Genre } from "$lib/types/timeline";
    import { players } from "$lib/types/player";

    import NewsEntry from "./NewsEntry.svelte";
    import Match from "./Match.svelte";

    interface Props {
        prefilter?: TimelineFilter;
    }
    let { prefilter = new TimelineFilter() }: Props = $props();

    const prefilteredTimeline = $derived(filterTimeline(timeline, prefilter));
    const searchParams = $derived(browser ? page.url.searchParams : new URLSearchParams());
    const filterFromParams: TimelineFilter = $derived(timelineFilterFromParams(searchParams));
    const filteredTimeline = $derived(filterTimeline(prefilteredTimeline, filterFromParams));
    const sortedTimeline = $derived(timelineGroupSortByDate(filteredTimeline));

    const filterCandidates = $derived(
        (() => {
            const genreCandidates: [Genre, Boolean][] = (() => {
                return [
                    ...new Set(
                        prefilteredTimeline.map((i) => {
                            return i.genre;
                        }),
                    ),
                ]
                    .sort((a, b) => a.localeCompare(b))
                    .map((g) => {
                        if (filterFromParams.genres) {
                            return [g, filterFromParams.genres.has(g)] as [Genre, Boolean];
                        } else {
                            return [g, false] as [Genre, Boolean];
                        }
                    });
            })();

            const playerCandidates: [string, Boolean][] = (() => {
                return [
                    ...new Set(
                        prefilteredTimeline
                            .map((i) => {
                                return i.involves;
                            })
                            .flat(),
                    ),
                ]
                    .sort((a, b) => a.localeCompare(b))
                    .map((p) => {
                        if (filterFromParams.players) {
                            return [p, filterFromParams.players.has(p)] as [string, Boolean];
                        } else {
                            return [p, false] as [string, Boolean];
                        }
                    });
            })();

            return { genres: genreCandidates, players: playerCandidates };
        })(),
    );

    function refreshParams(): void {
        goto(`?${searchParams.toString()}`, { noScroll: true, keepFocus: true });
    }
    function toggleGenre(genre: Genre, prev: Boolean): void {
        if (prev) {
            searchParams.delete("genre", genre);
        } else {
            searchParams.append("genre", genre);
        }
        refreshParams();
    }
    function togglePlayer(player: string, prev: Boolean): void {
        if (prev) {
            searchParams.delete("player", player);
        } else {
            searchParams.append("player", player);
        }
        refreshParams();
    }
    let dateInputError = $state("");
    let fromDateInput = $derived(searchParams.get("from") || "");
    let toDateInput = $derived(searchParams.get("to") || "");
    function submitDateFilter(e: Event): void {
        e.preventDefault();

        dateInputError = "";
        if (fromDateInput != "") {
            try {
                Temporal.PlainDate.from(fromDateInput);
            } catch {
                dateInputError += `${fromDateInput} is not a valid date. `;
            }
        }
        if (toDateInput != "") {
            try {
                Temporal.PlainDate.from(toDateInput);
            } catch {
                dateInputError += `${toDateInput} is not a valid date. `;
            }
        }
        if (dateInputError != "") {
            return;
        }

        if (fromDateInput != "") {
            searchParams.set("from", fromDateInput);
        } else {
            searchParams.delete("from");
        }
        if (toDateInput != "") {
            searchParams.set("to", toDateInput);
        } else {
            searchParams.delete("to");
        }
        refreshParams();
    }
    function clearFilter(): void {
        searchParams.delete("genre");
        searchParams.delete("player");
        searchParams.delete("from");
        searchParams.delete("to");
        refreshParams();
    }
    const hasFilter = $derived(searchParams.size > 0);

    function displayGenre(genre: Genre): string {
        if (genre === "match") {
            return "Matches";
        } else if (genre === "news") {
            return "News";
        } else {
            return genre;
        }
    }
    function displayPlayer(player: string): string {
        if (players.has(player)) {
            return players.get(player)!.nickname;
        } else {
            return player;
        }
    }
</script>

<div class="w-7xl mx-auto flex gap-4">
    <div class="sticky top-0 max-h-screen pt-10 flex flex-col gap-4">
        <div class="flex justify-between">
            <div class="text-2xl font-bold">Filters</div>
            {#if hasFilter}
                <button class="cursor-pointer text-xl pt-1/2 hover:text-gray-400" onclick={() => clearFilter()}>[Clear]</button>
            {/if}
        </div>
        <div class="relative mt-3 ml-6 border rounded-lg pt-3 pb-1 px-4 text-nowrap">
            <div class="absolute -top-4 -left-4 bg-white px-2 text-xl font-semibold">Date</div>
            <form onsubmit={submitDateFilter}>
                <button class="absolute -top-3 right-2 cursor-pointer bg-white px-1 hover:text-gray-400">[Confirm]</button>
                <div class="my-1">
                    <label for="from" class="inline-block w-10">from: </label>
                    <input id="from" placeholder="yyyy-mm-dd" bind:value={fromDateInput} class="inline-block w-25 border-b px-1 leading-none" />
                </div>
                <div class="my-1">
                    <label for="to" class="inline-block min-w-10">to: </label>
                    <input id="to" placeholder="yyyy-mm-dd" bind:value={toDateInput} class="inline-block w-25 border-b px-1 leading-none" />
                </div>
                {#if dateInputError != ""}
                    <div class="text-red-500">
                        {dateInputError}
                    </div>
                {/if}
            </form>
        </div>
        {#if filterCandidates.genres.length > 1}
            <div class="relative mt-3 ml-6 border rounded-lg pt-3 pb-1 px-4 text-nowrap">
                <div class="absolute -top-4 -left-4 bg-white px-2 text-xl font-semibold">Genres</div>
                {#each filterCandidates.genres as [genre, toggle]}
                    <button class="filter {toggle ? 'filter-on' : 'filter-off'}" onclick={() => toggleGenre(genre, toggle)}>{displayGenre(genre)}</button>
                {/each}
            </div>
        {/if}
        {#if filterCandidates.players.length > 1}
            <div class="relative mt-3 ml-6 border rounded-lg pt-3 pb-1 px-4 text-nowrap">
                <div class="absolute -top-4 -left-4 bg-white px-2 text-xl font-semibold">Players</div>
                {#each filterCandidates.players as [player, toggle]}
                    <button class="filter {toggle ? 'filter-on' : 'filter-off'}" onclick={() => togglePlayer(player, toggle)}>{displayPlayer(player)}</button>
                {/each}
            </div>
        {/if}
    </div>

    <div class="pt-6 pl-6 flex flex-col gap-4">
        {#if sortedTimeline.length === 0}
            <div class="text-5xl text-sec-600 font-sc font-bold">History has not witnessed anything yet.</div>
        {:else}
            {#each sortedTimeline as [date, items]}
                <div class="relative border-t-2 border-l-2">
                    <div class="absolute -top-6 -left-6 p-2 bg-white font-bold text-xl text-sec-700">
                        {date.toString()}
                    </div>
                    <div class="pl-12 py-6 flex flex-col gap-3">
                        {#each items as item}
                            <div class="relative">
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
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    button.filter {
        @apply block cursor-pointer rounded-sm my-2 leading-none px-0.5;
    }
    button.filter-on {
        @apply bg-prim-600 hover:bg-prim-400 font-semibold font-sc text-white hover:text-gray-800;
    }
    button.filter-off {
        @apply hover:text-gray-400;
    }
</style>
