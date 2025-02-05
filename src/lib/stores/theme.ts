import type { Theme } from "$lib/types";
import { themes } from "$lib/definitions/themes"
import { writable } from "svelte/store";

function createThemeStore() {
    // Default theme
    const defaultTheme = themes.dark;
    
    // Initialize with default theme
    const { subscribe, set } = writable<Theme>(defaultTheme);
    
    // Initialize theme on client-side only
    if (typeof window !== "undefined") {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme && themes[storedTheme]) {
            set(themes[storedTheme]);
        }
    }
    
    return {
        subscribe,
        setTheme: (themeName: string) => {
            const theme = themes[themeName];
            if (theme) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("theme", themeName);
                    // Add this line to set the data-theme attribute
                    document.documentElement.setAttribute("data-theme", themeName);
                }
                set(theme);
                applyTheme(theme);
            }
        },
        init: () => {
            const storedTheme =
            typeof window !== "undefined" ? localStorage.getItem("theme") : null;
            const theme = (storedTheme && themes[storedTheme]) || defaultTheme;
            console.log("theme: ", theme);
            if (typeof window !== "undefined") {
          //    Add this line to set the data-theme attribute on init
                document.documentElement.setAttribute(
                    "data-theme",
                    storedTheme || "dark",
                );
            }
            applyTheme(theme);
        },
    };
}

function applyTheme(theme: Theme) {
    if (typeof window !== "undefined") {
        const root = document.documentElement;
        console.log("Applying theme:", theme); // Debugging line
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${key.replace("_", "-")}`, value);
        });
    }
}

export const themeStore = createThemeStore();
