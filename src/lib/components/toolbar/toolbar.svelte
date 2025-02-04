<script lang="ts">
    import {
        SearchBox,
        UndoRedo,
    } from "$lib/components"
    import Searchbox from "./searchbox.svelte";

    export let searchTerm: string;
    export let adress: string;
    export let previos: Record<string, boolean> = {
        available: false,
        click: false,
    };
    export let next: Record<string, boolean> = {
        available: false,
        click: false,
    };
</script>

<div class="toolbar"> 
    <div class="toolbar-content">
        <UndoRedo bind:previos bind:next />
        <div class="seperator"></div>
        <SearchBox width={400} bind:searchTerm={adress} placeholder="Enter path to file" />
        <Searchbox bind:searchTerm placeholder="Search Files" />
    </div>
</div>

<style>
.toolbar-content {
    display: flex;
    flex: 1;
    flex-direction: row;
}
.seperator {
    width: 10px;
}
</style>
