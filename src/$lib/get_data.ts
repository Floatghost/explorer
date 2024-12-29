import { invoke } from '@tauri-apps/api/core';

export async function get_dir_info(path: string): Promise<{ dir_name: string; dir_sub_files: number; dir_sub_dirs: number } | string> {
    try {
        const jsonout = await invoke<string>('get_dir_info', { dirPath: path });
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
