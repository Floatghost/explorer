import { invoke } from '@tauri-apps/api/core';

export async function get_dir_info(path: string): Promise<{ dir_name: string; dir_sub_files: number; dir_sub_dirs: number } | string> {
    try {
        const jsonout = await invoke<string>('get_dir_info_ser', { dir_path: path });
        const parsed = JSON.parse(jsonout);

        // Ensure the expected structure exists
        if (parsed.DirInfo && typeof parsed.DirInfo === 'object') {
            return parsed.DirInfo;
        }

        console.error(`Unexpected response structure: ${jsonout}`);
        return "ERROR";
    } catch (error) {
        console.error(`Error invoking Tauri command: ${error}`);
        return "ERROR";
    }
}

export interface FileInfo
{
    file_name: string;
    file_type: string;
    file_location: string;
    file_size: number;
}

export interface DirInfo
{
    dir_name: string;
    dir_sub_files: number;
    dir_sub_dirs: number;
}

export interface DirData
{
    files: FileInfo[];
    dirs: DirInfo[];
}

export async function get_dir_data(path: string): Promise<DirData | string> {
    try {
        // Invoke the Tauri command to get serialized directory data
        const jsonout = await invoke<string>("get_dir_data_ser", { dir_path: path });
        
        // Parse the JSON response
        const parsed = JSON.parse(jsonout);

        // Extract nested DirData
        if (
            parsed &&
            parsed.DirData &&
            Array.isArray(parsed.DirData.files) &&
            Array.isArray(parsed.DirData.dirs) &&
            parsed.DirData.files.every((file: any) =>
                typeof file.file_name === "string" &&
                typeof file.file_type === "string" &&
                typeof file.file_location === "string" &&
                typeof file.file_size === "number"
            ) &&
            parsed.DirData.dirs.every((dir: any) =>
                typeof dir.dir_name === "string" &&
                typeof dir.dir_sub_files === "number" &&
                typeof dir.dir_sub_dirs === "number"
            )
        ) {
            const out: DirData = {
                files: parsed.DirData.files as FileInfo[],
                dirs: parsed.DirData.dirs as DirInfo[],
            };
            return out;
        }

        // If the structure is unexpected, log an error
        console.error(`Unexpected response structure: ${jsonout}`);
        return "ERROR";
    } catch (error) {
        console.error(`Error invoking Tauri command: ${error}`);
        return "ERROR";
    }
}
