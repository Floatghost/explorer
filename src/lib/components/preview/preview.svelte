<script lang="ts">
    import { onMount } from 'svelte';
    import { convertFileSrc } from '@tauri-apps/api/core';
    import { basename } from '@tauri-apps/api/path';

    export let selectedFiles: { selected: boolean, path: string }[];

    let img_path: string = convertFileSrc("C:\\Users\\levin\\Downloads\\mandelbrot1732135005148_r-0.509765625_im0_z4.png");
    let name: string = "";

    $: if (selectedFiles.length === 1) {
        img_path = convertFileSrc(selectedFiles[0].path);
        updateName(selectedFiles[0].path);
        console.log("selectedFiles: " + selectedFiles);
    }

    //$: console.log("selectedFiles: " + selectedFiles);

    async function updateName(path: string) {
        name = await basename(path);
        console.log("path: " + path);
        console.log("basename: " + name);
    }

    // optionally initialize on mount
    onMount(() => {
        if (selectedFiles.length === 1) {
            img_path = convertFileSrc(selectedFiles[0].path);
        }
        updateName(selectedFiles[0].path);
    });
</script>

<div class="preview-wrapper">
    <div class="name">
        {selectedFiles.length}
    </div>
    <img src={img_path} alt="preview" style="width: 90%;">
</div>

<style>
    .preview-wrapper {
        width: 100%;
        height: 100%;
        border-left: 1px solid var(--border-color);
        background-color: var(--secondary-color);
        color: var(--text-color);
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
    }
    .preview-wrapper:hover {
        border-color: var(--selected-color);
    }
    .name {
        color: var(--text-color);
    }
</style>
