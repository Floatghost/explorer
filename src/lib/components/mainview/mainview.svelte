<script lang="ts">
    import { File, Contextmenu } from "$lib/components/mainview/index";
    import type { DirInfo, ElementInfo, History, History_entry, Update } from "$lib/types";
    import { get_files, search, push_history, push_followup_history } from "$lib/utils";
    import { tick } from "svelte";

    export let path: string;
    export let history: History;
    export let files: DirInfo = { elements: [], name: "", sub_dirs: 0, sub_files: 0 };
    export let update: Update;
    export let searchTerm: string;
    export let contextmenu_info: {
        show: boolean,
        pos: {x: number, y: number},
    };
    export let settings_info: {
        show: boolean,
    };

    let clicked: ElementInfo | null = null;
    let fileicontype: string = "svg";
    let fileiconpath: string = "mdi:file-document";
    
    export let selectedFiles: { selected: boolean, el: ElementInfo }[]; // Tracks selected files
    let divRefs: { el: HTMLElement; id: number }[] = []; // Stores references with IDs

    //update files
    $: if (update.mainview) {
        async () => {
            await tick();
        };
        loadFiles();
        //update.sidebar = true; // for some reason long loop loading folders over and over agin in sidebar
    }

    $: if (update.path) {
        update.path = false;
        history.paths.push({
            get_function: "filesystem",
            get_input: path,
            name_in_addressbar: path,
        });
        history.index = history.paths.length-1;
        (async () => {
            loadFiles();
        })();
    }

    $: if (update.sidebar) {
        update.sidebar = false;
        (async () => {
            loadFiles();
        })();
    }

    $: if (update.search) {
        history.paths.push({
            get_function: "search",
            get_input: searchTerm,
            name_in_addressbar: "search for \"" + searchTerm + "\"",
        });
        history.index = history.paths.length-1;
        update.search = false;
        
        (async () => {
            loadFiles();
        })();
    }

    async function loadFiles() {
        console.log("updating...");
        try {
            if (history.paths[history.index].get_function === "search") {
                files = await search(history.paths[history.index].get_input);
                path = history.paths[history.index].name_in_addressbar;
            } else if (history.paths[history.index].get_function === "filesystem") {
                files = await get_files(history.paths[history.index].get_input);
                path = history.paths[history.index].name_in_addressbar;
            } else {
                console.error("Unknown get_function:", history.paths[history.index].get_function);
            }
            
            await tick(); // Ensure DOM updates before resetting selection

            selectedFiles = [];
            for(let i = 0; i < files.elements.length; i++) {
                selectedFiles.push({
                    selected: false, 
                    el: files.elements[i]
                });
            }
            selectedFiles = selectedFiles;
        } catch (err) {
            console.error("Error fetching files:", err);
        }

        let filess = document.getElementsByClassName("file");
        let elems: HTMLElement[] = Array.from(filess) as HTMLElement[];
        console.log("before bindDiv call");
        elems.forEach((el, i) => {
            bindDiv(el, i);
        });

        update.mainview = false;
    }

    $: if (clicked?.filetype === "dir") {
        if (!path.endsWith("\\")) {
            path += "\\";
        }
        
        history = push_followup_history(history, clicked);
        update.mainview = true;
        clicked = null;
    }

    // Selection Box Interface
    interface SelectionBox {
        startX: number;
        startY: number;
        x: number;
        y: number;
        width: number;
        height: number;
        active: boolean;
    }

    let selectionBox: SelectionBox = {
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        active: false
    };

    function onPointerDown(event: PointerEvent) {
        selectionBox.startX = event.clientX;
        selectionBox.startY = event.clientY;
        selectionBox.x = event.clientX;
        selectionBox.y = event.clientY;
        selectionBox.width = 0;
        selectionBox.height = 0;
        selectionBox.active = true;

        selectedFiles.forEach(file => file.selected = false); // Reset selection
        selectedFiles = selectedFiles;

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    }

    function onPointerMove(event: PointerEvent) {
        if (!selectionBox.active) return;

        selectionBox.x = Math.min(event.clientX, selectionBox.startX);
        selectionBox.y = Math.min(event.clientY, selectionBox.startY);
        selectionBox.width = Math.abs(event.clientX - selectionBox.startX);
        selectionBox.height = Math.abs(event.clientY - selectionBox.startY);

        checkSelection();
    }

    function onPointerUp() {
        selectionBox.active = false;

        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
    }

    function checkSelection() {
        selectedFiles.forEach(file => file.selected = false);
        selectedFiles = selectedFiles;

        const box = {
            left: selectionBox.x,
            top: selectionBox.y,
            right: selectionBox.x + selectionBox.width,
            bottom: selectionBox.y + selectionBox.height
        };
        divRefs.forEach(({ el, id }) => {
            const rect = el.getBoundingClientRect();

            if (
                rect.left < box.right &&
                rect.right > box.left &&
                rect.top < box.bottom &&
                rect.bottom > box.top
            ) {
                selectedFiles[id].selected = true;
                //console.log("set to true");
            }
        });
        //console.log("selected files");
        //console.log(selectedFiles);
    }

    function bindDiv(el: HTMLElement, id: number) {
        if (!el) return;

        // Remove duplicates before pushing
        divRefs = divRefs.filter(ref => ref.id !== id);
        divRefs.push({ el, id });
        //console.log("pushed");
        //console.log(divRefs);
    }

    function add_to_selected(id: number, el: ElementInfo) {
        console.log("add_to_selected: " + id + " " + el);
        selectedFiles.forEach(el => {
            el.selected = false;
        });
        selectedFiles[id].selected = true;

        selectedFiles = [...selectedFiles];
    }

    //if (selectedFiles[0].selected !== undefined) {selectedFiles[0].selected = true}
</script>

<Contextmenu
    bind:contextmenu_info
    bind:settings_info
/>

<!-- Svelte HTML -->
<div class="mainview-wrapper" on:pointerdown={onPointerDown}>
    {#if selectionBox.active}
        <div
        class="selection-box"
        style="
            left: {selectionBox.x}px;
            top: {selectionBox.y}px;
            width: {selectionBox.width}px;
            height: {selectionBox.height}px;
        "
        ></div>
    {/if}

    <div class="files-wrapper">
        {#each files.elements as file, i}
            <div class="file"> <!-- ✅ Store reference safely -->
                <File
                    bind:clicked
                    bind:fileicontype
                    bind:fileiconpath
                    bind:fileinfo={file}
                    bind:history
                    bind:path
                    selected={selectedFiles[i]}
                    on:clicked={() => add_to_selected(i, file)}
                />
            </div>
        {/each}
    
    </div>
</div>

<style>
    .mainview-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: var(--primary-color);
        width: 100%;
        height: 100%;
    }

    .selection-box {
        position: absolute;
        background: rgba(100, 100, 255, 0.3); /* Light blue background */
        border: 1px solid rgba(100, 100, 255, 0.7); /* Blue border */
        z-index: 1000;
        pointer-events: none; /* Ignore mouse events */
    }

    .files-wrapper {
        height: 100%;
        width: 100%;
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

    

    ::-webkit-scrollbar {
        width: 5px;
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
