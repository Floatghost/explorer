export interface Theme {
    name: string;
    label: string;
    colors: {
        primary_color: string;
        secondary_color: string;
        border_color: string;
        border_color_light: string;
        hover_color: string;
        text_color: string;
        text_unfocused: string;
        selected_color: string;
    };
}


export interface DirInfo {
    name: string,
    sub_dirs: number,
    sub_files: number,
    elements: ElementInfo[],
}

export interface ElementInfo {
    path: string,
    filetype: string,
    name: string,
    size: number,
    icon: string,
}

export interface History {
    paths: History_entry[],
    index: number,
}

export interface History_entry {
    get_function: string, //for example: "search", "filesystem"
    get_input: string,  //for example: "this is an test search", "C:\Users\admin"
    name_in_addressbar: string, //for example: "Search", "C:\Users\admin"
}

export interface Update {
    get_files: boolean,
    search: boolean,
    mainview: boolean,
    sidebar: boolean,
}

export const Update_false: Update = {
    get_files: false,
    mainview: false,
    search: false,
    sidebar: false,
}

export interface Pinned {
    elements: ElementInfo[],
}

export const Pinned_empty: Pinned = {
    elements: [],
};
