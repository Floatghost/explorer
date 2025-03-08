<script lang="ts">
    import {
        SearchBox,
        UndoRedo,
    } from "$lib/components"
    import Searchbox from "./searchbox.svelte";
    import type {History, Update} from "$lib/types/index";

    export let searchTerm: string;
    export let adress: string;
    export let update: Update;
    export let history: History;
</script>

<div class="toolbar"> 
    <div class="toolbar-content">
        <UndoRedo bind:refresh={update} bind:history bind:path={adress} />
        <div class="seperator"></div>
        <div class="searchboxes-container">
            <div class="address-container">
                <SearchBox width={400} bind:searchTerm={adress} bind:update={update.search} placeholder="Path" />
            </div>
            <div class="search-container">
                <Searchbox bind:searchTerm bind:update={update.search} placeholder="Search" />    
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
    border-color: var(--selected-color);
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
