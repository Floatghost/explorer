// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const prerender = true;
export const ssr = false;

// Import your app initialization logic
import { initializeApp } from '../$lib/main';
import '../$lib/styles/main.css';

// Initialize global logic (e.g., app setup, i18n)
export const load = async () => {
    await initializeApp();
};
