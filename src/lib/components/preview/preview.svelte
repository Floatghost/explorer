<script lang="ts">
    import { onMount } from 'svelte';
    import { convertFileSrc } from '@tauri-apps/api/core';
    import { basename } from '@tauri-apps/api/path';
    import type { ElementInfo } from '$lib/types';
    import { size, readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

    export let selectedFiles: { selected: boolean, el: ElementInfo }[];

    let textContent: string = "";
    let selectedFile: ElementInfo = {filetype: "", icon: "", name: "", path: "", size: 0};

    $: {
        const selected = selectedFiles.filter(f => f.selected);
        if (selected.length === 1) {
            selectedFile.path = selected[0].el.path;
            updateName(selected[0].el.path);
            selectedFile.filetype = selected[0].el.filetype;
            selectedFile.size = selected[0].el.size;
            console.log("selectedFiles:", selected);
            // Read text content if it's a text file
        
            if (file_extension(selectedFile.name) === "txt") {
                readTextFile(selectedFile.path)
                    .then(text => {
                        textContent = text;
                    })
                    .catch(err => {
                        textContent = `⚠️ Could not read file:\n${err}`;
                    });
            } else {
                textContent = "";
            }
        } else {
            textContent = "";
        }
    }

    function get_size_str(bytes: number): string {
        if (bytes === 0) {
            return "0.00 B";
        }
        
        let e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, e)).toFixed(2) +
            ' ' + ' KMGTP'.charAt(e) + 'B';
    }

    async function updateName(path: string) {
        selectedFile.name = await basename(path);
        console.log("path: " + path);
        console.log("basename: " + selectedFile.name);
    }

    const txt_formats: string[] = ["c", "cpp", "c++", "rs", "txt", "json", "csv", "go", "js", "ts", "toml"];

    function file_extension(path: string): string {
        let split = path.split(".");
        let extension = split[split.length-1];

        if (txt_formats.includes(extension)) {
            return "txt"
        } else if (extension == "pdf") {
            return "pdf";
        } else if (extension == "png" || extension == "jpeg" || extension == "jpg" || extension == "webp") {
            return "img";
        } else {
            return "default";
        }
    }

    // optionally initialize on mount
    onMount(() => {
        
    });
</script>

<div class="preview-wrapper">
    {#if file_extension(selectedFile.name) == "default"}
        <div class="extension-wrapper">
            <div class="name">
                {selectedFile.name}
            </div>
            <div class="info">
                size: {get_size_str(selectedFile.size)}
                <br>
                filetype: {selectedFile.filetype}
                <br>
                path: {selectedFile.path}
            </div>
        </div>
    {/if}
    {#if file_extension(selectedFile.name) == "txt"}
        <div class="extension-wrapper">
            <div class="name">
                {selectedFile.name}
            </div>
            <div class="text_out">
                <pre>{textContent}</pre>
            </div>
            <div class="info">
                    size: {get_size_str(selectedFile.size)}
                    <br>
                    filetype: {selectedFile.filetype}
                    <br>
                    path: {selectedFile.path}
            </div>
        </div>
    {/if}
    {#if file_extension(selectedFile.name) == "pdf"}
        <div class="extension-wrapper">
            <div class="name">
                pdf
            </div>
            <div class="info">
                    size: {get_size_str(selectedFile.size)}
                    <br>
                    filetype: {selectedFile.filetype}
                    <br>
                    path: {selectedFile.path}
            </div>
        </div>
    {/if}
    {#if file_extension(selectedFile.name) == "img"}
        <div class="extension-wrapper">
            <div class="name">
                {selectedFile.name}
            </div>
            <center>
                <img class="img_preview" src={convertFileSrc(selectedFile.path)} alt="preview" style="width: 90%;">
            </center>
            <div class="info">
                    size: {get_size_str(selectedFile.size)}
                    <br>
                    filetype: {selectedFile.filetype}
                    <br>
                    path: {selectedFile.path}
            </div>
        </div>
    {/if}
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
    .extension-wrapper {
        width: calc(100% - 10px - 10px);
        height: 100%;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
        user-select: none;
    }
    .name {
        display: flex;
        justify-content: center;
        color: var(--text-color);
        user-select: none;
        background-color: var(--primary-color);
        padding: 5px;
        border-radius: 5px;
        border: 1px solid var(--border-color);
        color: var(--text-unfocused);
    }
    .name:hover {
        color: white;
    }
    .text_out {
        margin-top: 10px;
        padding: 10px;
        background-color: var(--primary-color);
        border: 1px solid var(--border-color);
        border-radius: 5px;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: break-word;
        color: var(--text-color);
        max-height: 400px;
        overflow-y: auto;
        user-select: text;
    }

    .img_preview {
        border: 1px solid var(--border-color);
        border-radius: 2px;
        margin-top: 10px;
    }
    .info {
        margin-top: 10px;
        padding: 3px;
        background-color: var(--primary-color);
        border: 1px solid var(--border-color);
        border-radius: 5px;
        
        display: flex;
        flex-direction: column;
        color: var(--text-unfocused);

        width: calc(100% - 3px -1px);
        white-space: normal;            /* allow multi-line */
        overflow-wrap: break-word;      /* break long words */
        word-break: break-word;         /* fallback for very long tokens */
        user-select: none;
    }

    .info:hover {
        color: white;
    }

</style>
