<script lang="ts">
    import {
        removefocus
    } from "$lib/utils/index"

    export let searchTerm: string;
    export let placeholder: string = "Search";
    export let width: number = 240;
</script>

<div class="search-box">
    <div class="search-input-wrapper">
        <input
            type="text"
            placeholder={placeholder}
            bind:value={searchTerm}
            on:change={() => removefocus(document.activeElement)}
            on:keyup={(e) => {
                if (e.key === 'Enter') {
                    console.log("Enter key pressed. Current search term:", searchTerm);
                    removefocus(document.activeElement);
                }
            }}
            class="search-input"
        />
        {#if searchTerm}
            <button class="btn-clear" on:click={() => (searchTerm = "")}>
                Clear
            </button>
        {/if}
    </div>
</div>

<style>
.search-box {
    display: flex;
    flex: 1;
    padding-right: 10px;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
}

.search-input {
    width: 100%;
    height: 28px;
    padding: 0 12px;
    padding-right: 70px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 12px;
    background-color: var(--primary-color);
    color: var(--text-color);
    transition: all 0.2s ease;
}

.btn-clear {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    padding: 4px 8px;
    font-size: 11px;
    color: #757575;
    background: var(--primary-color);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-clear:hover {
    color: var(--text-color);
}

.search-input::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    margin-right: 4px;
    background: var(--secondary-color);
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E")
        no-repeat 50% 50%;
    cursor: pointer;
}

.search-input::-webkit-search-cancel-button:hover {
    background: var(--text);
}

.search-input:hover {
    background-color: var(--hover-color);
    border-color: var(--selected-color);
    transition: 0.5s ease;
}

.search-input:focus {
    outline: none;
    border-color: var(--selected-color);
    box-shadow: 0 0 0 2px color-mix(in srgb, rgb(106, 106, 240) 50%, transparent);
}
</style>
