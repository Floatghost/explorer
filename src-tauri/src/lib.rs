// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod files;
use files::read::get_dir_info;
use files::read::get_file_content;
mod search;
use search::search;

use tauri_plugin_fs::FsExt;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let scope = app.fs_scope();
            scope.allow_directory(r"D://", true)?;
            scope.allow_directory(r"C://", true)?;
            //dbg!(scope.is_allowed(r"D://"));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_dir_info, search, get_file_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
