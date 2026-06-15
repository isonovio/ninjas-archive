<script lang="ts" generics="Candidate">
    import type { FilterState } from "$lib/types/timeline-filter";
    import { suppressAfterClick } from "$lib/actions/suppressAfterClick";

    interface Props {
        candidates: Candidate[];
        getState: (c: Candidate) => FilterState;
        getMainHandler: (c: Candidate) => () => void;
        getAltHandler: (c: Candidate) => () => void;
        display: (c: Candidate) => string;
        compact?: boolean;
    }

    let { candidates, getState, getMainHandler, getAltHandler, display, compact = true }: Props = $props();
</script>

<div class="flex flex-col items-start gap-2">
    <div class:hidden={!compact} class="absolute -top-3 right-2 bg-white px-1 text-gray-700">
        {candidates.length} options
    </div>
    {#each candidates as candidate}
        {@const state = getState(candidate)}
        <div class:hidden={compact} class="group-hover/box:flex leading-none group/button flex items-center">
            {#if state === "exclude"}
                <button onclick={getAltHandler(candidate)} class="alt-action peer/include text-green-700 order-2">✔</button>
            {:else}
                <button onclick={getAltHandler(candidate)} class="alt-action peer/exclude text-red-700 order-2">✘</button>
            {/if}
            <button
                use:suppressAfterClick
                onclick={getMainHandler(candidate)}
                class="candidate order-1"
                class:filter-include={state === "include"}
                class:filter-exclude={state === "exclude"}
            >
                {display(candidate)}
            </button>
        </div>
    {/each}
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    @utility candidate-faint {
        @apply border-gray-200 text-gray-400 font-normal font-no-sc no-underline;
    }
    @utility candidate-include {
        @apply border-green-700 text-green-700 font-semibold font-sc no-underline;
    }
    @utility candidate-exclude {
        @apply border-red-700 text-red-700 font-semibold font-sc line-through;
    }

    button.alt-action {
        @apply hidden group-hover/button:block  px-2;
    }

    button.candidate {
        & {
            @apply cursor-pointer border-x-4 border-white leading-none px-1 text-sm;
            @apply hover:candidate-include;
            @apply peer-hover/exclude:candidate-exclude;
        }
        &.filter-include {
            @apply block;
            @apply candidate-include;
            @apply hover:candidate-faint;
            @apply peer-hover/exclude:candidate-exclude;
        }
        &.filter-exclude {
            @apply block;
            @apply candidate-exclude;
            @apply hover:candidate-faint;
            @apply peer-hover/include:candidate-include;
        }
    }
</style>
