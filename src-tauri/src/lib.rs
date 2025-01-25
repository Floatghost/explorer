mod files;
mod search;
mod cache;
use files::{get_dir_info_ser, get_dir_data_ser};
use search::search;
use cache::cache_images;

use tauri_plugin_fs::FsExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let scope = app.fs_scope();
            scope.allow_directory(r"D://", true)?;
            //dbg!(scope.is_allowed(r"D://"));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_dir_info_ser, get_dir_data_ser, cache_images, search])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
