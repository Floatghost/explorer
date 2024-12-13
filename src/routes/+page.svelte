<script lang="ts">
    import Icon from '@iconify/svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { t } from 'svelte-i18n';
    //const invoke = window.__TAURI__.invoke;
    
    let address_input = document.getElementById("address_in");
    let search_input = document.getElementById("search_in");
    let info_bar = document.getElementById("infobar");

    //invoke("greet");
    document.addEventListener("load", function(event) {
        invoke("request_file_data", { filepath: "D:/sqlite3/30.jpg" });
        address_input = document.getElementById("address_in");
        search_input = document.getElementById("search_in");
        info_bar = document.getElementById("infobar");
    })

    document.addEventListener('contextmenu', function (event) 
    {
        invoke("request_file_data", { filepath: "D:/sqlite3/30.jpg" });
        event.preventDefault(); // Disable the context menu
    });

    document.addEventListener('click', function (event) 
    {
        info_bar = document.getElementById("infobar");
        if (info_bar)
        {
            if (document.activeElement === info_bar)
            {
                invoke("request_file_data", { filepath: "D:/sqlite3/30.jpg" });
            }
            info_bar.innerHTML = "test";
            console.timeLog("info_bar = test");
        }
        if (address_input)
        {
            address_input.ariaPlaceholder = "tsee";
            //address_input.innerHTML = "testest";
        }
    });

    address_input = document.getElementById("address_in");
    if (address_input)
    {
        address_input.addEventListener('keydown', function(event) {
            //event.preventDefault();
            //const keyboardEvent = event as KeyboardEvent;
            invoke("request_file_data", { filepath: "D:/sqlite3/30.jpg" });
            if (event.key === 'Enter') { // Check if the Enter key was pressed
            }
        });
    }
    else
    {
        console.error("no address_input");
    }

    //let name: String = "User";


</script>

<style>
    :global(body) {
        margin: 0;
        font-family: Arial, sans-serif;
        height: 100vh; /* Ensure the body takes up the full viewport height */
    }
    .container {
        display: flex;
        flex-direction: column;
        height: 100%; /* Ensure the container fills the entire height */
        width: 100%;
    }
    .navigation {
        flex: 0 0 35px;
        display: flex;
        flex-direction: row;
        background-color: #090b10;
        padding-left: 5px;
        padding-right: 5px;
        border-bottom: 1px solid #1e212d;
        align-items: center;
        gap: 10px;
        color: #b2ccd6;
    }
    .navigation button {
        background-color: #090b10;
        border: 1px solid #090b10;
        border-radius: 3px;
        color: #b2ccd6;
        font-size: 100%;
    }
    .navigation button:hover {
        background-color: #13151e;
        border: 1px solid #1e212d;
        border-radius: 3px;
    }
    .navigation .AddressAndSearch {
        flex: 1;
        flex-direction: row;
        display: flex;
        gap: 5px;
        width: 100%;
    }
    .address {
        background-color: #13151e;
        border-radius: 5px;
        height: 100%;
        width: 80%;
    }
    .search {
        background-color: #13151e;
        border-radius: 5px;
        height: 100%;
        width: 20%;
    }
    .AddressAndSearch input {
        width: 100%;
        background: none;
        border: 0;
        color: #b2ccd6;
    }
    .toolbar {
        flex: 0 0 30px; /* Fixed height for toolbar */
        display: flex;
        flex-direction: row;
        background-color: #090b10;
        padding: 5px;
        border-bottom: 1px solid #1e212d;
        align-items: center;
        gap: 10px;
        color: #b2ccd6;
    }
    .toolbar button {
        background-color: #090b10;
        border: 1px solid #090b10;
        border-radius: 3px;
        color: #b2ccd6;
        font-size: 100%;
    }
    .toolbar button:hover {
        background-color: #13151e;
        border: 1px solid #1e212d;
        border-radius: 3px;
    }
    .below_Toolbar {
        display: flex;
        flex-direction: row;
        flex: 1; /* Allow this section to grow and fill the remaining space */
        width: 100%;
    }
    .sidebar {
        width: 250px;
        background-color: #090b10;
        color: #b2ccd6;
        padding: 10px;
        border-right: 1px solid #1e212d;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }
    .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: #0f111a;
    }
    .content {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .file {
        width: 100px;
        height: 100px;
        color: #b2ccd6;
        border: 1px solid #1e212d;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    .file:hover {
        background-color: #13151e;
    }
    .info_bar {
        border-top: 1px solid #1e212d;
        background-color: #090b10;
        color: #b2ccd6;
        padding: 3px;
    }
    .preview {
        flex: 0 0 300px;
        flex-direction: column;
        display: flex;
        align-items: center;
        background-color: #0f111a;
        border-left: 1px solid #1e212d;
        font-size: 35px;
        gap: 10px;
        justify-content: center;
        color: #b2ccd6;
    }
</style>

<div class="container">
    <!-- navigation -->
    <div class="navigation">
        <button>
            <Icon icon="mdi:arrow-left-thick"/>
        </button>
        <button>
            <Icon icon="mdi:arrow-right-thick"/>
        </button>
        <button>
            <Icon icon="mdi:circle-arrows"/>
        </button>
        <button>
            <Icon icon="mdi:home"/>
        </button>
        <div class="AddressAndSearch">
            <div id="address_in" class="address">
                <input type="text" placeholder="address" spellcheck="false">
            </div>
            <div id="search_in" class="search">
                <input type="text" placeholder="search" spellcheck="false">
            </div>
        </div>
    </div>
    
    <!-- Toolbar -->
    <div class="toolbar">
        <button>
            <Icon icon="mdi:folder-plus-outline" />
        </button>
    </div>

    <div class="below_Toolbar">
        <!-- Sidebar -->
        <div class="sidebar">
            <h3>Folders</h3>
            <ul>
                <li>Documents</li>
                <li>Downloads</li>
                <li>Pictures</li>
            </ul>
        </div>
    
        <!-- Main content -->
        <div class="main">
            <!-- File/Folder Content -->
            <div class="content">
                <div class="file">
                    <Icon class="icon" icon="mdi:file-outline" width=60% height=60% />
                </div>
                <div class="file">
                    <Icon class="icon" icon="mdi:file-outline" width=60% height=60% />
                </div>
                <div class="file">
                    <Icon class="icon" icon="mdi:file-outline" width=60% height=60% />
                </div>
                <div class="file">
                    <Icon class="icon" icon="mdi:file-outline" width=60% height=60% />
                </div>
            </div>
        </div>
        <div class="preview">
            {#if $t('preview')}
                <p>{$t('preview')}</p>
            {/if}
            <center style="width: 100%; height: auto; color: orange;">
                <Icon class="icon" icon="mdi:error-outline" width=30% />
            </center>
        </div>
    </div>
    <div class="info_bar" id="infobar">
        fds
    </div>
</div>
