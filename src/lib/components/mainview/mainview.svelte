<script lang="ts">
    import { File } from "$lib/components/mainview/index";
    import type { DirInfo, ElementInfo, History } from "$lib/types";
    import { get_files } from "$lib/utils";

    export let path: string;
    export let history: History;
    export let files: DirInfo = { elements: [], name: "", sub_dirs: 0, sub_files: 0 };
    export let update: boolean;
    export let searchTerm: string;
    
    let clicked: ElementInfo | null = null;
    let fileicontype: string = "svg";
    let fileiconpath: string = "mdi:file-document";

    async function updateFiles() {
        const updatedFiles = await get_files(path);
        files = updatedFiles;
    }

    // Reactively call updateFiles() when update changes to true
    $: if (update) {
        (async () => {
            await updateFiles();
            update = false; // Setze `update` zurück, aber erst nach erfolgreicher Aktualisierung
        })();
    }

    $: if (clicked?.filetype === "dir") {
        if (!path.endsWith("\\")) {
            path += "\\";
        }
        
        path += clicked.name;
        update = true;
        clicked = null; // Verhindert falsche Referenzen
    }

    console.log("mainview called");
</script>

<div class="mainview-wrapper">
    <div class="files-wrapper">
        {#each files.elements as file}
            <File
                bind:clicked
                bind:fileicontype
                bind:fileiconpath
                bind:fileinfo={file}
                bind:history
                bind:path
            />
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
        flex-wrap: wrap;
        justify-content: center;
        align-content: flex-start;
        align-items: flex-start;
        gap: 10px;
        padding-top: 5px;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: calc(100vh - 50px);
    }

    .files-wrapper > * {
        flex-basis: calc(25% - 10px);
        max-width: calc(25% - 10px);
    }

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
