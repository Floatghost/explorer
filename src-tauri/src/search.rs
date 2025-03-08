use crate::files::read::DirInfo;
use rusqlite::{Connection, Result};

#[tauri::command(rename_all="snake_case")]
pub fn search(query: String, engine: String) -> DirInfo {
    let out = match engine {
        _ if engine == "everything" => search_everything(query),
        _ if engine == "own" => search_own(query),
        _ => {
            let mut temp = DirInfo::default();
            temp.name = "couldn't find engine".to_string();
            temp
        },
    };

    out
}

#[allow(dead_code)]
fn search_everything(query: String) -> DirInfo {
    let out: DirInfo = DirInfo::default();

    //using rusqlite

    out
}

#[allow(dead_code)]
fn search_own(query: String) -> DirInfo {
    let out: DirInfo = DirInfo::default();

    out
}
