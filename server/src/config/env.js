/**
 * Centralized Backend Environment Configuration
 * Reads from process.env and provides safe default fallbacks.
 */
require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pulse-city',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173',
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || ''
};

module.exports = env;
