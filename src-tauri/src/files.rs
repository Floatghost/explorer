use serde::{Serialize, Deserialize};
use std::fs;
use std::io::copy;
use std::os::windows::fs::MetadataExt; // Windows-specific extensions
use std::path::Path;

#[derive(Serialize, Deserialize)]
struct FileInfo {
    file_name: String,
    file_type: String,
    file_location: String,
    file_size: u64,
}

#[derive(Serialize, Deserialize)]
struct FileData {
    file_name: String,
    file_data: Vec<u8>,
}

#[derive(Serialize, Deserialize)]
struct DirInfo {
    dir_name: String,
    dir_sub_files: i32,
    dir_sub_dirs: i32,
}

#[derive(Serialize, Deserialize)]
struct DirData {
    files: Vec<FileInfo>,
    dirs: Vec<DirInfo>,
}

#[derive(Serialize)]
enum FileSystem {
    FileInfo(FileInfo),
    FileData(FileData),
    DirInfo(DirInfo),
    DirData(DirData),
}

#[tauri::command]
pub fn get_dir_info(dir_path: String) -> String {
    let dir = match fs::read_dir(Path::new(&dir_path)) {
        Ok(entries) => entries,
        Err(_) => return "ERROR: Unable to read directory.".to_string(),
    };

    // Count files and directories
    let mut file_count = 0;
    let mut dir_count = 0;

    for entry in dir {
        if let Ok(entry) = entry {
            let metadata = match entry.metadata() {
                Ok(meta) => meta,
                Err(_) => continue,
            };

            if metadata.is_dir() {
                dir_count += 1;
            } else if metadata.is_file() {
                file_count += 1;
            }
        }
    }

    // Create a FileSystem::DirInfo enum variant
    let out = FileSystem::DirInfo(DirInfo {
        dir_name: dir_path,
        dir_sub_files: file_count as i32,
        dir_sub_dirs: dir_count as i32,
    });

    // Serialize the data using the serialize_data function
    println!("{:?}", serialize_data(&out));
    serialize_data(&out)
}

fn serialize_data(data: &FileSystem) -> String {
    match serde_json::to_string(data) {
        Ok(json) => json,
        Err(_) => "Error serializing data".to_string(),
    }
}
