use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Serialize, Deserialize)]
pub struct Element {
    pub filetype: String,
    pub name: String,
    pub size: u64,
    pub icon: String,
}

impl Default for Element {
    fn default() -> Self {
        Element {
            filetype: "".to_string(),
            name: "".to_string(),
            size: 0,
            icon: "".to_string(),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct DirInfo {
    pub name: String,
    pub sub_dirs: i32,
    pub sub_files: i32,
    pub elements: Vec<Element>,
}

impl Default for DirInfo {
    fn default() -> Self {
        DirInfo {
            name: "".to_string(),
            sub_dirs: 0,
            sub_files: 0,
            elements: Vec::new(),
        }
    }
}

#[tauri::command]
pub fn get_dir_info(path: String) -> DirInfo {
    let dir = match fs::read_dir(&path) {
        Ok(n) => n,
        Err(_) => return DirInfo::default(),
    };

    let mut out = DirInfo::default();
    out.name = path.clone();
    let mut dirs = 0; // Make mutable
    let mut files = 0; // Make mutable

    for entry in dir {
        if let Ok(n) = entry {
            let metadata = match n.metadata() {
                Ok(meta) => meta,
                Err(_) => continue,
            };

            let name = match n.file_name().into_string() {
                Ok(n) => n,
                Err(_) => continue, // Skip if invalid UTF-8
            };

            if metadata.is_dir() {
                out.elements.push(Element {
                    filetype: "dir".to_string(),
                    name,
                    size: metadata.len(),
                    icon: "".to_string(),
                });
                dirs += 1;
            } else if metadata.is_file() {
                let ext = get_file_extension(n.path());
                out.elements.push(Element {
                    filetype: ext.unwrap_or_else(|| "unknown".to_string()), // Handle None case
                    name,
                    size: metadata.len(),
                    icon: "".to_string(),
                });
                files += 1;
            }
        }
    }

    out.sub_dirs = dirs;
    out.sub_files = files;

    out
}

fn get_file_extension(file_path: std::path::PathBuf) -> Option<String> {
    file_path
        .extension() // Get the extension as OsStr
        .and_then(|ext| ext.to_str()) // Convert OsStr to &str
        .map(|s| s.to_string()) // Convert &str to String
}
