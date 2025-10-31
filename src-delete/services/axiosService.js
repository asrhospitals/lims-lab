import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://asrlabs.asrhospitalindia.in/lims",
  timeout: 120000, // 2 minutes timeout
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios response error:", error.response || error);

    // Optional: custom message for 504
    if (error.response?.status === 504) {
      error.customMessage = "Server timed out. Please try again later.";
    }

    return Promise.reject(error);
  }
);

export default api;
