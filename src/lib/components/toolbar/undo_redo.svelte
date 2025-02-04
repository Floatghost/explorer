<script lang="ts">
    import Icon from "@iconify/svelte";

    export let previos: Record<string, boolean> = {
        available: false,
        click: false,
    };
    export let next: Record<string, boolean> = {
        available: false,
        click: false,
    };

    function undo() {
        if (previos["available"] == true) {
            previos["click"] = true;
        }
    }
    function redo() {
        if (next["available"] == true) {
            next["click"] = true;
        }
    }

</script>

<div class="undoredo-box">
    <div class="undoredo-wrapper">
        <button class="btn-undo" on:click={undo} aria-label="undo">
            <Icon icon="material-symbols:undo" width="24" height="24"/>
        </button>
        <button class="btn-redo" on:click={redo} aria-label="redo">
            <Icon icon="material-symbols:redo" width="24" height="24"/>
        </button>
        
    </div>
</div>

<style>
.undoredo-box {
    flex: none;
    display: flex;
    direction: row;
    align-self: flex-start;
    padding-left: 10px;
}
.btn-undo {
    border: 1px solid var(--border-color);
    background-color: transparent;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    padding: 0px;
    color: var(--text-unfocused);
}
.btn-redo {
    border: 1px solid var(--border-color);
    background-color: transparent;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    padding: 0px;
    color: var(--text-unfocused);
}

.btn-undo:hover {
    background-color: var(--hover-color);
    border-color: var(--selected-color);
    color: var(--text-color);
    transition: 0.5s ease;
}
.btn-redo:hover {
    background-color: var(--hover-color);
    border-color: var(--selected-color);
    color: var(--text-color);
    transition: 0.5s ease;
}
</style>
