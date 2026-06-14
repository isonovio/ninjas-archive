<script lang="ts">
    const currentYear = new Date().getFullYear();

    const navs: [string, string][] = [["/credits/", "Credits"]];
</script>

<footer class="px-20 py-10 flex justify-between">
    <div class="flex gap-10">
        <div>Ninjas Archive © {currentYear}</div>
        <div>Crafted by WYND with ♥︎</div>
    </div>
    <nav class="flex gap-10">
        {#each navs as [route, title]}
            <a href={route} class="hover:border-b hover:text-gray-500">
                {title}
            </a>
        {/each}
    </nav>
</footer>
