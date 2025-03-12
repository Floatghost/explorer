export function removefocus(html_obj: Element | null): null {
    if (html_obj instanceof HTMLElement) {
        html_obj.blur();
        console.log("removed focus");
    }
    return null;
}

import type { DirInfo, ElementInfo, History, History_entry, Update } from "$lib/types";
import { invoke } from "@tauri-apps/api/core";

export async function get_files(path: string): Promise<DirInfo> {
    try {
        // Await the result of the Tauri backend function
        const out: DirInfo = await invoke("get_dir_info", { path }) as DirInfo;
        console.log(await invoke("get_dir_info", { path }));
        return out; // Return the populated DirInfo object
    } catch (error) {
        console.error("Error fetching directory info:", error);
        console.error("function input: " + path);
        
        // Return an empty DirInfo object if an error occurs
        return {
            name: "",
            sub_dirs: 0,
            sub_files: 0,
            elements: [],
        };
    }
}

export function formatBytes(bytes: number, decimals: number = 2): string {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function delete_all_history_above(history: History, index: number): History {
    if (!history || !history.paths.length) {
        console.error("Error: Invalid history object.");
        return {
            paths: [{
                get_function: "filesystem",
                get_input: "C:\\",
                name_in_addressbar: "C:\\",
            }],
            index: 0
        };
    }

    let out: History = { paths: [], index: 0 };

    for (let i = 0; i <= index; i++) {
        out.paths.push(history.paths[i]);
    }

    out.index = out.paths.length - 1;
    return out;
}

export function push_history(
    history: History,
    function_name: string,
    function_input: string,
    name_in_addressbar: string
    ): History
    {
    
    history = delete_all_history_above(history, history.index);

    history.paths.push({ //History_entry
        get_function: function_name,
        get_input: function_input,
        name_in_addressbar: name_in_addressbar,
    });
    history.index = history.paths.length -1;

    return history;
}

export function push_followup_history(history: History, followup_name: ElementInfo): History {
    //todo still needs improvement for when clicking on dirs in the search
    if (history.paths[history.index].get_function != "filesystem") {
        return history;
    }

    if (followup_name.filetype != "dir") {
        return history;
    }

    let new_get_input = history.paths[history.index].get_input;
    if (!new_get_input.endsWith("\\")) {
        new_get_input += "\\";
    }
    new_get_input += followup_name.name;

    return push_history(history, "filesystem", new_get_input, new_get_input);
}

export async function search(query: string): Promise<DirInfo> {
    try {
        const out: DirInfo = await invoke("search", { query: query, engine: "everything", max_elements: 100 }) as DirInfo;
        console.log(out);
        return out;
    }
    catch (error) {
        console.error("Error fetching directory info:", error);
        console.error("function input: " + query);
        
        // Return an empty DirInfo object if an error occurs
        return {
            name: "error",
            sub_dirs: 0,
            sub_files: 0,
            elements: [],
        };
    }
}

export function set_update(input: boolean): Update {
    let out: Update = {
        get_files: input,
        search: input,
        mainview: input,
    };

    return out;
}
