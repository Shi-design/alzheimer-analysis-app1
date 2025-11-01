import axios from 'axios';

// This console.log runs at *build time*.
// You can check your Render *build log* to see what this value was when it was built.
console.log('BUILD-TIME API_URL =', process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // e.g. https://alz-backend-xxxx.onrender.com
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ---- Auth endpoints (must match backend) ----
export const signupUser = (payload) => api.post('/api/auth/signup', payload);
export const loginUser = (payload) => api.post('/api/auth/login', payload);

// ---- Analysis endpoint (multipart) ----
export const uploadAnalysisImage = (formData) =>
  api.post('/api/analysis/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default api;