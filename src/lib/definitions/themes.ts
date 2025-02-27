import type { Theme } from "$lib/types"

export const themes: Record<string, Theme> = {
    dark: {
        name: "dark",
        label: "dark",
        colors: {
            primary_color: "#0f111a",
            secondary_color: "#090b10",
            border_color: "#1e212d",   // Renamed
            border_color_light: "#303446", // Renamed
            hover_color: "#13151e",
            text_color: "#b2ccd6",
            text_unfocused: "#375757",
            selected_color: "#6a6af0",
        },
    },
    abyss: {
        name: "abyss",
        label: "abyss",
        colors: {
            primary_color: "#000c18",
            secondary_color: "#051336",
            border_color: "#2b2b4a",
            border_color_light: "#575796",
            hover_color: "#10192c",
            text_color: "#FFFFFF",
            text_unfocused: "#748c8f",
            selected_color: "#770811",
        },
    },
    ayu_dark: {
        name: "ayu dark",
        label: "ayu dark",
        colors: {
            primary_color: "#0d1017",
            secondary_color: "#0d1017",
            border_color: "#1e232b",
            border_color_light: "#a5833f",
            hover_color: "#23262f",
            text_color: "#bfbdb6",
            text_unfocused: "#748c8f",
            selected_color: "#1c3b5d",
        },
    },
    synthwave: {
        name: "synthwave",
        label: "synthwave",
        colors: {
            primary_color: "#262335",
            secondary_color: "#171520",
            border_color: "#4d476c",
            border_color_light: "#880088",
            hover_color: "#39334c",
            text_color: "#ff7edb",
            text_unfocused: "#653257",
            selected_color: "#423f4f",
        },
    },
    test: {
        name: "test",
        label: "test",
        colors: {
            primary_color: "",
            secondary_color: "",
            border_color: "",
            border_color_light: "",
            hover_color: "",
            text_color: "",
            text_unfocused: "",
            selected_color: "",
        },
    },
}
