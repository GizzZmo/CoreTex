/**
 * Test utilities for YAML configuration system
 * Provides mocks and test helpers for configuration loading
 */

// Mock translations for testing
export const mockTranslations = {
  en: {
    title: "CORTEX – Real-time Anomaly Detection",
    description: "Detect threats and irregularities in real time. Security at the highest level.",
    footer: "A project to safeguard organizations from anomalies and threats.",
    dashboard: {
      title: "System Dashboard",
      uptime: "System Uptime",
      users: "Active Users",
      lastReport: "Last Report",
      anomalies: "Anomalies Detected"
    },
    faceRecognition: {
      title: "Face Recognition",
      status: "Camera Status"
    },
    anomalyLog: {
      title: "Anomaly Log",
      noAnomalies: "No anomalies detected",
      unknownAnomaly: "Unknown anomaly",
      other: "Other"
    },
    language: {
      switch: "Switch Language",
      current: "Current Language"
    }
  },
  no: {
    title: "CORTEX – Sanntids avviksdeteksjon",
    description: "Oppdag trusler og uregelmessigheter i sanntid. Sikkerhet på høyeste nivå.",
    footer: "Et prosjekt for å beskytte virksomheter mot avvik og trusler.",
    dashboard: {
      title: "Systemdashboard",
      uptime: "Systemets oppetid",
      users: "Aktive brukere",
      lastReport: "Siste rapport",
      anomalies: "Avvik oppdaget"
    },
    faceRecognition: {
      title: "Ansiktsgjenkjenning",
      status: "Kamerastatus"
    },
    anomalyLog: {
      title: "Avvikslogg",
      noAnomalies: "Ingen avvik oppdaget",
      unknownAnomaly: "Ukjent avvik",
      other: "Annet"
    },
    language: {
      switch: "Bytt språk",
      current: "Nåværende språk"
    }
  }
};

// Mock configuration for testing
export const mockAppConfig = {
  app: {
    name: "CoreTex",
    version: "1.0.0",
    environment: "test"
  },
  ui: {
    theme: "cyberpunk",
    defaultLanguage: "no",
    supportedLanguages: ["no", "en"]
  },
  defaults: {
    knownFaces: ["Ola", "Kari", "Per"],
    toleranceLevel: 0.7,
    maxAnomalies: 100
  }
};

// Mock environment config
export const mockEnvironmentConfig = {
  app: {
    environment: "test",
    debug: true,
    logLevel: "error"
  },
  camera: {
    defaultResolution: { width: 320, height: 240 },
    tolerance: 0.5,
    mockMode: true
  },
  features: {
    faceRecognition: false,
    anomalyDetection: true,
    debugMode: true
  },
  testing: {
    enableMocks: true,
    fakeUserMedia: true,
    mockAnomalies: true
  }
};

/**
 * Setup mocks for testing
 */
export function setupConfigMocks() {
  // Mock fetch for YAML file loading
  global.fetch = jest.fn((url) => {
    if (url.includes('/config/i18n/en.yml')) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`
title: "CORTEX – Real-time Anomaly Detection"
description: "Detect threats and irregularities in real time. Security at the highest level."
footer: "A project to safeguard organizations from anomalies and threats."
dashboard:
  title: "System Dashboard"
  uptime: "System Uptime"
  users: "Active Users"
  lastReport: "Last Report"
  anomalies: "Anomalies Detected"
faceRecognition:
  title: "Face Recognition"
  status: "Camera Status"
anomalyLog:
  title: "Anomaly Log"
  noAnomalies: "No anomalies detected"
  unknownAnomaly: "Unknown anomaly"
  other: "Other"
language:
  switch: "Switch Language"
  current: "Current Language"
        `)
      });
    }
    
    if (url.includes('/config/i18n/no.yml')) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`
title: "CORTEX – Sanntids avviksdeteksjon"
description: "Oppdag trusler og uregelmessigheter i sanntid. Sikkerhet på høyeste nivå."
footer: "Et prosjekt for å beskytte virksomheter mot avvik og trusler."
dashboard:
  title: "Systemdashboard"
  uptime: "Systemets oppetid"
  users: "Aktive brukere"
  lastReport: "Siste rapport"
  anomalies: "Avvik oppdaget"
faceRecognition:
  title: "Ansiktsgjenkjenning"
  status: "Kamerastatus"
anomalyLog:
  title: "Avvikslogg"
  noAnomalies: "Ingen avvik oppdaget"
  unknownAnomaly: "Ukjent avvik"
  other: "Annet"
language:
  switch: "Bytt språk"
  current: "Nåværende språk"
        `)
      });
    }

    if (url.includes('/config/app/app.yml')) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`
app:
  name: "CoreTex"
  version: "1.0.0"
  environment: "test"
ui:
  theme: "cyberpunk"
  defaultLanguage: "no"
  supportedLanguages: ["no", "en"]
defaults:
  knownFaces: ["Ola", "Kari", "Per"]
  toleranceLevel: 0.7
  maxAnomalies: 100
        `)
      });
    }

    if (url.includes('/config/app/platform.yml')) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`
platforms:
  windows:
    paths:
      separator: "\\\\"
      config: "C:\\\\ProgramData\\\\CoreTex\\\\config"
      logs: "C:\\\\ProgramData\\\\CoreTex\\\\logs"
      temp: "%TEMP%\\\\cortex"
  linux:
    paths:
      separator: "/"
      config: "/etc/cortex"
      logs: "/var/log/cortex"
      temp: "/tmp/cortex"
  macos:
    paths:
      separator: "/"
      config: "/usr/local/etc/cortex"
      logs: "/usr/local/var/log/cortex"
      temp: "/tmp/cortex"
shared:
  configFiles:
    - "app.yml"
    - "environments/"
    - "i18n/"
        `)
      });
    }

    // Default mock response for other config files
    return Promise.resolve({
      ok: false,
      status: 404,
      text: () => Promise.resolve('')
    });
  });
}

/**
 * Cleanup mocks after testing
 */
export function cleanupConfigMocks() {
  delete global.fetch;
}

/**
 * Create test-specific config loader
 */
export function createTestConfigLoader() {
  setupConfigMocks();
  
  return {
    loadTranslations: async (language) => {
      return mockTranslations[language] || mockTranslations.en;
    },
    loadAppConfig: async () => {
      return mockAppConfig;
    },
    loadEnvironmentConfig: async () => {
      return mockEnvironmentConfig;
    },
    clearCache: () => {},
    getConfigPaths: () => ({
      base: '/config/test',
      environment: '/config/environments/test.yml'
    })
  };
}