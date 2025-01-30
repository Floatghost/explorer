import { loadTranslations } from './i18n/i18n';

// Export any reusable utilities or configurations
export const appConfig = {
    appName: 'Tauri + SvelteKit',
    version: '1.0.0',
};

export async function initializeApp(): Promise<void> {
    await loadTranslations();
    console.log(`${appConfig.appName} initialized!`);
}

export async function loadTheme(themeUrl: string): Promise<void> {
    try {
        const response = await fetch(themeUrl);
        if (!response.ok) {
            throw new Error(`Failed to load theme from ${themeUrl}`);
        }
        const theme = await response.json();

        // Apply theme to CSS variables
        Object.entries(theme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--${key}`, value as string);
        });

        console.log('Theme applied successfully:', theme);
    } catch (error) {
        console.error('Error loading theme:', error);
    }
}
