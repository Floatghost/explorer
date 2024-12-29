<script lang="ts">
    import Icon from '@iconify/svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { get_dir_info } from '../$lib/get_data';

    let infoBarText = 'Loading...'; // Reactive variable for the info bar
    let fileCount: number = 0; // Reactive variable for the number of files and folders
    
    // Function to fetch directory information
    async function loadDirInfo() {
        const dirInfo = await get_dir_info("D:/sqlite3");
        if (typeof dirInfo === 'object' && dirInfo.dir_sub_files !== undefined && dirInfo.dir_sub_dirs !== undefined) {
            fileCount = dirInfo.dir_sub_files + dirInfo.dir_sub_dirs;
            infoBarText = `Files: ${dirInfo.dir_sub_files}, Folders: ${dirInfo.dir_sub_dirs}, Total: ${fileCount}`;
        } else {
            infoBarText = 'Error loading directory information.';
        }
    }

    // Load directory info on component mount
    onMount(() => {
        loadDirInfo();
    });

    document.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Disable the context menu

        get_dir_info("D:/sqlite3");
    });

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
                {#each Array(fileCount).fill(0) as _, index}
                    <div class="file">
                        <Icon class="icon" icon="mdi:file-outline" width="60%" height="60%" />
                        <p class="file-name">File {index + 1}</p>
                    </div>
                {/each}
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
        {infoBarText}
    </div>
</div>
