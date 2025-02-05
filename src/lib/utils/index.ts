export function removefocus(html_obj: Element | null): null {
    if (html_obj instanceof HTMLElement) {
        html_obj.blur();
        console.log("removed focus");
    }
    return null;
}

import type { DirInfo } from "$lib/types";
import { invoke } from "@tauri-apps/api/core";

export async function get_files(path: string): Promise<DirInfo> {
    try {
        // Await the result of the Tauri backend function
        const out: DirInfo = await invoke("get_dir_info", { path }) as DirInfo;
        console.log(await invoke("get_dir_info", { path }));
        return out; // Return the populated DirInfo object
    } catch (error) {
        console.error("Error fetching directory info:", error);
        
        // Return an empty DirInfo object if an error occurs
        return {
            name: "",
            sub_dirs: 0,
            sub_files: 0,
            elements: [],
        };
    }
}

