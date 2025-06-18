<script lang="ts">
    import { onMount } from 'svelte';
    import { convertFileSrc } from '@tauri-apps/api/core';
    import { basename } from '@tauri-apps/api/path';

    export let selectedFiles: { selected: boolean, path: string }[];

    let img_path: string = convertFileSrc("C:\\Users\\sus.levin.liechti\\Downloads\\happy-tree.png");
    let name: string = "";

    $: if (selectedFiles.length === 1) {
        img_path = convertFileSrc(selectedFiles[0].path);
        updateName(selectedFiles[0].path);
    }

    async function updateName(path: string) {
        name = await basename(path);
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
        {name}
    </div>
    <img src={img_path}>
</div>

<style>
    .preview-wrapper {
        width: 100px;
        border-left: 1px solid var(--border-color);
        background-color: var(--secondary-color);
        color: var(--text-color);
    }
    .preview-wrapper:hover {
        border-color: var(--selected-color);
    }
    .name {
        color: var(--text-color);
    }
</style>
