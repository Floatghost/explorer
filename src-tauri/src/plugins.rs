#![allow(dead_code)]
use serde_json::Value;
use std::fs;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct BoundFunctions {
    preview: Vec<Preview>,
    main_content: Vec<MainContent>,
    file_tree: Vec<FileTree>,
    search: Vec<Search>,
    other: Vec<Other>,
}


impl BoundFunctions {
    pub fn new() -> Self {
        BoundFunctions {
            preview: Vec::new(),
            main_content: Vec::new(),
            file_tree: Vec::new(),
            search: Vec::new(),
            other: Vec::new(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Preview {
    name: String,
    filetype: String,
    plugin_files: Vec<String>,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct MainContent {
    name: String,
    plugin_files: Vec<String>,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct FileTree {
    name: String,
    plugin_files: Vec<String>,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct Search {
    name: String,
    plugin_files: Vec<String>,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct Other {
    name: String,
    plugin_files: Vec<String>,
}

#[tauri::command(rename_all="snake_case")]
pub fn get_plugin_data(filepath: String) -> BoundFunctions {
    println!("running get_plugin_data: {}", filepath);
    
    //../explorer/static/plugins/test/config.json
    let json_data = match fs::read_to_string(filepath) {
        Ok(n) => n,
        Err(e) => {let mut t = BoundFunctions::new(); t.other.push(Other{name: e.to_string(), plugin_files: vec!["".to_string()]}); return t;},
    };
    
    let mut out = BoundFunctions::new();

    let value: Value = serde_json::from_str(&json_data).unwrap();
    
    // Access the plugin name dynamically
    if let Some(plugin_name) = value.as_object().and_then(|obj| obj.keys().next()) {

        // Access the "function" field
        if let Some(function) = value.get(plugin_name).and_then(|v| v.get("function")) {

            // Access the "preview" field
            if let Some(preview) = function.get("preview") {

                // Iterate over keys and values in "preview"
                if let Some(preview_obj) = preview.as_object() {
                    for (key, value) in preview_obj {
                
                        let plugin_files = convert_value_to_str_vec(value);
                
                        // Push the `Preview` struct into `out.preview`
                        out.preview.push(Preview {
                            name: plugin_name.clone(),
                            filetype: key.clone(),
                            plugin_files,
                        });
                    }
                }
            }

            // Access the "other" field
            if let Some(other) = function.get("other") {

                // Iterate over keys and values in "preview"
                if let Some(other_obj) = other.as_object() {
                    for (key, value) in other_obj {
                
                        let plugin_files = convert_value_to_str_vec(value);
                
                        // Push the `Preview` struct into `out.preview`
                        out.other.push(Other {
                            name: plugin_name.clone(),
                            plugin_files,
                        });
                    }
                }
            }
        }
    }
    
    println!("preview: {:?}", &out.preview);
    println!("preview: {:?}", &out.other);

    out
}

fn convert_value_to_str_vec(input: &Value) -> Vec<String> {
    input
        .as_array() // Get the array
        .unwrap()   // Unwrap the array (assuming it's always an array)
        .iter()     // Iterate over the array elements
        .filter_map(|elem| elem.as_str().map(|s| s.to_string())) // Convert each element to String
        .collect() // Collect into Vec<String>
}
