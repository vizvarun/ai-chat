/**
 * Environment configuration
 * This file centralizes all environment variables and provides
 * type-safe access to them with validation
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT || 30000),
};

// API Endpoints
export const API_ENDPOINTS = {
  GENERATE_TEST_CASES: import.meta.env.VITE_API_GENERATE_TEST_CASES,
};

// Validate required environment variables during development
if (import.meta.env.DEV) {
  const requiredVars = ["VITE_API_BASE_URL"];

  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      console.warn(`Missing required environment variable: ${varName}`);
    }
  }
}
