/**
 * Environment configuration
 * Centralized access to environment variables with type safety
 */

export const env = {
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "EMS",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  // API Configuration
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", 10),
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

export default env;
