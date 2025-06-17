<!-- 
Github @dukenmarga, July 2022
Context Menu is small menu that displayed when user right-click the mouse on browser.
Think of it as a way to show Refresh option on Microsoft Windows when right-click on desktop.
Known bug:
    - If the browser loads the content for the first time, showMenu set to false.
    Hence, we cannot get menu.h and menu.y dimension, since context menu has not been available at DOM.
    The first right click will not shown properly when right-click occurs around the edge (bottom part
    and right part) of the browser.

Inspired from: Context Menu https://svelte.dev/repl/3a33725c3adb4f57b46b597f9dade0c1?version=3.25.0
-->

<script lang="ts">
    export let contextmenu_info: {
        show: boolean,
        pos: {x: number, y: number},
    };
    export let settings_info: {
        show: boolean,
    };
    
    interface Position {
        x: number;
        y: number;
    }
    
    interface Dimensions {
        h: number;
        w?: number;
        y?: number;
    }
    
    interface MenuItem {
        name: string;
        onClick?: () => void;
        displayText?: string;
        class?: string;
    }

    // pos is cursor position when right click occur
    let pos: Position = { x: 0, y: 0 };
    // menu is dimension (height and width) of context menu
    let menu: Dimensions = { h: 0, y: 0 };
    // browser/window dimension (height and width)
    let browser: Dimensions & { w?: number } = { h: 0, y: 0 };
    // to display some text
    let content: HTMLElement;
    
    function rightClickContextMenu(e: MouseEvent): void {
        contextmenu_info.show = true;
        browser = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        if (!browser.w || !menu.w) {
            return;
        }
        pos = {
            x: e.clientX,
            y: e.clientY
        };
        // If bottom part of context menu will be displayed
        // after right-click, then change the position of the
        // context menu. This position is controlled by `top` and `left`
        // at inline style. 
        // Instead of context menu is displayed from top left of cursor position
        // when right-click occur, it will be displayed from bottom left.
        if (browser.h - pos.y < menu.h)
            pos.y = pos.y - menu.h;
        if (browser.w - pos.x < menu.w)
            pos.x = pos.x - (menu.w || 0);
    }
    
    function onPageClick(e: MouseEvent): void {
        // To make context menu disappear when
        // mouse is clicked outside context menu
        contextmenu_info.show = false;
    }
    
    function getContextMenuDimension(node: HTMLElement): void {
        // This function will get context menu dimension
        // when navigation is shown => showMenu = true
        let height = node.offsetHeight;
        let width = node.offsetWidth;
        menu = {
            h: height,
            w: width
        };
    }
    
    function addItem(): void {
        content.textContent = "Add and item...";
        console.log(content.textContent);
    }
    
    function open_with(): void {
        content.textContent = "Printed...";
        console.log(content.textContent);
    }
    
    function open(): void {
        content.textContent = "Zooom...";
        console.log(content.textContent);
    }
    
    function remove(): void {
        content.textContent = "Removed...";
        console.log(content.textContent);
    }
    
    function setting(): void {
        content.textContent = "Settings...";
        settings_info.show = !settings_info.show;
    }
    
    // pin folder to top in file tree
    function pin(): void {
        //TODO
    }

    let menuItems: MenuItem[] = [
        {
            'name': 'New',
            'onClick': addItem,
            'displayText': "New",
            'class': 'fa-solid fa-plus'
        },
        {
            'name': 'Open',
            'onClick': open,
            'displayText': "Open",
            'class': 'fa-solid fa-magnifying-glass'
        },
        {
            'name': 'Open with',
            'onClick': open_with,
            'displayText': "Open with",
            'class': 'fa-solid fa-print'
        },
        {
            "name": "Pin",
            "onClick": pin,
            "displayText": "Pin",
            "class": "fa-solid fa-print"
        },
        {
            'name': 'hr',
        },
        {
            'name': 'settings',
            'onClick': setting,
            'displayText': "Settings",
            'class': 'fa-solid fa-gear'
        },
        {
            'name': 'hr',
        },
        {
            'name': 'Delete',
            'onClick': remove,
            'displayText': "Delete",
            'class': 'fa-solid fa-trash-can'
        },
    ];
</script>

<style>
    * {
        padding: 0;
        margin: 0;
    }
    .navbar{
        display: inline-flex;
        border: 1px var(--border-color) solid;
        width: 170px;
        background-color: var(--secondary-color);
        border-radius: 10px;
        overflow: hidden;
        flex-direction: column;
    }
    .navbar ul{
        margin: 6px;
    }
    ul li{
        display: block;
        list-style-type: none;
        width: 1fr;
    }
    ul li button{
        font-size: 1rem;
        color: var(--text-unfocused);
        width: 100%;
        height: 30px;
        text-align: left;
        border: 0px;
        background-color: var(--primary-color);
    }
    ul li button:hover{
        color: var(--text-color);
        text-align: left;
        border-radius: 5px;
        background-color: var(--selected-color);
    }
    ul li button i{
        padding: 0px 15px 0px 10px;
    }
    ul li button i.fa-square{
        color: #fff;
    }
    ul li button:hover > i.fa-square{
        color: #eee;
    }
    ul li button:hover > i.warning{
        color: crimson;
    }
    :global(ul li button.info:hover){
        color: navy;
    }
    hr{
        border: none;
        border-bottom: 1px solid var(--border-color-light);
        margin: 5px 0px;
    }
</style>

<div class="content" bind:this={content}>Right click somewhere!</div>

{#if contextmenu_info.show}
<nav use:getContextMenuDimension style="position: absolute; top:{pos.y}px; left:{pos.x}px; z-index: 9999;">
    <div class="navbar" id="navbar">
        <ul>
            {#each menuItems as item}
                {#if item.name == "hr"}
                    <hr>
                {:else}
                    <li><button on:click={item.onClick}><i class={item.class}></i>{item.displayText}</button></li>
                {/if}
            {/each}
        </ul>
    </div>
</nav>
{/if}

<svelte:window on:contextmenu|preventDefault={rightClickContextMenu} 
on:click={onPageClick} />