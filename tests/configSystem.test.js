/**
 * Tests for YAML Configuration System
 */

import { ConfigLoader, configLoader } from '../src/utils/configLoader';
import { I18nManager, i18n } from '../src/utils/i18n';
import { setupConfigMocks, cleanupConfigMocks } from '../src/utils/testUtils';

describe('ConfigLoader', () => {
  beforeEach(() => {
    setupConfigMocks();
    configLoader.clearCache();
  });

  afterEach(() => {
    cleanupConfigMocks();
  });

  test('should load English translations', async () => {
    const translations = await configLoader.loadTranslations('en');
    
    expect(translations).toBeDefined();
    expect(translations.title).toBe('CORTEX – Real-time Anomaly Detection');
    expect(translations.dashboard.title).toBe('System Dashboard');
  });

  test('should load Norwegian translations', async () => {
    const translations = await configLoader.loadTranslations('no');
    
    expect(translations).toBeDefined();
    expect(translations.title).toBe('CORTEX – Sanntids avviksdeteksjon');
    expect(translations.dashboard.title).toBe('Systemdashboard');
  });

  test('should load app configuration', async () => {
    const appConfig = await configLoader.loadAppConfig();
    
    expect(appConfig).toBeDefined();
    expect(appConfig.app.name).toBe('CoreTex');
    expect(appConfig.ui.defaultLanguage).toBe('no');
    expect(appConfig.ui.supportedLanguages).toContain('en');
    expect(appConfig.ui.supportedLanguages).toContain('no');
  });

  test('should normalize paths correctly', () => {
    const loader = new ConfigLoader();
    const path1 = loader.normalizePath('config', 'i18n', 'en.yml');
    const path2 = loader.normalizePath('/config/', '/i18n/', '/en.yml');
    
    expect(path1).toBe('config/i18n/en.yml');
    expect(path2).toBe('/config/i18n/en.yml');
  });

  test('should handle file loading errors gracefully', async () => {
    const translations = await configLoader.loadTranslations('invalid');
    
    expect(translations).toEqual({});
  });

  test('should cache loaded configurations', async () => {
    // Load once
    const translations1 = await configLoader.loadTranslations('en');
    
    // Load again - should come from cache
    const translations2 = await configLoader.loadTranslations('en');
    
    expect(translations1).toBe(translations2);
  });

  test('should deep merge configurations', () => {
    const loader = new ConfigLoader();
    const target = {
      app: { name: 'Test', version: '1.0' },
      ui: { theme: 'dark' }
    };
    const source = {
      app: { version: '2.0', debug: true },
      api: { url: 'localhost' }
    };
    
    const result = loader.deepMerge(target, source);
    
    expect(result.app.name).toBe('Test');
    expect(result.app.version).toBe('2.0');
    expect(result.app.debug).toBe(true);
    expect(result.ui.theme).toBe('dark');
    expect(result.api.url).toBe('localhost');
  });
});

describe('I18nManager', () => {
  beforeEach(() => {
    setupConfigMocks();
    i18n.clearCache();
  });

  afterEach(() => {
    cleanupConfigMocks();
  });

  test('should initialize with default language', async () => {
    const success = await i18n.initialize('en');
    
    expect(success).toBe(true);
    expect(i18n.getCurrentLanguage()).toBe('en');
  });

  test('should translate simple keys', async () => {
    await i18n.initialize('en');
    
    const translation = i18n.t('title');
    expect(translation).toBe('CORTEX – Real-time Anomaly Detection');
  });

  test('should translate nested keys', async () => {
    await i18n.initialize('en');
    
    const translation = i18n.t('dashboard.title');
    expect(translation).toBe('System Dashboard');
  });

  test('should return default value for missing keys', async () => {
    await i18n.initialize('en');
    
    const translation = i18n.t('missing.key', 'Default Value');
    expect(translation).toBe('Default Value');
  });

  test('should fallback to fallback language', async () => {
    await i18n.initialize('en');
    
    // Try to get translation that doesn't exist in current language
    const translation = i18n.t('nonexistent.key', 'Default', 'invalid');
    expect(translation).toBe('Default');
  });

  test('should change language successfully', async () => {
    await i18n.initialize('en');
    expect(i18n.getCurrentLanguage()).toBe('en');
    
    await i18n.setLanguage('no');
    expect(i18n.getCurrentLanguage()).toBe('no');
    
    const translation = i18n.t('title');
    expect(translation).toBe('CORTEX – Sanntids avviksdeteksjon');
  });

  test('should handle initialization failures gracefully', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    
    const success = await i18n.initialize('en');
    
    expect(success).toBe(false);
    // Should still be able to use fallback translations
    const translation = i18n.t('title', 'Fallback Title');
    expect(typeof translation).toBe('string');
  });

  test('should get available languages', async () => {
    await i18n.initialize('en');
    await i18n.setLanguage('no');
    
    const languages = i18n.getAvailableLanguages();
    expect(languages).toContain('en');
    expect(languages).toContain('no');
  });

  test('should check if language is available', async () => {
    await i18n.initialize('en');
    
    expect(i18n.isLanguageAvailable('en')).toBe(true);
    expect(i18n.isLanguageAvailable('fr')).toBe(false);
  });

  test('should provide translation statistics', async () => {
    await i18n.initialize('en');
    await i18n.setLanguage('no');
    
    const stats = i18n.getStats();
    expect(stats.en).toBeDefined();
    expect(stats.no).toBeDefined();
    expect(stats.en.keyCount).toBeGreaterThan(0);
    expect(stats.no.keyCount).toBeGreaterThan(0);
  });

  test('should preload multiple languages', async () => {
    const success = await i18n.preloadLanguages(['en', 'no']);
    
    expect(success).toBe(true);
    expect(i18n.isLanguageAvailable('en')).toBe(true);
    expect(i18n.isLanguageAvailable('no')).toBe(true);
  });
});