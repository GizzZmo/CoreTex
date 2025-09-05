/**
 * Tests for Cross-Platform File System Manager
 */

import { FileSystemManager, fileSystem } from '../src/utils/fileSystem';
import { setupConfigMocks, cleanupConfigMocks } from '../src/utils/testUtils';

describe('FileSystemManager', () => {
  beforeEach(() => {
    setupConfigMocks();
  });

  afterEach(() => {
    cleanupConfigMocks();
  });

  test('should detect platform correctly', () => {
    const fs = new FileSystemManager();
    expect(['windows', 'linux', 'macos']).toContain(fs.platform);
  });

  test('should get correct path separator', () => {
    const fs = new FileSystemManager();
    if (fs.platform === 'windows') {
      expect(fs.pathSeparator).toBe('\\');
    } else {
      expect(fs.pathSeparator).toBe('/');
    }
  });

  test('should normalize paths for platform', () => {
    const fs = new FileSystemManager();
    const normalized = fs.normalizePath('config', 'app', 'app.yml');
    
    if (fs.platform === 'windows') {
      expect(normalized).toBe('config\\app\\app.yml');
    } else {
      expect(normalized).toBe('config/app/app.yml');
    }
  });

  test('should initialize with platform configuration', async () => {
    const fs = new FileSystemManager();
    const success = await fs.initialize();
    
    expect(success).toBe(true);
    expect(fs.platformConfig).toBeDefined();
  });

  test('should provide platform-specific configuration', async () => {
    const fs = new FileSystemManager();
    await fs.initialize();
    
    const config = fs.getPlatformConfig();
    expect(config).toBeDefined();
    expect(config.paths).toBeDefined();
  });

  test('should validate file names correctly', () => {
    const fs = new FileSystemManager();
    
    // Valid file name
    const validResult = fs.validateFileName('config.yml');
    expect(validResult.valid).toBe(true);
    
    // Invalid file name (with forbidden characters)
    if (fs.platform === 'windows') {
      const invalidResult = fs.validateFileName('config<>.yml');
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.error).toContain('invalid characters');
    }
  });

  test('should provide system capabilities', () => {
    const fs = new FileSystemManager();
    const capabilities = fs.getCapabilities();
    
    expect(capabilities).toBeDefined();
    expect(capabilities.filesystem).toBeDefined();
    expect(capabilities.permissions).toBeDefined();
    expect(capabilities.services).toBeDefined();
    
    expect(typeof capabilities.filesystem.caseSensitive).toBe('boolean');
    expect(typeof capabilities.filesystem.maxPathLength).toBe('number');
  });

  test('should resolve environment variables in paths', () => {
    const fs = new FileSystemManager();
    
    // Skip in browser environment
    if (typeof window !== 'undefined') {
      return;
    }
    
    // Set test environment variable
    process.env.TEST_VAR = 'test_value';
    
    const resolved = fs.resolvePath('/path/to/$TEST_VAR/config');
    expect(resolved).toBe('/path/to/test_value/config');
    
    // Clean up
    delete process.env.TEST_VAR;
  });

  test('should get correct service type for platform', () => {
    const fs = new FileSystemManager();
    const serviceType = fs.getServiceType();
    
    switch (fs.platform) {
      case 'windows':
        expect(serviceType).toBe('windows-service');
        break;
      case 'macos':
        expect(serviceType).toBe('launchd');
        break;
      default:
        expect(serviceType).toBe('systemd');
    }
  });

  test('should provide system information', () => {
    const fs = new FileSystemManager();
    const info = fs.getSystemInfo();
    
    expect(info.platform).toBeDefined();
    expect(info.separator).toBeDefined();
    expect(info.capabilities).toBeDefined();
    expect(info.serviceType).toBeDefined();
  });

  test('should get configuration file extensions', () => {
    const fs = new FileSystemManager();
    const extensions = fs.getConfigExtensions();
    
    expect(extensions).toContain('.yml');
    expect(extensions).toContain('.yaml');
    expect(extensions).toContain('.json');
  });

  test('should handle environment check', () => {
    const fs = new FileSystemManager();
    
    expect(fs.isEnvironment(fs.platform)).toBe(true);
    expect(fs.isEnvironment('nonexistent')).toBe(false);
  });

  test('should load fallback configuration when needed', () => {
    const fs = new FileSystemManager();
    fs.loadFallbackConfig();
    
    expect(fs.platformConfig).toBeDefined();
    expect(fs.platformConfig.platforms).toBeDefined();
    expect(fs.platformConfig.platforms.windows).toBeDefined();
    expect(fs.platformConfig.platforms.linux).toBeDefined();
    expect(fs.platformConfig.platforms.macos).toBeDefined();
  });

  test('should get platform-specific paths', async () => {
    const fs = new FileSystemManager();
    await fs.initialize();
    
    const paths = fs.getPaths();
    expect(paths).toBeDefined();
    
    if (paths.config) {
      expect(typeof paths.config).toBe('string');
    }
    
    if (paths.logs) {
      expect(typeof paths.logs).toBe('string');
    }
  });

  test('should throw error for unknown path type', async () => {
    const fs = new FileSystemManager();
    await fs.initialize();
    
    // Set up fallback config if initialization failed
    if (!fs.platformConfig) {
      fs.loadFallbackConfig();
    }
    
    expect(() => {
      fs.getPath('nonexistent');
    }).toThrow('Unknown path type: nonexistent');
  });
});

describe('File System Utility Functions', () => {
  test('should export convenience functions', () => {
    expect(typeof fileSystem.platform).toBe('string');
    expect(typeof fileSystem.normalizePath).toBe('function');
    expect(typeof fileSystem.getPaths).toBe('function');
    expect(typeof fileSystem.validateFileName).toBe('function');
  });

  test('should normalize paths using utility function', () => {
    const normalized = fileSystem.normalizePath('config', 'app');
    expect(typeof normalized).toBe('string');
    expect(normalized).toContain('config');
    expect(normalized).toContain('app');
  });

  test('should validate file names using utility function', () => {
    const result = fileSystem.validateFileName('test.yml');
    expect(result).toBeDefined();
    expect(typeof result.valid).toBe('boolean');
  });
});