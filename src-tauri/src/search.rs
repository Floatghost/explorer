use crate::files::FileInfo;

#[tauri::command(rename_all="snake_case")]
pub fn search(query: String, engine: String) -> Vec<String> {
    let out = match engine {
        _ if engine == "everything" => search_everything(query),
        _ if engine == "own" => search_own(query),
        _ => return vec!["engine not found".to_string()],
    };

    out
}

#[allow(dead_code)]
fn search_everything(query: String) -> Vec<String> {
    let out: Vec<String> = vec![query];

    out
}

#[allow(dead_code)]
fn search_own(query: String) -> Vec<String> {
    let out: Vec<String> = vec![query];

    out
}
