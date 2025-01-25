#[tauri::command(rename_all = "snake_case")]
                                                    //tauri::ipc::Response
pub fn cache_images(image_paths: Vec<String>) -> Result<String, String> {
    Ok("not implementet yet".to_string())
}
