<script lang="ts">
    import { onMount } from 'svelte';
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
    
    let selectedFiles: Set<number> = new Set(); // Tracks selected files
    let divRefs: { el: HTMLElement; id: number }[] = []; // Stores references with IDs
    let divElements: HTMLElement[] = []; // Stores only HTMLElements for `bind:this`
  
    async function updateFiles() {
        const updatedFiles = await get_files(path);
        files = updatedFiles;
    }
  
    $: if (update) {
        (async () => {
            await updateFiles();
            update = false; // Reset update flag
        })();
    }
  
    $: if (clicked?.filetype === "dir") {
        if (!path.endsWith("\\")) {
            path += "\\";
        }
        path += clicked.name;
        update = true;
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
  
      selectedFiles.clear(); // Reset selection
  
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }
  
    function onPointerMove(event: PointerEvent) {
      if (!selectionBox.active) return;
  
      // Compute correct box regardless of direction
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
    selectedFiles.clear();
    
    const box = {
        left: selectionBox.x,
        top: selectionBox.y,
        right: selectionBox.x + selectionBox.width,
        bottom: selectionBox.y + selectionBox.height
    };
    divRefs.forEach(({ el, id }) => {
        const rect = el.getBoundingClientRect();
        //console.log(
        //    "left" + rect.left +
        //    "right" + rect.right +
        //    "top" + rect.top +
        //    "bottom" + rect.bottom
        //);
        //console.log("test");
        if (
            rect.left < box.right &&
            rect.right > box.left &&
            rect.top < box.bottom &&
            rect.bottom > box.top
        ) {
            selectedFiles.add(id);
        }
    });
    console.log(selectedFiles);
}

function bindDiv(el: HTMLElement, id: number) {
    if (!el) return;

    // Remove duplicates before pushing
    divRefs = divRefs.filter(ref => ref.id !== id);
    divRefs.push({ el, id });
    console.log("pushed");
    console.log(divRefs);
}

$: {
        if (update) {
            let files = document.getElementsByClassName("file");
            let elems: HTMLElement[] = Array.from(files) as HTMLElement[];
            elems.forEach((el, i) => {
                bindDiv(el, i);
            });
        }
    }

</script>

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
                    bind:selected={selectedFiles[i]}
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
</style>
