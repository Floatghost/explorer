<script lang="ts">
    import type { DirInfo, History } from "$lib/types";
    import Icon from "@iconify/svelte";
    import Settings from "./settings.svelte";

    export let files: DirInfo;
    export let history: History;
    export let settings_info: {
        show: boolean,
    };

    function flip_settings_show() {
        settings_info.show = !settings_info.show;
    }
</script>

<div class="infobar-wrapper">
    <div>
        dirs: {files.sub_dirs} | files: {files.sub_files}
    </div>
    <!-- <div>
        {history.paths[history.index].get_function}: {history.paths[history.index].get_input}
    </div> -->
    <div class="settings-container">
        {#if settings_info.show}
            <div class="settings-wrapper">
                <Settings />
            </div>
        {/if}
        <button class="settings-btn" on:click={flip_settings_show}>
            <Icon icon="mdi:settings" />
        </button>
    </div>
</div>

<style>
    .infobar-wrapper {
        height: 20px; /* Adjust height as needed */
        border-top: 1px solid var(--border-color);
        display: flex;
        color: var(--text-color);
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        background-color: var(--secondary-color); /* Ensure visibility */
        position: relative;
    }
    .infobar-wrapper:hover {
        border-color: var(--selected-color);
    }
    .settings-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }
    .settings-btn {
        background-color: var(--secondary-color);
        border: 0px solid transparent;
        color: var(--text-unfocused);
    }
    .settings-btn:hover {
        color: var(--text-color);
    }
    .settings-wrapper {
        position: absolute;
        bottom: 100%; /* Places it above the button */
        transform: translateX(-50%);
        background: var(--background-color);
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 10;
    }
</style>
