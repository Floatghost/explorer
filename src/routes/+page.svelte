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
    import { themes } from "$lib/definitions";
    import type { DirInfo, History } from "$lib/types";
    
    let isLoading: boolean = true;
    let searchTerm: string = "";
    let history: History = {paths:["C:\\"], index: 0};
    let path: string = "C:\\";
    let files: DirInfo = {elements: [], name: "", sub_dirs: 0, sub_files: 0};
    let update: boolean = false;

    onMount(() => {
        isLoading = false;
        console.log(path);
        themeStore.init();
        update = true;
        themeStore.setTheme("abyss");
    });
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
                <Sidebar />
                <div class="resize1"></div>
                <MainView
                    bind:path
                    bind:files
                    bind:update
                    bind:searchTerm
                    bind:history
                />
                <div class="resize1"></div>
                <Preview />
            </div>
            <Infobar
                bind:files
            />
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
            flex: 1;
            flex-direction: column;
        }
        .content-container {
            flex: 1; /* Take up remaining space, but not all */
            display: flex;
            overflow: hidden; /* Prevent it from expanding beyond limits */
        }
        .resize1 {
            width: 3px;
            height: 100%;
            background-color: transparent;
            position: relative;
            left: -2px;
        }
        .resize1:hover {
            background-color: var(--selected-color);
            cursor: ew-resize;
        }
    </style>
    