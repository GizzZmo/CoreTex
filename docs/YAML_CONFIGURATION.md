# Multi-YAML Configuration System Documentation

The CoreTex application now features a comprehensive multi-YAML file configuration system with cross-platform functionality. This system provides structured, maintainable configuration management across different environments and platforms.

## Overview

The configuration system consists of several key components:

- **YAML Configuration Files**: Organized by type and environment
- **Cross-Platform File System Manager**: Handles platform-specific operations
- **Configuration Loader**: Dynamically loads and merges configurations
- **Internationalization Manager**: Manages multi-language support via YAML

## Directory Structure

```
config/
├── app/
│   ├── app.yml           # Main application configuration
│   └── platform.yml      # Cross-platform settings
├── environments/
│   ├── development.yml   # Development environment
│   ├── production.yml    # Production environment
│   ├── test.yml         # Test environment
│   └── docker.yml       # Docker deployment
└── i18n/
    ├── en.yml           # English translations
    └── no.yml           # Norwegian translations
```

## Configuration Files

### Application Configuration (`app/app.yml`)

Main application settings including:
- Application metadata (name, version, author)
- UI configuration (theme, default language)
- Component settings (dashboard, face recognition, anomaly log)
- Default values (known faces, tolerance levels)

### Environment Configurations (`environments/`)

Environment-specific settings:
- **development.yml**: Debug mode, local API endpoints, verbose logging
- **production.yml**: Optimized settings, production APIs, security headers
- **test.yml**: Mock mode, minimal logging, test-specific settings
- **docker.yml**: Container-specific configuration and resource limits

### Platform Configuration (`app/platform.yml`)

Cross-platform settings for:
- **Windows**: Registry settings, service configuration, Windows-specific paths
- **Linux**: Systemd services, Unix permissions, standard Linux paths
- **macOS**: Launchd services, macOS-specific directories

### Internationalization (`i18n/`)

Multi-language support:
- Nested YAML structure for organized translations
- Support for component-specific translations
- Fallback mechanism for missing translations

## Usage

### Basic Configuration Loading

```javascript
import { configLoader } from './utils/configLoader.js';

// Load environment configuration
const envConfig = await configLoader.loadEnvironmentConfig();

// Load application configuration
const appConfig = await configLoader.loadAppConfig();

// Load translations for specific language
const translations = await configLoader.loadTranslations('en');
```

### Internationalization

```javascript
import { i18n, initializeI18n } from './utils/i18n.js';

// Initialize with default language
await initializeI18n('no');

// Get translation
const title = i18n.t('title'); // Returns: "CORTEX – Sanntids avviksdeteksjon"

// Get nested translation
const dashboardTitle = i18n.t('dashboard.title'); // Returns: "Systemdashboard"

// Change language
await i18n.setLanguage('en');
const englishTitle = i18n.t('title'); // Returns: "CORTEX – Real-time Anomaly Detection"
```

### Cross-Platform File System

```javascript
import { fileSystem, initializeFileSystem } from './utils/fileSystem.js';

// Initialize file system manager
await initializeFileSystem();

// Get platform-specific paths
const configPath = fileSystem.getPath('config');  // /etc/cortex (Linux) or C:\ProgramData\CoreTex\config (Windows)

// Normalize paths for current platform
const normalizedPath = fileSystem.normalizePath('config', 'app', 'app.yml');

// Validate file names
const validation = fileSystem.validateFileName('my-config.yml');
if (validation.valid) {
    // File name is valid for current platform
}
```

## Features

### 1. Environment-Specific Overrides

The system automatically loads base configurations and applies environment-specific overrides:

```yaml
# Base configuration
api:
  timeout: 5000

# Development override
api:
  timeout: 15000  # Longer timeout for development
  debug: true     # Additional debug setting
```

### 2. Deep Configuration Merging

Configurations are merged hierarchically, allowing for precise control:

```yaml
# app.yml
camera:
  resolution:
    width: 640
    height: 480
  fps: 30

# production.yml
camera:
  resolution:
    width: 1280  # Only width is overridden
    # height remains 480
  fps: 60        # fps is overridden
```

### 3. Fallback Mechanisms

Multiple fallback layers ensure robust operation:
1. YAML file loading (primary)
2. Cached configurations (secondary)
3. Hardcoded fallbacks (tertiary)

### 4. Cross-Platform Path Handling

Automatic platform detection and path normalization:

```javascript
// Automatically uses correct path separator
const path = fileSystem.normalizePath('config', 'app');
// Windows: config\app
// Linux/macOS: config/app
```

### 5. Configuration Validation

Built-in validation for:
- File name compatibility across platforms
- Path length limits
- Character restrictions
- Configuration schema integrity

## Testing

The system includes comprehensive tests with mock configurations:

```javascript
import { setupConfigMocks } from './utils/testUtils.js';

// Setup mocks for testing
setupConfigMocks();

// Tests can now load configurations without actual YAML files
const translations = await configLoader.loadTranslations('en');
```

## Browser vs Node.js Environment

The system works in both environments:

### Browser Environment
- Loads YAML files via fetch API
- Configurations served from `/public/config/`
- Platform detection via user agent
- Fallback to embedded configurations

### Node.js Environment
- Loads YAML files via file system
- Configurations from `./config/` directory
- Platform detection via `process.platform`
- Full file system access

## Performance Considerations

### Caching
- Configurations are cached after first load
- Cache can be cleared for hot-reloading
- Environment-specific cache keys

### Lazy Loading
- Translations loaded on-demand
- Configurations loaded asynchronously
- Minimal initial bundle size

### Bundle Size
- YAML parser included (~10KB gzipped)
- Configuration files excluded from bundle
- Dynamic loading reduces initial payload

## Security

### Content Security Policy
- YAML files served from same origin
- No external configuration dependencies
- Configurable security headers per environment

### Validation
- Input validation for all configuration values
- Schema validation for critical settings
- Sanitization of user-provided configurations

## Migration Guide

### From JavaScript to YAML

Old approach:
```javascript
export const translations = {
  no: { title: "CORTEX" },
  en: { title: "CORTEX" }
};
```

New approach:
```yaml
# no.yml
title: "CORTEX – Sanntids avviksdeteksjon"

# en.yml  
title: "CORTEX – Real-time Anomaly Detection"
```

### Updating Components

Components can now access centralized configuration:

```javascript
import { i18n } from './utils/i18n.js';

function MyComponent() {
  return <h1>{i18n.t('title')}</h1>;
}
```

## Best Practices

### 1. Configuration Organization
- Group related settings in nested objects
- Use environment-specific files for overrides
- Keep sensitive data in environment variables

### 2. Translation Keys
- Use dot notation for nested keys (`dashboard.title`)
- Provide meaningful default values
- Keep keys descriptive but concise

### 3. Platform Compatibility
- Test configurations on all target platforms
- Use normalized paths throughout the application
- Validate file names before creating files

### 4. Performance
- Preload frequently used configurations
- Cache configurations appropriately
- Use lazy loading for large configuration sets

## Troubleshooting

### Common Issues

**YAML Parse Errors**
- Check YAML syntax and indentation
- Ensure proper encoding (UTF-8)
- Validate special characters

**Missing Translations**
- Verify translation keys exist in YAML files
- Check fallback language configuration
- Ensure proper nested structure

**Platform Path Issues**
- Use fileSystem utilities for path operations
- Test path resolution on target platforms
- Validate path lengths and characters

**Configuration Loading Failures**
- Check network connectivity (browser)
- Verify file permissions (Node.js)
- Confirm file existence and accessibility

### Debug Mode

Enable debug logging:
```yaml
# development.yml
app:
  debug: true
  logLevel: "debug"
```

This provides detailed logging for:
- Configuration loading steps
- YAML parsing results
- Cache hit/miss information
- Platform detection results

## Future Enhancements

- Schema validation for YAML configurations
- Hot-reloading in development
- Configuration management UI
- Remote configuration loading
- Encrypted configuration support
- Configuration versioning and rollback