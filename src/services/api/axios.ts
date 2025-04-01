import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { API_CONFIG } from "../../config/env";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_CONFIG.TIMEOUT, // Use environment variable for timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    // Add timestamp to prevent caching
    const originalUrl = config.url || "";
    const separator = originalUrl.includes("?") ? "&" : "?";
    config.url = `${originalUrl}${separator}_t=${Date.now()}`;

    // Log request details
    console.log("API Request:", config.method?.toUpperCase(), config.url);

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Log success
    console.log("API Response:", response.status, response.config.url);

    // Validate response structure - we expect objects with certain properties
    if (!response.data || typeof response.data !== "object") {
      console.warn("Invalid response format:", response.data);
      // Convert to empty object to prevent errors
      response.data = {};
    }

    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        "Response Error:",
        error.response.status,
        error.response.data
      );

      // Add custom handling for specific status codes
      if (error.response.status === 401) {
        // Handle auth errors
        console.warn("Authentication error - user may need to log in");
      } else if (error.response.status === 429) {
        // Rate limiting
        console.warn("Rate limit exceeded - adding retry after header");
        // Could implement retry logic here
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request Error: No response received");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
