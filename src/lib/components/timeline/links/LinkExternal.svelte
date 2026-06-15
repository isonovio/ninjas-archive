<script lang="ts">
    import LinkExternalSVG from "$lib/assets/link-external.svelte";
    import { type ExternalLink } from "$lib/types/externlink";

    interface Props { link: ExternalLink }
    let { link }: Props = $props();
</script>

<a href={link.url} class="inline-block font-light text-yellow-800 hover:text-yellow-400">
    {link.name}<LinkExternalSVG />
</a>
