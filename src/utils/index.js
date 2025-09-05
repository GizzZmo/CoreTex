/**
 * Utility functions for CoreTex application
 * 
 * This module provides helper functions for formatting, validation,
 * error handling, and other common operations used throughout the app.
 * 
 * @module utils
 */

/**
 * Formats time duration in minutes to human readable format
 * Automatically converts to appropriate units (minutes, hours, days)
 * 
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 * 
 * @example
 * formatUptime(30)    // "30 min"
 * formatUptime(90)    // "1t 30m" 
 * formatUptime(1440)  // "1d 0t 0m"
 */
export const formatUptime = (minutes) => {
  // Validate input - must be a positive number
  if (typeof minutes !== 'number' || minutes < 0) return '0 min';
  
  // Less than an hour - show minutes
  if (minutes < 60) return `${minutes} min`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  // Less than a day - show hours and minutes
  if (hours < 24) return `${hours}t ${remainingMinutes}m`;
  
  // More than a day - show days, hours, and minutes
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return `${days}d ${remainingHours}t ${remainingMinutes}m`;
};

/**
 * Formats timestamp to locale string with comprehensive error handling
 * Safely handles invalid dates and provides fallbacks
 * 
 * @param {string|Date|null|undefined} timestamp - Timestamp to format
 * @param {string} [locale='no-NO'] - Locale string for formatting
 * @returns {string} Formatted timestamp or fallback value
 * 
 * @example
 * formatTimestamp('2025-06-28T20:15:00.000Z')  // "28.6.2025, 20:15:00"
 * formatTimestamp(null)                         // "Ingen"
 * formatTimestamp('invalid')                    // "invalid"
 */
export const formatTimestamp = (timestamp, locale = 'no-NO') => {
  // Handle null/undefined/empty values
  if (!timestamp) return 'Ingen';
  
  try {
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return timestamp;
    
    return date.toLocaleString(locale);
  } catch (error) {
    // Log warning but don't break the application
    console.warn('Error formatting timestamp:', error);
    return timestamp;
  }
};

/**
 * Returns appropriate CSS color class based on anomaly type
 * Supports both Norwegian and English type names
 * 
 * @param {string|null|undefined} type - Anomaly type
 * @returns {string} CSS class name for the color
 * 
 * @example
 * getAnomalyTypeColor('sikkerhet')  // "text-red-400"
 * getAnomalyTypeColor('system')     // "text-blue-400" 
 * getAnomalyTypeColor('unknown')    // "text-gray-400"
 */
export const getAnomalyTypeColor = (type) => {
  if (!type) return 'text-gray-400';
  
  // Convert to lowercase for case-insensitive comparison
  switch (type.toLowerCase()) {
    case 'sikkerhet':
    case 'security':
      return 'text-red-400';    // High priority - red
    case 'system':
      return 'text-blue-400';   // System events - blue
    case 'advarsel':
    case 'warning':
      return 'text-yellow-400'; // Warnings - yellow
    case 'info':
    case 'information':
      return 'text-green-400';  // Information - green
    default:
      return 'text-gray-400';   // Unknown/default - gray
  }
};

/**
 * Debounces a function to limit how often it can be called
 * Useful for preventing excessive API calls or expensive operations
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 * 
 * @example
 * const debouncedSearch = debounce(search, 300);
 * debouncedSearch('query'); // Will only execute after 300ms of no calls
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    // Clear existing timeout and set new one
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generates a unique identifier for anomaly objects
 * Combines timestamp with random string for uniqueness
 * 
 * @returns {string} Unique ID string
 * 
 * @example
 * generateAnomalyId()  // "1640995200000-abc123def"
 */
export const generateAnomalyId = () => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${randomPart}`;
};

/**
 * Validates and normalizes camera constraints for getUserMedia
 * Provides sensible defaults while allowing customization
 * 
 * @param {object} [constraints={}] - Custom camera constraints
 * @returns {object} Validated and normalized constraints object
 * 
 * @example
 * validateCameraConstraints()  // Default constraints
 * validateCameraConstraints({ video: { width: { ideal: 1920 } } })  // Custom width
 */
export const validateCameraConstraints = (constraints = {}) => {
  return {
    video: {
      width: { ideal: 640 },      // Default resolution
      height: { ideal: 480 },
      facingMode: "user",         // Front-facing camera
      ...constraints.video        // Allow overrides
    }
  };
};

/**
 * Converts camera errors to user-friendly Norwegian messages
 * Handles all common MediaDevices.getUserMedia() error types
 * 
 * @param {Error|null|undefined} error - Camera error object
 * @returns {string} User-friendly error message in Norwegian
 * 
 * @example
 * getCameraErrorMessage({ name: 'NotAllowedError' })  // "Kameratilgang nektet"
 * getCameraErrorMessage({ name: 'NotFoundError' })    // "Ingen kamera funnet"
 */
export const getCameraErrorMessage = (error) => {
  if (!error) return 'Ukjent feil';
  
  // Map standard MediaDevices error names to Norwegian messages
  switch (error.name) {
    case 'NotFoundError':
      return 'Ingen kamera funnet';
    case 'NotAllowedError':
      return 'Kameratilgang nektet';
    case 'NotReadableError':
      return 'Kamera er i bruk av annen app';
    case 'OverconstrainedError':
      return 'Kamerainnstillinger ikke støttet';
    case 'SecurityError':
      return 'Sikkerhetsfeil ved kameratilgang';
    default:
      return 'Kunne ikke starte kamera';
  }
};