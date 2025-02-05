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
    import type { DirInfo } from "$lib/types";
    
    let isLoading: boolean = true;
    let searchTerm: string = "";
    let adress: string = "";
    let path: string = "C:\\";
    let files: DirInfo = {elements: [], name: "", sub_dirs: 0, sub_files: 0};
    
    onMount(() => {
        isLoading = false;
        console.log(path);
        themeStore.init();
    });
    themeStore.setTheme("dark");
</script>
    
    {#if isLoading}
        <p>Loading...</p>
    {:else}
        <div class="app-container">
            <ToolBar 
            bind:searchTerm
            bind:adress={path}
            />
            <div class="content-container">
                <Sidebar />
                <MainView bind:path bind:files />
                <Preview />
            </div>
            <Infobar bind:files />
        </div>
    {/if}
    
    <style>
        :root {
            width: 100%;
            height: 100%;
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
    </style>
    