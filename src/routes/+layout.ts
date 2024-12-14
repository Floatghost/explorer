// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const prerender = true;
export const ssr = false;

// Import your app initialization logic
import { initializeApp, loadTheme } from '../$lib/main';
import '../$lib/styles/main.css';
import { setLanguage } from "../$lib/i18n/i18n";

// Initialize global logic (e.g., app setup, i18n)
export const load = async () => {
    await initializeApp();

    setLanguage("en");

    // Load a default theme (or let the user specify one)
    const defaultThemeUrl = '/themes/dark-theme.json'; // Adjust path as needed
    loadTheme(defaultThemeUrl);
};
