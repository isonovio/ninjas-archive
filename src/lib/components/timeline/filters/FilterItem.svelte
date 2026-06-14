<script lang="ts">
    import type { Snippet } from "svelte";
    import type { FilterState } from "$lib/types/timeline-filter";

    interface Props {
        state: FilterState;
        onclick: () => void;
        children: Snippet;
    }
    let { state, onclick, children }: Props = $props();
</script>

<button class="filter" class:filter-yes={state === "yes"} class:filter-no={state === "no"} {onclick}>
    {@render children()}
</button>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    button.filter {
        & {
            @apply block cursor-pointer m-2 border-x-4 border-white leading-none px-1 text-sm;
        }
        &:hover {
            @apply border-green-700 text-green-700 font-semibold font-sc;
        }
    }
    button.filter-yes {
        & {
            @apply border-green-700 text-green-700 font-semibold font-sc;
        }
        &:hover {
            @apply border-red-600 text-red-600 font-semibold font-sc line-through;
        }
    }
    button.filter-no {
        & {
            @apply border-red-600 text-red-600 font-semibold font-sc line-through;
        }
        &:hover {
            @apply border-gray-200 text-gray-400 font-normal font-no-sc no-underline;
        }
    }
</style>
