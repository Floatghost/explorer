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