<script lang="ts">
    import "$lib/styles/global.css";
    import favicon from "$lib/assets/favicon.svg";
    import Header from "$lib/components/Header.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<Header />

<div class="w-5xl mx-auto">
    {@render children()}
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";
</style>
