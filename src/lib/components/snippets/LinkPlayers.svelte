<script lang="ts">
    import { players as allPlayers, type Player } from "$lib/types/player";
    export let players: string[];
</script>

<div class="flex gap-2">
    {#each players as player}
        {#if allPlayers.has(player)}
            <a href={`/player/${player}`} class="z-10 text-sm font-normal text-gray-400 hover:text-gray-800">
                {allPlayers.get(player)!.nickname}
            </a>
        {/if}
    {/each}
</div>
