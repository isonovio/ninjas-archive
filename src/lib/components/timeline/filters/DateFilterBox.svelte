<script lang="ts">
    import { Temporal } from "$lib/utils/temporal";
    import FilterBox from "./FilterBox.svelte";
    import { queryFromDateFilter, queryToDateFilter } from "$lib/types/timeline-filter";

    interface Props {
        params: URLSearchParams;
        onUpdate: () => void;
    }
    let { params, onUpdate }: Props = $props();

    let fromDateInput = $derived(params.get("from") || "");
    let toDateInput = $derived(params.get("to") || "");
    let dateInputError = $state("");

    $effect(() => {
        fromDateInput = params.get("from") || "";
        toDateInput = params.get("to") || "";
    });

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
            params.set("from", fromDateInput);
        } else {
            params.delete("from");
        }
        if (toDateInput != "") {
            params.set("to", toDateInput);
        } else {
            params.delete("to");
        }
        onUpdate();
    }
</script>

<FilterBox label="Date">
    <form onsubmit={submitDateFilter}>
        <div class="mt-1 mx-2">
            <label for="from" class="inline-block w-11 border-l-4 border-white pl-1 leading-none text-sm" class:filter-on={queryFromDateFilter(params)}>from: </label>
            <input id="from" placeholder="yyyy-mm-dd" bind:value={fromDateInput} class="inline-block w-24 border-b border-dashed px-1 leading-none text-sm" />
        </div>
        <div class="mb-1 mx-2">
            <label for="to" class="inline-block w-11 border-l-4 border-white pl-1 leading-none text-sm" class:filter-on={queryToDateFilter(params)}>to: </label>
            <input id="to" placeholder="yyyy-mm-dd" bind:value={toDateInput} class="inline-block w-24 border-b border-dashed px-1 leading-none text-sm" />
        </div>
        {#if dateInputError != ""}
            <div class="text-red-500">
                {dateInputError}
            </div>
        {/if}
        <button class="absolute -top-2.5 right-2 cursor-pointer bg-white px-1 hover:text-gray-400 text-sm">[Confirm]</button>
    </form>
</FilterBox>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    label.filter-on {
        @apply border-black font-semibold font-sc;
    }
</style>
