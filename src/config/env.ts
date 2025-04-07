export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT || 30000),
};

export const API_ENDPOINTS = {
  GENERATE_TEST_CASES: import.meta.env.VITE_API_GENERATE_TEST_CASES,
  RANK_RESUMES: import.meta.env.VITE_API_RANK_RESUMES,
};

export const UI_CONFIG = {
  REQUEST_TIMEOUT: Number(
    import.meta.env.VITE_UI_REQUEST_TIMEOUT || API_CONFIG.TIMEOUT
  ),
  ANIMATION_DELAY: Number(import.meta.env.VITE_UI_ANIMATION_DELAY || 300),
};

if (import.meta.env.DEV) {
  const requiredVars = ["VITE_API_BASE_URL"];

  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      console.warn(`Missing required environment variable: ${varName}`);
    }
  }
}
