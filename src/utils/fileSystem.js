/**
 * Cross-platform file system utilities for CoreTex
 * Handles platform-specific file operations and path management
 */

import { configLoader } from './configLoader.js';

class FileSystemManager {
  constructor() {
    this.platform = this.detectPlatform();
    this.pathSeparator = this.getPlatformSeparator();
    this.platformConfig = null;
  }

  /**
   * Detect current platform
   */
  detectPlatform() {
    if (typeof window !== 'undefined') {
      // Browser environment - detect based on user agent
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.includes('win')) return 'windows';
      if (userAgent.includes('mac')) return 'macos';
      return 'linux';
    }
    
    // Node.js environment
    const platform = process.platform;
    switch (platform) {
      case 'win32': return 'windows';
      case 'darwin': return 'macos';
      default: return 'linux';
    }
  }

  /**
   * Get platform-specific path separator
   */
  getPlatformSeparator() {
    return this.platform === 'windows' ? '\\' : '/';
  }

  /**
   * Initialize platform configuration
   */
  async initialize() {
    try {
      this.platformConfig = await configLoader.loadConfig('app', 'platform');
      return true;
    } catch (error) {
      console.warn('Failed to load platform configuration:', error);
      this.loadFallbackConfig();
      return false;
    }
  }

  /**
   * Load fallback configuration when YAML loading fails
   */
  loadFallbackConfig() {
    this.platformConfig = {
      platforms: {
        windows: {
          paths: {
            separator: '\\',
            config: 'C:\\ProgramData\\CoreTex\\config',
            logs: 'C:\\ProgramData\\CoreTex\\logs',
            temp: '%TEMP%\\cortex'
          }
        },
        linux: {
          paths: {
            separator: '/',
            config: '/etc/cortex',
            logs: '/var/log/cortex',
            temp: '/tmp/cortex'
          }
        },
        macos: {
          paths: {
            separator: '/',
            config: '/usr/local/etc/cortex',
            logs: '/usr/local/var/log/cortex',
            temp: '/tmp/cortex'
          }
        }
      }
    };
  }

  /**
   * Get platform-specific configuration
   */
  getPlatformConfig() {
    if (!this.platformConfig || !this.platformConfig.platforms) {
      this.loadFallbackConfig();
    }
    return this.platformConfig.platforms[this.platform] || this.platformConfig.platforms.linux;
  }

  /**
   * Normalize path for current platform
   */
  normalizePath(...parts) {
    const joined = parts.join('/');
    if (this.platform === 'windows') {
      return joined.replace(/\//g, '\\');
    }
    return joined;
  }

  /**
   * Get platform-specific directory paths
   */
  getPaths() {
    const config = this.getPlatformConfig();
    return config.paths || {};
  }

  /**
   * Resolve environment variables in paths
   */
  resolvePath(path) {
    if (typeof window !== 'undefined') {
      // Browser environment - return as-is
      return path;
    }

    // Node.js environment - resolve environment variables
    return path.replace(/%([^%]+)%/g, (match, varName) => {
      return process.env[varName] || match;
    }).replace(/\$([A-Z_][A-Z0-9_]*)/g, (match, varName) => {
      return process.env[varName] || match;
    });
  }

  /**
   * Get absolute path for a given type
   */
  getPath(type) {
    const paths = this.getPaths();
    const basePath = paths[type];
    
    if (!basePath) {
      throw new Error(`Unknown path type: ${type}`);
    }

    return this.resolvePath(basePath);
  }

  /**
   * Check if running in a specific environment
   */
  isEnvironment(env) {
    return this.platform === env;
  }

  /**
   * Get platform capabilities
   */
  getCapabilities() {
    const capabilities = {
      filesystem: {
        caseSensitive: this.platform !== 'windows',
        maxPathLength: this.platform === 'windows' ? 260 : 4096,
        supportedChars: this.platform === 'windows' ? 
          /^[^<>:"|?*\x00-\x1f]+$/ : 
          /^[^\x00\/]+$/
      },
      permissions: {
        support: this.platform !== 'windows',
        executable: this.platform !== 'windows'
      },
      services: {
        type: this.getServiceType(),
        autoStart: true
      }
    };

    return capabilities;
  }

  /**
   * Get service management type for platform
   */
  getServiceType() {
    switch (this.platform) {
      case 'windows': return 'windows-service';
      case 'macos': return 'launchd';
      default: return 'systemd';
    }
  }

  /**
   * Validate file name for current platform
   */
  validateFileName(fileName) {
    const capabilities = this.getCapabilities();
    const regex = capabilities.filesystem.supportedChars;
    
    if (!regex.test(fileName)) {
      return {
        valid: false,
        error: `File name contains invalid characters for ${this.platform}`
      };
    }

    if (fileName.length > capabilities.filesystem.maxPathLength) {
      return {
        valid: false,
        error: `File name exceeds maximum length for ${this.platform}`
      };
    }

    return { valid: true };
  }

  /**
   * Get platform-specific configuration file extensions
   */
  getConfigExtensions() {
    return ['.yml', '.yaml', '.json'];
  }

  /**
   * Get system information
   */
  getSystemInfo() {
    return {
      platform: this.platform,
      separator: this.pathSeparator,
      capabilities: this.getCapabilities(),
      paths: this.getPaths(),
      serviceType: this.getServiceType()
    };
  }
}

// Export singleton instance
export const fileSystem = new FileSystemManager();

// Export class for testing
export { FileSystemManager };

// Convenience functions
export const getPlatform = () => fileSystem.platform;
export const normalizePath = (...parts) => fileSystem.normalizePath(...parts);
export const getSystemPaths = () => fileSystem.getPaths();
export const validateFileName = (name) => fileSystem.validateFileName(name);
export const initializeFileSystem = () => fileSystem.initialize();