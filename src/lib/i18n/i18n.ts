import { init, register, getLocaleFromNavigator, waitLocale, locale } from 'svelte-i18n';

// Register translations
register('en', () => import('./en.json'));
register('es', () => import('./es.json'));
register('de', () => import('./de.json'));

// Initialize i18n
export async function loadTranslations() {
    init({
        fallbackLocale: 'en',
        initialLocale: getLocaleFromNavigator(),
    });

    // Wait for the locale to load
    await waitLocale();
}

export async function setLanguage(lang: string) {
    locale.set(lang);
}
