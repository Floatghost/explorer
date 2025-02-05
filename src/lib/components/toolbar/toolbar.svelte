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
    let refresh: boolean = false;
</script>

<div class="toolbar"> 
    <div class="toolbar-content">
        <UndoRedo bind:previos bind:next bind:refresh />
        <div class="seperator"></div>
        <div class="searchboxes-container">
            <div class="address-container">
                <SearchBox width={400} bind:searchTerm={adress} placeholder="Path" />
            </div>
            <div class="search-container">
                <Searchbox bind:searchTerm placeholder="Search" />    
            </div>
        </div>
    </div>
</div>

<style>
.toolbar {
    padding-top: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--secondary-color);
}
.toolbar:hover {
    border-color: var(--border-color-light);
}
.toolbar-content {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
}
.seperator {
    width: 10px;
}
.searchboxes-container {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: right;
}
.address-container {
    width: 60%;
    min-width: 200px;
}
.search-container {
    width: 20%;
    min-width: 200px;
}
</style>
