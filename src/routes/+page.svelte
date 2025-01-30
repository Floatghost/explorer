<script lang="ts">
    import Icon from '@iconify/svelte';
    import { invoke, convertFileSrc } from '@tauri-apps/api/core';
    import { readFile } from '@tauri-apps/plugin-fs';
    import * as path from '@tauri-apps/api/path';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { get_dir_data, get_dir_info, type DirData } from '../$lib/get_data';
    import { load_plugins } from '../$lib/load_plugins';
    import {onDrag} from '../$lib/drag_me'
    import { getCurrentWindow } from '@tauri-apps/api/window';

    let infoBarText = 'Loading...'; // Reactive variable for the info bar
    let fileCount: number = 0; // Reactive variable for the number of files and folders
    let dir_data: DirData = { files: [], dirs: [] }; // Initialize as empty

    let address: string = "C:\\";
    let search: string;

    let selected_elements = [];

    //
    //settings
    //
    let show_types: boolean = true;
    
    const home = path.homeDir();

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

    function change_dir(dir_name: string): void  {
        address = dir_name;
        loadDirInfo();

        console.log("changed dir to: ", address);
    }

    //async function setupWindow() {
    //    const appWindow = await getCurrentWindow();
    //    appWindow.show();
    //}

    // Load directory info on component mount
    onMount(() => {
        loadDirInfo();
        load_plugins();
        //setupWindow();
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
    // Define a mapping of file extensions to icons/images
    const fileIcons: Record<string, string> = {
        pdf: "mdi:file-pdf",
        docx: "mdi:file-word",
        doc: "mdi:file-word",
        xlsx: "mdi:file-excel",
        png: "mdi:file-image",
        jpg: "mdi:file-image",
        jpeg: "mdi:file-image",
        txt: "mdi:file-document",
        mp4: "mdi:file-video",
        mp3: "mdi:file-music",
        folder: "C:\\Users\\sus.levin.liechti\\code\\explorer\\static\\folder-svgrepo-com.svg",
        default: "mdi:file-outline" // Fallback icon
    };

    const file_dyn_icons: string[] = [
        "png", "jpeg", "jpg", "webp", "gif"
    ]

    function getFileIcon(ext: string): string {
        console.log(
            "choose: ",
            ext ? fileIcons[ext] || fileIcons.default : fileIcons.default,
            " for: ",
            ext
        );
        return ext ? fileIcons[ext] || fileIcons.default : fileIcons.default; // Return corresponding icon or fallback
    };

    function formatBytes(bytes: number, decimals: number = 2): string {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    async function convertToFileURL(filePath: string, protocol: string = 'asset'): Promise<string> {
        // Ensure the file path is valid and safe for the browser
        //const formattedPath = await path.resolve(filePath); // Normalize the path
        //return `file://${formattedPath.replace(/\\/g, '/')}`; // Convert to file:// and replace backslashes with forward slashes
        try {
            // Convert the file path to a WebView-compatible URL
            return convertFileSrc(filePath, protocol);
        } catch (error) {
            console.error('Error converting file path to URL:', error);
            throw new Error(`Failed to convert file path: ${filePath}`);
        }
    }

    function strip_full_path(full_path: string): string {
        return full_path.replace(/\/$/, "").split(/[/\\]/).pop() || "";
    }

    let resizeWidth: number = 300;
    let width: number = 300;
    let debugDelta;


    function handleDrag(event: Event) {
        const customEvent = event as CustomEvent<number>;
        resizeWidth = width + customEvent.detail;
        debugDelta = customEvent.detail;
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
        </button>
        <button>
            <Icon icon="mdi:settings" />
        </button>
    </div>

    <div class="below_Toolbar">
        <!-- Sidebar -->
        <div class="sidebar" style="width: {resizeWidth}px;">
            <h3>Folders</h3>
            <ul>
                {#if dir_data.dirs.length > 0}
                    {#each dir_data.dirs as dir}
                        <button class="item" on:click={() => change_dir(dir.dir_name)}>
                            {strip_full_path(dir.dir_name)}
                        </button>
                    {/each}
                {:else}
                    <li>No folders found.</li>
                {/if}
            </ul>
        </div>

        <div
            role="separator"
            aria-orientation="vertical"
            style="background-color: var(--primary-color); 
                width:4px;
                cursor: w-resize;"
            use:onDrag={{ orientation: 'vertical' }}
            on:drag={handleDrag}
            on:dragEnd={((() => (width = resizeWidth)) as unknown as (e: Event) => void)}
        ></div>
    
        <!-- Main content -->
        <div class="main">
            <!-- File/Folder Content -->
            <div class="content">
                {#if dir_data.files.length > 0}
                    {#each dir_data.dirs as dir}
                        <button class="file" on:click={() => change_dir(dir.dir_name)}>
                            <!-- Display dynamic images -->
                                <!-- Display icons for non-image files -->
                            {#await convertToFileURL(getFileIcon("folder")) then fileUrl}
                            <svg width="80%" height="80%" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)">

                                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.288"/>
                                
                                <g id="SVGRepo_iconCarrier"> <path d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H9.67452C10.1637 5 10.4083 5 10.6385 5.05526C10.8425 5.10425 11.0376 5.18506 11.2166 5.29472C11.4184 5.4184 11.5914 5.59135 11.9373 5.93726L12.0627 6.06274C12.4086 6.40865 12.5816 6.5816 12.7834 6.70528C12.9624 6.81494 13.1575 6.89575 13.3615 6.94474C13.5917 7 13.8363 7 14.3255 7H17.8C18.9201 7 19.4802 7 19.908 7.21799C20.2843 7.40973 20.5903 7.71569 20.782 8.09202C21 8.51984 21 9.0799 21 10.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z" stroke="#000000" stroke-width="0.72" stroke-linecap="round" stroke-linejoin="round"/> </g>
                                
                                </svg>
                            {:catch error}
                                <p>Error loading image</p>
                                {console.error("fileurl error: ", error)}
                            {/await}

                            <p class="file-name">{strip_full_path(dir.dir_name)}</p>
                            <span class="tooltip">sub_folder: {dir.dir_sub_dirs}
                                                    sub_files: {dir.dir_sub_files}
                            </span>
                        </button>
                    {/each}
                
                    {#each dir_data.files as file}
                        <button class="file">
                            <!-- Display dynamic images -->
                            {#if file_dyn_icons.includes(file.file_type)}
                                {#await convertToFileURL(file.file_location) then fileUrl}
                                    <img alt="" src={fileUrl} />
                                {:catch error}
                                    <p>Error loading image</p>
                                {/await}
                            {:else}
                                <!-- Display icons for non-image files -->
                                <Icon
                                    class="icon"
                                    icon={getFileIcon(file.file_type)}
                                    width="60%"
                                    height="60%"
                                />
                            {/if}
                            <p class="file-name">{file.file_name}{#if show_types}.{file.file_type}{/if}</p>
                            <span class="tooltip">  type: {file.file_type}
                                                    size: {formatBytes(file.file_size)}</span>
                        </button>
                    {/each}
                {:else}
                    <p style="color: var(--text-color);">No files found.</p>
                {/if}
            </div>
        </div>


        <!-- resizer
        https://stackoverflow.com/questions/77060803/resizable-sidebar-in-svelte-mouse-and-sidebar-width-dont-stay-in-sync

        Preview -->

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
