<script lang="ts">
    import { File } from "$lib/components/mainview/index";
    import type { DirInfo } from "$lib/types";
    import { get_files } from "$lib/utils";

    export let path: string;
    export let files: DirInfo = {elements: [], name: "", sub_dirs: 0, sub_files: 0};
    let clicked: number;
    let fileicontype: string = "svg";
    let fileiconpath: string = "mdi:file-document";


    async function updateFiles() {
        files = await get_files(path);
        console.log("Files updated:", files);
    }
    

    console.log("mainview called");
</script>

<div class="mainview-wrapper">
    <div class="files-wrapper">
        {#each files.elements as file}
            <File bind:clicked bind:fileicontype bind:fileiconpath />
        {/each}
    </div>
</div>

<style>
    .mainview-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: var(--primary-color);
    }

    .files-wrapper {
        flex: 1;
        display: flex;
        flex-wrap: wrap; /* Allow wrapping */
        justify-content: center; /* Center items */
        align-items: flex-start; /* Align items to the top */
        gap: 10px; /* Space between items */
        padding-top: 5px;
        overflow-x: hidden;
        overflow-y: auto; /* Enable scrolling */
        max-height: calc(100vh - 50px); /* Adjust based on layout needs */
    }

    /* Ensure File components take up space */
    .files-wrapper > * {
        flex-basis: calc(25% - 10px); /* Adjust width, 4 per row */
        max-width: calc(25% - 10px);
    }

    /* Scrollbar Styling */
    .files-wrapper {
        scrollbar-width: thin; /* Firefox */
        scrollbar-color: var(--text-unfocused) var(--primary-color); /* Thumb and track */
    }
    /*
    .files-wrapper:hover {
        scrollbar-color: var(--text-color) var(--primary-color);
    }
    */

    /* Webkit-based browsers */
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: var(--primary-color);
    }

    ::-webkit-scrollbar-thumb {
        background: var(--text-unfocused);
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--text-color);
    }
</style>
