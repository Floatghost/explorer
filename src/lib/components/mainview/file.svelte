<script lang="ts">
    import Icon from "@iconify/svelte"
    import "$lib/app.css"
    
    export let fileicontype: string;
    export let fileiconpath: string;
    export let clicked: number;
</script>

<div class="file-wrapper">
    <button class="file-btn" on:click={() => {clicked = 1}}>
        {#if fileicontype == "svg"}
            <Icon width=100% icon={fileiconpath}/>
        {/if}
    </button>
</div>

<style>
    .file-wrapper:focus-visible {
        outline: none;
    }
    .file-btn:focus-visible {
        outline: none;
    }
    .file-btn {
        border: 1px solid transparent;
        border-radius: 5px;
        width: var(--file-size-width);
        height: var(--file-size-height);
        background-color: transparent;
        color: var(--text-unfocused);
    }
    .file-btn:hover {
        border-color: var(--selected-color);
        color: var(--text-color);
        background-color: #272e4f;
    }
    .file-btn:focus {
        color: var(--text-color);
        background-color: #272e4f;
        box-shadow: 0 0 0 2px color-mix(in srgb, rgb(106, 106, 240) 50%, transparent);
    }
</style>