<script lang="ts">
    import type { DirInfo } from "$lib/types"

    export let files: DirInfo;
</script>

<div class="infobar-wrapper">
    dirs: {files.sub_dirs} | files: {files.sub_files}
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
    }
    .infobar-wrapper:hover {
        border-color: var(--border-color-light);
    }
</style>
