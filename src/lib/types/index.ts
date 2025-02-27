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
    filetype: string,
    name: string,
    size: number,
    icon: string,
}

export interface History {
    paths: string[],
    index: number,
}
