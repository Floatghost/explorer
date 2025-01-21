<script lang="ts">
    import Icon from '@iconify/svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { get_dir_data, get_dir_info, type DirData } from '../$lib/get_data';

    let infoBarText = 'Loading...'; // Reactive variable for the info bar
    let fileCount: number = 0; // Reactive variable for the number of files and folders
    let dir_data: DirData = { files: [], dirs: [] }; // Initialize as empty

    let address: string = "C:/Users/Levin/Downloads";
    let search: string;

    // Function to fetch directory information
    async function loadDirInfo() {
        let dirInfo = await get_dir_info(address);
        let dirData = await get_dir_data(address);

        if (typeof dirInfo === 'object' && dirInfo.dir_sub_files !== undefined && dirInfo.dir_sub_dirs !== undefined) {
            fileCount = dirInfo.dir_sub_files + dirInfo.dir_sub_dirs;
            infoBarText = `Files: ${dirInfo.dir_sub_files}, Folders: ${dirInfo.dir_sub_dirs}, Total: ${fileCount}`;
        } else {
            infoBarText = 'Error loading directory information.';
        }

        if (typeof dirData === 'object') {
            dir_data = dirData;
        } else {
            console.error("Error loading directory data.");
            console.error("DirData:", dirData);
            console.error("DirInfo:", dirInfo);
            dir_data = { files: [], dirs: [] }; // Fallback to an empty state
        }
    }


    // Load directory info on component mount
    onMount(() => {
        loadDirInfo();
    });

    document.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Disable the context menu
    });

    //resizeing logic

    // Ensure strict type safety
    let isResizing = false;

    // Select elements and assert correct types
    const resizer = document.querySelector('.resizer') as HTMLElement | null;
    const sidebar = document.querySelector('.sidebar') as HTMLElement | null;
    const main = document.querySelector('.main') as HTMLElement | null;
    const preview = document.querySelector('.preview') as HTMLElement | null;

    // Add event listeners for resizing
    if (resizer && main && preview) {
        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            e.preventDefault(); // Prevent text selection
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const container = document.querySelector('.below_Toolbar') as HTMLElement | null;
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
            const newMainWidth = e.clientX - containerRect.left;

            // Ensure resizing stays within boundaries
            if (newMainWidth > 150 && newMainWidth < containerRect.width - 150) {
                main.style.width = `${newMainWidth}px`;
                preview.style.width = `${containerRect.width - newMainWidth - 5}px`; // Adjust for resizer width
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = 'default';
            }
        });
    }
</script>

<div class="container">
    <!-- navigation -->
    <div class="navigation">
        <button><Icon icon="mdi:arrow-left-thick"/></button>
        <button><Icon icon="mdi:arrow-right-thick"/></button>
        <button><Icon icon="mdi:circle-arrows"/></button>
        <button><Icon icon="mdi:home"/></button>
        <div class="AddressAndSearch">
            <div id="address_in" class="address">
                <input type="text" placeholder="address" spellcheck="false" bind:value={address} on:change={loadDirInfo}>
            </div>
            <div id="search_in" class="search">
                <input type="text" placeholder="search" spellcheck="false" bind:value={search}>
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
                {#if dir_data.dirs.length > 0}
                    {#each dir_data.dirs as dir}
                        <div class="item">
                            {dir.dir_name}
                        </div>
                    {/each}
                {:else}
                    <li>No folders found.</li>
                {/if}
            </ul>
        </div>
    
        <!-- Main content -->
        <div class="main">
            <!-- File/Folder Content -->
            <div class="content">
                {#if dir_data.files.length > 0}
                    {#each dir_data.files as file}
                        <div class="file">
                            <Icon class="icon" icon="mdi:file-outline" width="60%" height="60%" />
                            <p class="file-name">{file.file_name}</p>
                        </div>
                    {/each}
                {:else}
                    <p>No files found.</p>
                {/if}
            </div>
        </div>

        <!-- resizer -->

        <div class="resizer"></div>

        <!-- Preview -->

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
