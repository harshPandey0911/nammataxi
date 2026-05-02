/**
 * src/config/env.js
 *
 * Centralized environment configuration.
 * All process.env reads MUST go through this file — never read process.env directly in app code.
 * Validates required variables at boot time so the app fails fast on misconfiguration.
 *
 * Database: MongoDB (via Mongoose)
 */

import 'dotenv/config';

// ── Helpers ──────────────────────────────────────────────────────────────────

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key, defaultValue = '') {
  return process.env[key] ?? defaultValue;
}

// ── Validation (fail-fast on startup for critical missing vars) ───────────────

const NODE_ENV = optionalEnv('NODE_ENV', 'development');
const isProduction = NODE_ENV === 'production';

if (isProduction) {
  requireEnv('MONGODB_URI');
  requireEnv('JWT_SECRET');
  requireEnv('JWT_REFRESH_SECRET');
}

// ── Config Object ─────────────────────────────────────────────────────────────

const config = {
  // Server
  env: NODE_ENV,
  isProduction,
  isDevelopment: NODE_ENV === 'development',
  port: parseInt(optionalEnv('PORT', '5000'), 10),

  // Database — MongoDB
  db: {
    uri: optionalEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/namma_taxi'),
    testUri: optionalEnv('MONGODB_TEST_URI', 'mongodb://127.0.0.1:27017/namma_taxi_test'),
  },

  // JWT Auth
  jwt: {
    secret: optionalEnv('JWT_SECRET', 'dev-secret-replace-in-production'),
    expiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
    refreshSecret: optionalEnv('JWT_REFRESH_SECRET', 'dev-refresh-secret-replace-in-production'),
    refreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '30d'),
  },

  // CORS
  cors: {
    origins: (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    max: parseInt(optionalEnv('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
  },

  // Logging
  logging: {
    level: optionalEnv('LOG_LEVEL', 'debug'),
    dir: optionalEnv('LOG_DIR', 'logs'),
  },

  // App URLs
  frontendUrl: optionalEnv('FRONTEND_URL', 'http://localhost:5173'),

  // Cloudinary (Image Management)
  cloudinary: {
    cloudName: optionalEnv('CLOUDINARY_CLOUD_NAME', ''),
    apiKey: optionalEnv('CLOUDINARY_API_KEY', ''),
    apiSecret: optionalEnv('CLOUDINARY_API_SECRET', ''),
  },

  // Map Provider Integrations
  maps: {
    googleApiKey: optionalEnv('GOOGLE_MAPS_API_KEY', ''),
  },
};

export default config;
