/**
 * Centralized Frontend Environment Configuration
 * Safe fallbacks provided to ensure UI does not crash if local env is missing.
 */
const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Pulse City',
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
};

export default env;
