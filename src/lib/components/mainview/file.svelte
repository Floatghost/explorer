<script lang="ts">
    import Icon from "@iconify/svelte"
    import "$lib/app.css"
    import type { ElementInfo, History } from "$lib/types";
    import {formatBytes, delete_all_history_above, push_followup_history} from "$lib/utils/index";
    
    export let fileicontype: string;
    export let fileiconpath: string;
    export let clicked: ElementInfo | null;
    export let fileinfo: ElementInfo;
    export let history: History;
    export let path: string;
    export let selected: {
        selected: boolean,
        path: string,
    };

    function push_history(input: ElementInfo) {
        if (input.filetype === "dir") {
            let parent_folder: string = path;
            if (!parent_folder.endsWith("\\")) {
                parent_folder += "\\";
            }

            push_followup_history(history, input);

            console.log("history paths: " + history.paths);
            console.log("history index: " + history.index);
        }
    }

</script>

<div class="file-wrapper-{selected.selected ? "selected" : "not"}">
    <button class="file-btn" on:click={() => {clicked = fileinfo; push_history(clicked)}} on:dblclick={() => {clicked = fileinfo}} >
        {#if fileicontype == "svg"}
            <Icon width=100% icon={fileiconpath} height=auto />
        {/if}
        <span class="tooltip">
            name: {fileinfo?.name}
            <br/>
            size: {formatBytes(fileinfo?.size)}
        </span>
        <div class="file-name">
            {fileinfo.name}
        </div>
    </button>
</div>

<style>
    .file-wrapper-not {
        border: 1px solid transparent;
        display: flex;
        justify-content: center;
        width: var(--file-width);
        position: relative; /* Ensures absolute positioning of tooltip is relative to this */
        border: 1px solid transparent;
    }
    .file-wrapper-selected {
        border: 1px solid aliceblue;
        display: flex;
        justify-content: center;
        width: var(--file-width);
        position: relative; /* Ensures absolute positioning of tooltip is relative to this */
    }
    .tooltip {
        visibility: hidden;
        background-color: var(--secondary-color);
        color: var(--text-color);
        text-align: center;
        padding: 5px;
        border-radius: 4px;
        border: 1px solid var(--border-color);
        position: absolute;
        max-width: 120px;
        word-wrap: break-word;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        white-space: normal;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
        transition-delay: 1s;

        /* Centering tooltip */
        top: 110%; /* Position above the button */
        left: 50%;
        transform: translateX(-50%);
    }

    /* Make tooltip visible on hover */
    .file-btn:hover .tooltip {
        visibility: visible;
        opacity: 1;
    }
    .file-wrapper:focus-visible {
        outline: none;
    }
    .file-btn:focus-visible {
        outline: none;
    }
    .file-btn {
        border: 1px solid transparent;
        border-radius: 5px;
        background-color: var(--primary-color);
        width: 100%;
        color: var(--text-unfocused);
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }
    .file-name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;     /* Add ellipsis for overflowing content */
        display: -webkit-box;        /* Enable webkit box layout */
        -webkit-box-orient: vertical; /* Set box orientation to vertical */
        -webkit-line-clamp: 2;       /* Limit to 2 lines */
        line-clamp: 2;
        max-width: var(--file-width);
        line-height: 1.2em;          /* Adjust line height to fit text neatly */
        max-height: calc(1.2em * 2); /* Match the line height for 2 lines */
        word-wrap: break-word;       /* Break long words if needed */
        margin-top: 5px;     
    }
    .file-btn:hover {
        border-color: var(--selected-color);
        color: var(--text-color);
        background-color: #272e4f;
    }
    .file-btn:focus {
        color: var(--text-color);
        border-color: var(--selected-color);
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--selected-color) 50%, transparent);
    }
</style>
