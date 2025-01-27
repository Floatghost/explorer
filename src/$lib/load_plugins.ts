import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { readFile } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import { get_dir_data, type DirData, type FileInfo, type DirInfo } from '../$lib/get_data'

interface plugin {
    functions: String[],
    svelte: String[],
    css: String[],
};

export async function load_plugins(): Promise<plugin[]> {
    let out: plugin[] = [];

    try {
        // Fetch directory data for the main plugins directory
        const mainDirInfo = await get_dir_data("../static/plugins");

        // Ensure mainDirInfo is valid
        if (typeof mainDirInfo === "string") {
            console.error(`Error fetching directory data: ${mainDirInfo}`);
            return out;
        }

        // Iterate over directories in the main plugins directory
        for (let dir of mainDirInfo.dirs) {
            try {
                // Fetch directory data for each plugin directory
                console.log(`get_dir_data(${dir.dir_name})`);
                const pluginDirInfo = await get_dir_data(dir.dir_name);

                // Ensure pluginDirInfo is valid
                if (typeof pluginDirInfo === "string") {
                    console.error(`Error fetching directory data for ${dir.dir_name}: ${pluginDirInfo}`);
                    continue;
                }

                for (let file of pluginDirInfo.files) {
                    let file_full_name = file.file_name + "." + file.file_type;
                    console.log(`plugin file: ${file_full_name}`);

                    if (file_full_name != "config.json") {
                        continue;
                    }
                }
                
                // Process plugin directory (e.g., read its structure, load its files)
                console.log(`Processing plugin directory: ${dir.dir_name}`);

                // Example: Add a plugin to the output (adapt this logic to your needs)
                out.push({
                    functions: [], // Fill based on the plugin's structure
                    svelte: [], // Fill based on the plugin's structure
                    css: [], // Fill based on the plugin's structure
                });
            } catch (err) {
                console.error(`Error processing plugin directory ${dir.dir_name}:`, err);
            }
        }
    } catch (err) {
        console.error("Failed to load plugins:", err);
    }

    return out;
}
