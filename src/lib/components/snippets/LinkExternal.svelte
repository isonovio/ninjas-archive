<script lang="ts">
    import LinkExternalSVG from "$lib/assets/link-external.svelte";

    export let name: string;
    export let url: string;
</script>

<a href={url} class="text-sec-600 hover:text-sec-200 text-nowrap">
    {name}<LinkExternalSVG />
</a>
