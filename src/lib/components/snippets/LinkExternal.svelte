<script lang="ts">
    import LinkExternalSVG from "$lib/assets/link-external.svelte";
    import { type ExternalLink } from "$lib/types/externlink";

    export let link: ExternalLink;
</script>

<a href={link.url} class="inline-block text-sec-600 hover:text-sec-200">
    {link.name}<LinkExternalSVG />
</a>
