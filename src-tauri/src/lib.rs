use chrono::NaiveDateTime;
use chrono::{DateTime, Utc};
use tauri_plugin_fs::FsExt;
use std::fs;
use std::os::windows::fs::MetadataExt; // Windows-specific extensions

#[tauri::command]
fn greet() -> String {
    println!("greet executed");
    return String::from("greet executed");
}

#[tauri::command]
fn request_file_data(filepath: String) -> Result<(), String> {
    //let filepath = String::from("D:/sqlite3/30.jpg");
    
    // Call get_file_info and handle the result
    match get_file_info(filepath) {
        Ok(info) => {
            // Print details of ElementInfo
            println!("File Info:");
            println!("Name: {}", info.name);
            println!("Size: {} bytes", info.size);
            println!("Creation Date: {}", info.creation_date);
            println!("Content Files: {}", info.content_files);
            println!("Content Folders: {}", info.content_folders);
            println!("Attributes: Write Protected = {}, Hidden = {}",
                info.attributes[0], info.attributes[1]);
        }
        Err(err) => {
            // Print the error if any
            eprintln!("Failed to retrieve file info: {}", err);
        }
    }

    Ok(())
}


struct ElementInfo {
    name: String,
    size: i64,
    content_files: i32,
    content_folders: i32,
    creation_date: NaiveDateTime,
    attributes: Vec<bool>, // First: write protection; Second: hidden
}

fn get_file_info(filename: String) -> Result<ElementInfo, String> {
    let metadata = fs::metadata(&filename).map_err(|e| e.to_string())?;

    let creation_date = metadata.created()
        .map_err(|e| e.to_string())
        .and_then(|time| {
            let duration = time.duration_since(std::time::UNIX_EPOCH)
                .map_err(|e| e.to_string())?;
            Ok(DateTime::from_timestamp(duration.as_secs() as i64, 0))
        })?;

    let is_hidden = filename.starts_with(".");
    let is_write_protected = metadata.permissions().readonly();

    Ok(ElementInfo {
        name: filename,
        size: metadata.len() as i64,
        content_files: 0, // To be implemented
        content_folders: 0, // To be implemented
        creation_date: Utc::now().naive_utc(), //need to implement creation_date
        attributes: vec![is_write_protected, is_hidden],
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let scope = app.fs_scope();
            scope.allow_directory(r"D://", false)?;
            dbg!(scope.is_allowed(r"D://"));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![request_file_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
