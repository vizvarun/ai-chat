export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT || 30000),
};

// Define base URLs for different services
const TCG_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}:${
  import.meta.env.VITE_API_TCG_PORT_NUMBER
}`;
const RES_SCREENER_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}:${
  import.meta.env.VITE_API_RES_SCREENER_PORT_NUMBER
}`;

export const API_ENDPOINTS = {
  GENERATE_TEST_CASES: `${TCG_BASE_URL}${
    import.meta.env.VITE_API_GENERATE_TEST_CASES
  }`,
  PARSE_RESUME: `${RES_SCREENER_BASE_URL}${
    import.meta.env.VITE_API_PARSE_RESUME
  }`,
  PARSE_JOB_DESCRIPTION: `${RES_SCREENER_BASE_URL}${
    import.meta.env.VITE_API_PARSE_JOB_DESCRIPTION
  }`,
  RANK_RESUMES: `${RES_SCREENER_BASE_URL}${
    import.meta.env.VITE_API_RANK_RESUMES
  }`,
  EXPLAIN_RESUME: `${RES_SCREENER_BASE_URL}${
    import.meta.env.VITE_API_EXPLAIN_RESUME
  }`,
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
