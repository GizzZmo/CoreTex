// Utility functions for CoreTex application

/**
 * Format time duration in minutes to human readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const formatUptime = (minutes) => {
  if (typeof minutes !== 'number' || minutes < 0) return '0 min';
  
  if (minutes < 60) return `${minutes} min`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) return `${hours}t ${remainingMinutes}m`;
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return `${days}d ${remainingHours}t ${remainingMinutes}m`;
};

/**
 * Format timestamp to locale string with error handling
 * @param {string|Date} timestamp - Timestamp to format
 * @param {string} locale - Locale string (default: 'no-NO')
 * @returns {string} Formatted timestamp or original value
 */
export const formatTimestamp = (timestamp, locale = 'no-NO') => {
  if (!timestamp) return 'Ingen';
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    
    return date.toLocaleString(locale);
  } catch (error) {
    console.warn('Error formatting timestamp:', error);
    return timestamp;
  }
};

/**
 * Get color class based on anomaly type
 * @param {string} type - Anomaly type
 * @returns {string} CSS class name
 */
export const getAnomalyTypeColor = (type) => {
  if (!type) return 'text-gray-400';
  
  switch (type.toLowerCase()) {
    case 'sikkerhet':
    case 'security':
      return 'text-red-400';
    case 'system':
      return 'text-blue-400';
    case 'advarsel':
    case 'warning':
      return 'text-yellow-400';
    case 'info':
    case 'information':
      return 'text-green-400';
    default:
      return 'text-gray-400';
  }
};

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate unique ID for anomalies
 * @returns {string} Unique ID
 */
export const generateAnomalyId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate camera constraints for getUserMedia
 * @param {object} constraints - Camera constraints
 * @returns {object} Validated constraints
 */
export const validateCameraConstraints = (constraints = {}) => {
  return {
    video: {
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: "user",
      ...constraints.video
    }
  };
};

/**
 * Handle camera errors and return user-friendly messages
 * @param {Error} error - Camera error
 * @returns {string} User-friendly error message
 */
export const getCameraErrorMessage = (error) => {
  if (!error) return 'Ukjent feil';
  
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