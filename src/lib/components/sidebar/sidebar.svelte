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
    export let update: boolean;

    let tree: Pinned = Pinned_empty;

    $: if (files) { 
        tree = get_all_dirs();
    } // Will re-run whenever `files` changes

    function get_all_dirs(): Pinned {
        let out: Pinned = { elements: [] };

        files.elements.forEach((el) => {
            if (el.filetype === "dir") {
                out.elements.push(el);
            }
        });
        
        return out;
    }

    async function open_dir(el: ElementInfo) {
        history = push_followup_history(history, el);
        tree = get_all_dirs();   // now update the tree based on new files
        update = true;
    }
</script>

<div class="sidebar-wrapper">
    <div class="pinned">

    </div>
    <div class="tree">
        {#each tree.elements as dir}
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
        align-items: flex-start;
        gap: 2px;
        width: 100%;
        height: 100%;
        background-color: var(--secondary-color);
    }
    .folder {
        width: calc(100% - 10px);
        height: 100%;
        margin-left: 10px;
        display: flex;
        flex: 0;
        justify-content: left;
        color: var(--text-unfocused);
        border: 1px solid transparent;
        border-radius: 5px;
        user-select: none;
        background-color: var(--secondary-color);

        /* Prevent wrapping */
        white-space: nowrap;
        overflow: visible;
        text-overflow: ellipsis;
    }
    .folder:hover {
        border: 1px solid var(--border-color);
        color: white;
    }
</style>
