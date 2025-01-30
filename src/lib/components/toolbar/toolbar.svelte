<script lang="ts">
    import {
        SearchBox,

    } from "$lib/components"
    import Searchbox from "./searchbox.svelte";

    export let searchTerm: string;
</script>

<div class="toolbar"> 
    <div class="toolbar-content">
        <Searchbox bind:searchTerm />
    </div>
</div>