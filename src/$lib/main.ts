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
