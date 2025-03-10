export function removefocus(html_obj: Element | null): null {
    if (html_obj instanceof HTMLElement) {
        html_obj.blur();
        console.log("removed focus");
    }
    return null;
}

import type { DirInfo, History, Update } from "$lib/types";
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
        return { paths: ["C:\\"], index: 0 };
    }

    let out: History = { paths: [], index: 0 };

    for (let i = 0; i <= index; i++) {
        out.paths.push(history.paths[i]);
    }

    out.index = out.paths.length - 1;
    return out;
}

export function push_history(history: History, new_path: string): History {
    history.paths.push(new_path);
    history.index = history.paths.length -1;

    return history;
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
    };

    return out;
}
