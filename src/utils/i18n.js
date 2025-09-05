/**
 * Enhanced i18n system using YAML configuration files
 * Provides cross-platform internationalization with hot-reloading support
 */

import { configLoader } from './configLoader.js';

class I18nManager {
  constructor() {
    this.currentLanguage = 'no';
    this.translations = new Map();
    this.fallbackLanguage = 'en';
    this.loadPromises = new Map();
  }

  /**
   * Initialize i18n system with default language
   */
  async initialize(language = 'no') {
    try {
      await this.setLanguage(language);
      return true;
    } catch (error) {
      console.error('Failed to initialize i18n system:', error);
      // Fallback to default translations
      this.loadFallbackTranslations();
      return false;
    }
  }

  /**
   * Load fallback translations (in case YAML loading fails)
   */
  loadFallbackTranslations() {
    const fallbackTranslations = {
      no: {
        title: "CORTEX – Sanntids avviksdeteksjon",
        description: "Oppdag trusler og uregelmessigheter i sanntid. Sikkerhet på høyeste nivå.",
        footer: "Et prosjekt for å beskytte virksomheter mot avvik og trusler.",
      },
      en: {
        title: "CORTEX – Real-time Anomaly Detection",
        description: "Detect threats and irregularities in real time. Security at the highest level.",
        footer: "A project to safeguard organizations from anomalies and threats.",
      },
    };

    Object.entries(fallbackTranslations).forEach(([lang, translations]) => {
      this.translations.set(lang, translations);
    });
  }

  /**
   * Set current language and load translations
   */
  async setLanguage(language) {
    if (this.currentLanguage === language && this.translations.has(language)) {
      return;
    }

    const translations = await this.loadTranslations(language);
    if (translations && Object.keys(translations).length > 0) {
      this.translations.set(language, translations);
      this.currentLanguage = language;
    } else {
      throw new Error(`Failed to load translations for language: ${language}`);
    }
  }

  /**
   * Load translations for a specific language
   */
  async loadTranslations(language) {
    // Check if already loading
    if (this.loadPromises.has(language)) {
      return await this.loadPromises.get(language);
    }

    // Check cache first
    if (this.translations.has(language)) {
      return this.translations.get(language);
    }

    // Load translations
    const loadPromise = configLoader.loadTranslations(language);
    this.loadPromises.set(language, loadPromise);

    try {
      const translations = await loadPromise;
      this.loadPromises.delete(language);
      return translations;
    } catch (error) {
      this.loadPromises.delete(language);
      throw error;
    }
  }

  /**
   * Get translation for a key with optional fallback
   */
  t(key, defaultValue = key, language = null) {
    const lang = language || this.currentLanguage;
    const translations = this.translations.get(lang);

    if (!translations) {
      return this.getFallbackTranslation(key, defaultValue);
    }

    // Support nested keys like 'dashboard.title'
    const value = this.getNestedValue(translations, key);
    
    if (value !== undefined) {
      return value;
    }

    // Try fallback language
    if (lang !== this.fallbackLanguage) {
      return this.t(key, defaultValue, this.fallbackLanguage);
    }

    return defaultValue;
  }

  /**
   * Get fallback translation when YAML loading fails
   */
  getFallbackTranslation(key, defaultValue) {
    // Try to get from loaded fallback translations
    const fallbackTranslations = this.translations.get(this.fallbackLanguage);
    if (fallbackTranslations) {
      const value = this.getNestedValue(fallbackTranslations, key);
      if (value !== undefined) {
        return value;
      }
    }

    return defaultValue;
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages() {
    return Array.from(this.translations.keys());
  }

  /**
   * Check if language is available
   */
  isLanguageAvailable(language) {
    return this.translations.has(language);
  }

  /**
   * Get all translations for current language
   */
  getCurrentTranslations() {
    return this.translations.get(this.currentLanguage) || {};
  }

  /**
   * Preload translations for multiple languages
   */
  async preloadLanguages(languages) {
    const loadPromises = languages.map(async (lang) => {
      const translations = await this.loadTranslations(lang);
      if (translations && Object.keys(translations).length > 0) {
        this.translations.set(lang, translations);
        return true;
      }
      return false;
    });
    
    try {
      const results = await Promise.all(loadPromises);
      return results.every(result => result);
    } catch (error) {
      console.warn('Some translations failed to preload:', error);
      return false;
    }
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.translations.clear();
    this.loadPromises.clear();
    configLoader.clearCache();
  }

  /**
   * Get translation statistics
   */
  getStats() {
    const stats = {};
    this.translations.forEach((translations, language) => {
      stats[language] = {
        keyCount: this.countKeys(translations),
        isActive: language === this.currentLanguage
      };
    });
    return stats;
  }

  /**
   * Count translation keys recursively
   */
  countKeys(obj) {
    let count = 0;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          count += this.countKeys(obj[key]);
        } else {
          count++;
        }
      }
    }
    return count;
  }
}

// Export singleton instance
export const i18n = new I18nManager();

// Export class for testing
export { I18nManager };

// Convenience function for translations
export const t = (key, defaultValue, language) => i18n.t(key, defaultValue, language);

// Initialize with default language (this will be called by the app)
export const initializeI18n = (language = 'no') => i18n.initialize(language);