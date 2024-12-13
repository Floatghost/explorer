<script lang="ts">
    import Icon from '@iconify/svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { t } from 'svelte-i18n';
    //import '../$lib/styles/main.css';
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
            <Icon icon="mdi:settings" />
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
