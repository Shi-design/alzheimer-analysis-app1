import axios from "axios";

// ✅ Base URL — matches your backend route in server.js
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api/main/auth",
});

/**
 * Registers (signs up) a new user.
 * @param {object} userData - { name, email, password }
 * @returns {Promise<object>} The response data from backend.
 */
export const signupUser = async (userData) => {
  try {
    const response = await apiClient.post("/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Logs in an existing user.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} The response data from backend (e.g., token).
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Optional helper: Adds Authorization header with stored JWT token.
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
