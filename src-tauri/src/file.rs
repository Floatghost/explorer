use image::GenericImageView;
use serde::{Serialize, Deserialize};
use core::error;
use std::fs::{self, metadata, FileType};
//use std::os::windows::fs::MetadataExt; // Windows-specific extensions
use std::path::Path;

#[derive(Serialize, Deserialize)]
pub struct FileInfo {
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

#[derive(Serialize, Deserialize)]
enum FileSystem {
    FileInfo(FileInfo),
    FileData(FileData),
    DirInfo(DirInfo),
    DirData(DirData),
}

fn get_dir_info(dir_path: String) -> Result<DirInfo, ()> {
    let dir = match fs::read_dir(Path::new(&dir_path)) {
        Ok(entries) => entries,
        Err(_) => return Err(()),
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
    Ok(DirInfo{
        dir_name: dir_path,
        dir_sub_files: file_count as i32,
        dir_sub_dirs: dir_count as i32,
    })
}

fn get_file_info(file_path: &str) -> Result<FileInfo, ()> {
    // Get file metadata
    let file_metadata = fs::metadata(file_path).map_err(|_| ())?;

    let path = Path::new(file_path);

    // Get the file name
    let file_name = match path.file_name().and_then(|name| name.to_str()) {
        Some(name) => name,
        None => return Err(()),
    };

    // Split file name into base name and extension
    let (base_name, extension) = match path.file_stem().and_then(|stem| stem.to_str()) {
        Some(base) => (
            base.to_string(),
            path.extension()
                .and_then(|ext| ext.to_str())
                .unwrap_or("")
                .to_string(),
        ),
        None => return Err(()),
    };

    // Return FileInfo
    Ok(FileInfo {
        file_location: file_path.to_string(),
        file_name: base_name,
        file_type: extension,
        file_size: file_metadata.len(),
    })
}

fn get_dir_data(dir_path: &str) -> Result<DirData, ()> {
    let dir = match fs::read_dir(Path::new(dir_path)) {
        Ok(n) => n,
        Err(_) => return Err(()),
    };
    
    let mut files_vec = Vec::new();
    let mut dirs_vec = Vec::new();

    for entry in dir {
        let entry = match entry {Ok(n) => n, Err(_) => return Err(())};
        let metadata = match entry.metadata() {Ok(n) => n, Err(_) => return Err(())};
        let name = entry.file_name();
        let name_str = match name.to_str() {
            Some(s) => s.to_string(),
            None => continue, // Skip invalid UTF-8
        };

        let full_path: String = match Path::new(dir_path).join(&name_str).to_str() {
            Some(n) => n.to_string(),
            None => return Err(()),
        };

        if metadata.is_dir() {
            if let Ok(dir_info) = get_dir_info(full_path) {
                dirs_vec.push(dir_info);
            }
        } else if metadata.is_file() {
            if let Ok(file_info) = get_file_info(&full_path) {
                files_vec.push(file_info);
            }
        }
    }

    Ok(DirData { files: files_vec, dirs: dirs_vec })
}

fn serialize_data(data: &FileSystem) -> String {
    let out = match serde_json::to_string(data) {
        Ok(json) => json,
        Err(_) => "Error serializing data".to_string(),
    };

    //println!("serialize_data out: {out}");

    out
}


#[tauri::command(rename_all = "snake_case")]
pub fn get_dir_data_ser(dir_path: String) -> String {
    let out = match get_dir_data(&dir_path) {
        Ok(n) => FileSystem::DirData(n),
        Err(_) => return "failed to get dirdata".to_string(),
    };

    //println!("{}", serialize_data(&out));
    serialize_data(&out)
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_dir_info_ser(dir_path: String) -> String {
    let out = match get_dir_info(dir_path) {
        Ok(n) => FileSystem::DirInfo(n),
        Err(_) => return "failed to get dir info".to_string(),
    };

    //println!("{:?}", serialize_data(&out));
    serialize_data(&out)
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_file_content(path: String) -> String {

}