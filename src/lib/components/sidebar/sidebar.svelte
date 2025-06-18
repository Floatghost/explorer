<script lang="ts">
    import { Pinned_empty, type DirInfo, type ElementInfo, type History, type Pinned, type Update } from "$lib/types";
    import { get_files, push_followup_history, search } from "$lib/utils";
    import { tick } from "svelte";

    export let files: DirInfo;
    export let pinned: {
        elements: ElementInfo[],
    };
    export let history: History;
    export let selectedFiles: { selected: boolean, path: string }[] = []; // Tracks selected files
    export let update: Update;

    function get_all_dirs(): Pinned {
        let out: Pinned = Pinned_empty;

        files.elements.forEach((el) => {
            if (el.filetype === "dir") {
                out.elements.push(el);
            }
        });
        
        return out;
    }

    function open_dir(el: ElementInfo) {
        push_followup_history(history, el);
        update.mainview = true;
    }

    async function loadFiles() {
        try {
            if (history.paths[history.index].get_function === "search") {
                files = await search(history.paths[history.index].get_input);
            } else if (history.paths[history.index].get_function === "filesystem") {
                files = await get_files(history.paths[history.index].get_input);
            } else {
                console.error("Unknown get_function:", history.paths[history.index].get_function);
            }
            await tick(); // Ensure DOM updates before resetting selection
            selectedFiles = files.elements.map(() => ({ selected: false, path: "" }));
        } catch (err) {
            console.error("Error fetching files:", err);
        }
    }
</script>

<div class="sidebar-wrapper">
    <div class="pinned">

    </div>
    <div class="tree">
        {#each get_all_dirs().elements as dir}
            <button class="folder" on:click={() => open_dir(dir)}>
                {dir.name}
            </button>
        {/each}
    </div>
</div>

<style>
    .sidebar-wrapper {
        width: 100%;
        height: 100%;
        border-right: 1px solid var(--border-color);
        background-color: var(--secondary-color);
        overflow-x: hidden;
        overflow-y: scroll;
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        background: var(--secondary-color);
    }

    ::-webkit-scrollbar-thumb {
        background: var(--text-unfocused);
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--text-color);
    }

    .sidebar-wrapper:hover {
        border-color: var(--selected-color);
    }

    .tree {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        width: 100%;
        height: 100%;
        background-color: var(--secondary-color);
    }
    .folder {
        width: 90%;
        height: 100%;
        display: flex;
        justify-content: left;
        color: var(--text-unfocused);
        border: 1px solid transparent;
        border-radius: 5px;
        user-select: none;
        background-color: var(--secondary-color);
    }
    .folder:hover {
        border: 1px solid var(--border-color);
        color: white;
    }
</style>
