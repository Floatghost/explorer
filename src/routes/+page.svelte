<script lang="ts">
    import {
        ToolBar,
        MainView
    } from "$lib/components/index";
    import "$lib/app.css";
    import { onMount } from 'svelte';
    
    let isLoading: boolean = true;
    let searchTerm: string = "";
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
            <ToolBar bind:searchTerm />
            <div class="content-container">
                <MainView bind:files />
            </div>
        </div>
    {/if}
    
    <style>
        .app-container {
            width: 100%;
            height: 100%;
        }
        :root {
            width: 100%;
            height: 100%;
        }
    </style>
    