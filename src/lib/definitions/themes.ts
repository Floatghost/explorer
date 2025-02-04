import type { Theme } from "$lib/types"

export const themes: Record<string, Theme> = {
    dark: {
        name: "dark",
        label: "dark",
        colors: {
            primary: "#0f111a",
            secondary: "#090b10",
            border: "#1e212d",
            border_light: "#303446",
            hover: "#13151e",
            text: "#b2ccd6",
            text_unfocused: "#375757",
            selected: "#6a6af0",
        },
    },
    pink: {
        name: "pink",
        label: "pink",
        colors: {
            primary: "",
            secondary: "",
            border: "",
            border_light: "",
            hover: "",
            text: "",
            text_unfocused: "",
            selected: "",
        },
    },
    test: {
        name: "test",
        label: "test",
        colors: {
            primary: "",
            secondary: "",
            border: "",
            border_light: "",
            hover: "",
            text: "",
            text_unfocused: "",
            selected: "",
        },
    },
}