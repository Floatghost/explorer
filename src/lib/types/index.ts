export interface Theme {
    name: string;
    label: string;
    colors: {
        primary: string;
        secondary: string;
        border: string;
        border_light: string;
        hover: string;
        text: string;
        text_unfocused: string;
        selected: string;
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