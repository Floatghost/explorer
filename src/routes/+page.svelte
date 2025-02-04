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
    
    let isLoading: boolean = true;
    let searchTerm: string = "";
    let adress: string = "";
    let files: string[] = [];
    
    onMount(() => {
        files = [...files, ...Array(1000).fill("test")];
        isLoading = false;
        console.log(files);
    });
    </script>
    
    {#if isLoading}
        <p>Loading...</p>
    {:else}
        <div class="app-container">
            <ToolBar 
            bind:searchTerm
            bind:adress
            />
            <div class="content-container">
                <Sidebar />
                <MainView bind:files />
                <Preview />
            </div>
            <Infobar />
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
    