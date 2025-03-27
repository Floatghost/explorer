<script lang="ts">
    export let selectedFiles: { selected: boolean, path: string }[];
</script>

<div class="preview-wrapper">
    <div class="name">
        
    </div>
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
