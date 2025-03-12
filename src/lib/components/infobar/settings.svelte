<script lang="ts">
    import Icon from "@iconify/svelte";


</script>

<div class="settings-wrapper">
    <div style="display: flex;  flex-direction: row; gap:10px;">
        <button class="show_hiddenfiles">
            <Icon icon="mdi:file-hidden" />
        </button>
        <button class="show_fileendings">
            <Icon icon="mdi:dot" />
        </button>
    </div>
    Size
    <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
</div>

<style>
    .settings-wrapper {
        display: flex;
        flex: 1;
        background-color: var(--secondary-color);
        border: 1px solid var(--selected-color);
        border-radius: 5px;
        padding: 10px;
        flex-direction: column;
        align-items: center;
    }
    .show_hiddenfiles {
        border: 1px solid transparent;
        background-color: gray;
        border-radius: 5px;
        height: 50px;
        width: 80px;
    }
    .show_hiddenfiles:focus {
        background-color: var(--selected-color);
        border-color: var(--selected-color);
    }
    .show_fileendings {
        border: 1px solid transparent;
        background-color: gray;
        border-radius: 5px;
        height: 50px;
        width: 80px;
    }
    .show_fileendings:focus {
        background-color: var(--selected-color);
        border-color: var(--selected-color);
    }
</style>