import axios from 'axios';

// Create an instance of axios with the base URL from your .env file
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- AUTHENTICATION CALLS ---

// Function to handle user login
export const loginUser = (credentials) => {
  return apiClient.post('/api/auth/login', credentials);
};

// Function to handle user signup
export const signupUser = (userData) => {
  return apiClient.post('/api/auth/signup', userData);
};

// --- ANALYSIS CALLS ---

// Function to upload an image for analysis
export const uploadAnalysisImage = (formData) => {
  // For file uploads, we need to change the header
  return apiClient.post('/api/analysis/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};