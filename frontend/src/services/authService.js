import axios from 'axios';

// Create a central API client
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

/**
 * Sends a login request to the server.
 * @param {object} credentials - { email, password }
 * @returns The server response data, including the token.
 */
export const loginUser = async (credentials) => {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
};

/**
 * Sends a signup request to the server.
 * @param {object} userData - { name, email, password }
 * @returns The server response data, including the token.
 */
export const signupUser = async (userData) => {
  const response = await apiClient.post('/api/auth/signup', userData);
  return response.data;
};