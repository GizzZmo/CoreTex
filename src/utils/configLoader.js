/**
 * Cross-platform YAML configuration loader for CoreTex
 * Supports multiple YAML files with environment-specific overrides
 */

import yaml from 'js-yaml';

class ConfigLoader {
  constructor() {
    this.cache = new Map();
    this.configRoot = this.getConfigRoot();
    this.environment = this.getEnvironment();
  }

  /**
   * Get the configuration root directory (cross-platform)
   */
  getConfigRoot() {
    // In browser environment, configs are served from public directory
    return '/config';
  }

  /**
   * Get current environment
   */
  getEnvironment() {
    return process.env.NODE_ENV || 'development';
  }

  /**
   * Normalize file paths for cross-platform compatibility
   */
  normalizePath(...parts) {
    // Simple path joining for browser environment
    return parts.join('/').replace(/\/+/g, '/');
  }

  /**
   * Load YAML file with error handling
   */
  async loadYamlFile(filePath) {
    try {
      // Browser environment - use fetch
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}: ${response.status}`);
      }
      const content = await response.text();
      return yaml.load(content);
    } catch (error) {
      console.warn(`Failed to load YAML file ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Load configuration with environment-specific overrides
   */
  async loadConfig(type, name = null) {
    const cacheKey = `${type}:${name}:${this.environment}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let config = {};

    try {
      // Load base configuration
      let basePath;
      if (name) {
        basePath = this.normalizePath(this.configRoot, type, `${name}.yml`);
      } else {
        basePath = this.normalizePath(this.configRoot, type, `${type}.yml`);
      }

      const baseConfig = await this.loadYamlFile(basePath);
      if (baseConfig) {
        config = { ...baseConfig };
      }

      // Load environment-specific overrides for certain types
      if (type === 'environments') {
        const envPath = this.normalizePath(this.configRoot, 'environments', `${this.environment}.yml`);
        const envConfig = await this.loadYamlFile(envPath);
        if (envConfig) {
          config = this.deepMerge(config, envConfig);
        }
      }

      this.cache.set(cacheKey, config);
      return config;
    } catch (error) {
      console.error(`Failed to load configuration ${type}/${name}:`, error);
      this.cache.set(cacheKey, {});
      return {};
    }
  }

  /**
   * Deep merge objects (for configuration override)
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === 'object' && 
          source[key] !== null && 
          !Array.isArray(source[key]) &&
          typeof result[key] === 'object' && 
          result[key] !== null && 
          !Array.isArray(result[key])
        ) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * Load translation for specific language
   */
  async loadTranslations(language = 'en') {
    return await this.loadConfig('i18n', language);
  }

  /**
   * Load application configuration
   */
  async loadAppConfig() {
    return await this.loadConfig('app', 'app');
  }

  /**
   * Load environment configuration
   */
  async loadEnvironmentConfig() {
    return await this.loadConfig('environments', this.environment);
  }

  /**
   * Load all configurations
   */
  async loadAll() {
    const [app, environment, translations] = await Promise.all([
      this.loadAppConfig(),
      this.loadEnvironmentConfig(),
      this.loadTranslations(this.getDefaultLanguage())
    ]);

    return {
      app,
      environment,
      translations,
      meta: {
        environment: this.environment,
        configRoot: this.configRoot,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Get default language from app config or fallback
   */
  getDefaultLanguage() {
    // This could be enhanced to read from app config
    return 'no';
  }

  /**
   * Clear configuration cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get configuration file paths for a given type
   */
  getConfigPaths(type) {
    return {
      base: this.normalizePath(this.configRoot, type),
      environment: this.normalizePath(this.configRoot, 'environments', `${this.environment}.yml`)
    };
  }
}

// Export singleton instance
export const configLoader = new ConfigLoader();

// Export class for testing
export { ConfigLoader };

// Convenience functions
export const loadTranslations = (language) => configLoader.loadTranslations(language);
export const loadAppConfig = () => configLoader.loadAppConfig();
export const loadEnvironmentConfig = () => configLoader.loadEnvironmentConfig();
export const loadAllConfigs = () => configLoader.loadAll();