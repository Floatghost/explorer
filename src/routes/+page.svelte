<script lang="ts">
import {
    ToolBar
} from "$lib/components/index"

let isLoading = false;
let searchTerm: string;
</script>

{#if isLoading}
    <p>is loading</p>
{:else}
    <div class="app-container">
        <ToolBar bind:searchTerm />
    </div>
{/if}

<style>
    .app-container {
        width: 100%;
        height: 100%;
    }
</style>
