import axios from "axios";
import { logout } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add Authorization header before each request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(user);
    if (user) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized access detected. Redirecting to login page.");

      // Clear user data from localStorage and redirect to login
      logout();

      // The logout function already handles the redirect, but we can force it here as well
      // window.location.href = "/auth/signin";
    }

    return Promise.reject(error);
  }
);

export default api;
