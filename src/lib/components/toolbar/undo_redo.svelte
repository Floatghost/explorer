<script lang="ts">

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

        </button>
        <button class="btn-redo" on:click={redo} aria-label="redo">

        </button>
        
    </div>
</div>

<style>
.btn-undo {
    border: 1px solid var(--border-color);
    background-color: transparent;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    padding: 0px;
}
.btn-redo {
    border: 1px solid var(--border-color);
    background-color: transparent;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    padding: 0px;
}

.btn-undo:hover {
    background-color: var(--hover-color);
}
.btn-redo:hover {
    background-color: var(--hover-color);
}
</style>
