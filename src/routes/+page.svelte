<script lang="ts">
    import {
        ToolBar,
        MainView,
        Sidebar,
        Preview,
        Infobar
    } from "$lib/components/index";
    import "$lib/app.css";
    import { onMount } from 'svelte';
    import { themeStore } from "$lib/stores";
    import type { DirInfo, History, Update } from "$lib/types";
    import { set_update, load_settings } from "$lib/utils";

    let isLoading: boolean = true;
    let searchTerm: string = "";
    let history: History = { paths: ["C:\\"], index: 0 };
    let path: string = "C:\\";
    let files: DirInfo = { elements: [], name: "", sub_dirs: 0, sub_files: 0 };
    let update: Update = set_update(false);

    let sidebarWidth = 100;
    let previewWidth = 100;
    let resizingTarget: "sidebar" | "preview" | null = null;
    let selectedFiles: { selected: boolean, path: string }[];

    onMount(() => {
        isLoading = false;
        themeStore.init();
        themeStore.setTheme("abyss");
        update = set_update(true);
        update.search = false;
        load_settings();
    });

    function startResize(target: "sidebar" | "preview") {
        resizingTarget = target;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
    }

    function resize(event: MouseEvent) {
        if (!resizingTarget) return;

        if (resizingTarget === "sidebar") {
            let newWidth = event.clientX;
            sidebarWidth = Math.max(10, newWidth);
        } else if (resizingTarget === "preview") {
            let docWidth = document.body.clientWidth;
            let newWidth = docWidth - event.clientX;
            previewWidth = Math.max(10, newWidth);
        }
    }

    function stopResize() {
        resizingTarget = null;
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
    }
</script>

{#if isLoading}
    <p>Loading...</p>
{:else}
    <div class="app-container">
        <ToolBar 
            bind:searchTerm
            bind:adress={path}
            bind:update
            bind:history
        />
        <div class="content-container">
            <!-- Sidebar -->
            <div class="sidebar" style="width: {sidebarWidth}px;">
                <Sidebar />
            </div>
            <!-- Sidebar Resizer -->
            <div class="resizer" on:mousedown={() => startResize("sidebar")}></div>

            <!-- MainView -->
            <div class="main-view"> 
                <MainView
                    bind:path
                    bind:files
                    bind:update
                    bind:searchTerm
                    bind:history
                    bind:selectedFiles
                />
            </div>
            <!-- Preview Resizer -->
            <div class="resizer" on:mousedown={() => startResize("preview")}></div>

            <!-- Preview -->
            <div class="preview" style="width: {previewWidth}px;">
                <Preview />
            </div>
        </div>
        <Infobar bind:files />
    </div>
{/if}

<style>
    :root {
        width: 100%;
        height: 100%;
        background-color: var(--primary-color);
    }

    .app-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .content-container {
        flex: 1;
        display: flex;
        overflow: hidden;
    }

    .sidebar {
        background-color: var(--secondary-color);
    }

    .preview {
        background-color: var(--secondary-color);
    }

    .main-view {
        flex: 1;
        overflow: hidden;
        user-select: none;
    }

    .resizer {
        width: 5px;
        height: 100%;
        background-color: var(--border-color);
        cursor: ew-resize;
    }

    .resizer:hover {
        background-color: var(--selected-color);
    }
</style>
