import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { readFile } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import { get_dir_data, type DirData, type FileInfo, type DirInfo } from '../$lib/get_data'

interface plugin {
    preview: Preview[],
    main_content: MainContent[],
    file_tree: FileTree[],
    search: Search[],
    other: Other[],
};

interface Preview {
    name: String,
    filetype: String,
    plugin_files: string[],
};

interface MainContent {
    name: String,
    plugin_files: string[],
};

interface FileTree {
    name: String,
    plugin_files: string[],
};

interface Search {
    name: String,
    plugin_files: string[],
};

interface Other {
    name: String,
    plugin_files: string[],
};

export async function load_plugins()/*: Promise<plugin[]>*/ {
    
    let temp = invoke("get_plugin_data", {filepath: "../explorer/static/plugins/test/config.json"});


    console.log("get_plugin_data: ", temp);

    //let out: plugin[] = plugin[];
    //return out;
}
