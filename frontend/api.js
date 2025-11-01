// src/api.js
import axios from 'axios';

// 🔎 See it in the browser console after deploy
console.log('REACT_APP_API_URL =', process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // e.g. https://alz-backend-xxxx.onrender.com
  headers: { 'Content-Type': 'application/json' },
  // If you don't use cookies, keep this false
  withCredentials: false,
});

// ---- Auth endpoints (must match backend) ----
export const signupUser = (payload) => api.post('/api/auth/signup', payload);
export const loginUser  = (payload) => api.post('/api/auth/login', payload);

// ---- Analysis endpoint (multipart) ----
export const uploadAnalysisImage = (formData) =>
  api.post('/api/analysis/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default api;
