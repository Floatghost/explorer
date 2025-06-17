use crate::files::read::{DirInfo, Element};
use everything_sdk::*;
use rusqlite::{Connection, Result};

const FILE_ATTRIBUTE_DIRECTORY: u32 = 16;

#[allow(dead_code)]

#[tauri::command(rename_all = "snake_case")]
pub fn search(query: String, engine: String, max_elements: u32) -> DirInfo {
    let out = match engine {
        _ if engine == "everything" => search_everything(query, max_elements),
        _ if engine == "own" => search_own(query, max_elements),
        _ => {
            let mut temp = DirInfo::default();
            temp.name = "couldn't find engine".to_string();
            temp
        }
    };

    out
}

#[allow(dead_code)]
fn search_everything(query: String, max_elements: u32) -> DirInfo {
    let mut out: DirInfo = DirInfo::default();
    out.name = "Search".to_string();

    // example @ https://github.com/owtotwo/everything-sdk-rs/blob/main/examples/readme.rs

    let mut everything = global().try_lock().unwrap();

    // Check whether the Everything.exe in the background is running.
    match everything.is_db_loaded() {
        Ok(false) => panic!("The Everything database has not been fully loaded now."),
        Err(EverythingError::Ipc) => panic!("Everything is required to run in the background."),
        _ => {
            let mut searcher = everything.searcher();

            // Set the query parameters, chaining call is optional.

            //query input
            dbg!(&query);
            searcher.set_search(query);

            searcher
                .set_request_flags(
                    RequestFlags::EVERYTHING_REQUEST_FILE_NAME
                        | RequestFlags::EVERYTHING_REQUEST_PATH
                        | RequestFlags::EVERYTHING_REQUEST_SIZE
                        | RequestFlags::EVERYTHING_REQUEST_ATTRIBUTES
                        // file attributes can be found @ https://learn.microsoft.com/en-us/windows/win32/fileio/file-attribute-constants
                        | RequestFlags::EVERYTHING_REQUEST_RUN_COUNT,
                )
                .set_max(max_elements)
                .set_sort(SortType::EVERYTHING_SORT_DATE_RECENTLY_CHANGED_ASCENDING);

            // They have default value, check them in docs.
            assert_eq!(searcher.get_match_case(), false);

            //executing query
            let results = searcher.query();

            //check how many results are visible
            dbg!(results.num());
            //total matches
            dbg!(results.total());

            //see what flags are set
            dbg!(results.request_flags()).contains(RequestFlags::EVERYTHING_REQUEST_ATTRIBUTES);

            for item in results.iter() {
                let full_path = item.filepath().unwrap();
                let attributes = item.attributes().unwrap();
                println!(
                    "Item[{}]: {} ({} bytes) attributes: {:#x}",
                    item.index(),
                    full_path.display(),
                    // We have set the `RequestFlags::EVERYTHING_REQUEST_SIZE` for it before.
                    item.size().unwrap(),
                    attributes,
                );

                let is_directory = attributes & FILE_ATTRIBUTE_DIRECTORY != 0;

                if is_directory {
                    out.sub_dirs += 1;
                    out.elements.push(Element {
                        filetype: "txt".to_string(),
                        name: item.filename().unwrap().to_str().unwrap().to_string(),
                        size: item.size().unwrap(),
                        icon: "".to_string(),
                    });
                } else {
                    out.sub_files += 1;
                    out.elements.push(Element {
                        filetype: "dir".to_string(),
                        name: item.filename().unwrap().to_str().unwrap().to_string(),
                        size: item.size().unwrap(),
                        icon: "".to_string(),
                    });
                }
            }

            // Remember, because of global variables, there can only be one `everything`, `searcher`
            // and `results` at any time during the entire program lifetime.

            //use this to drop the objects if you want to use multiple times in this scope
            //drop(results);
        }
    }

    out
}

#[allow(dead_code)]
fn search_own(query: String, max_elements: u32) -> DirInfo {
    let mut out: DirInfo = DirInfo::default();

    //using rusqlite

    todo!();
}
