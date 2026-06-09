<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        active: boolean;
        onclick: () => void;
        children: Snippet;
    }
    let { active, onclick, children }: Props = $props();
</script>

<button class="filter" class:filter-on={active} {onclick}>
    {@render children()}
</button>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    button.filter {
        @apply block cursor-pointer m-2 border-x-4 border-white leading-none px-1;
        @apply hover:text-gray-400 hover:border-gray-600 hover:font-semibold hover:font-sc;
        @apply text-sm;
    }
    button.filter-on {
        @apply border-black font-semibold font-sc;
        @apply hover:border-gray-200 hover:font-normal hover:font-no-sc;
    }
</style>
