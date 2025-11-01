import axios from 'axios';

// This console.log runs at *build time*.
// You can check your Render *build log* to see what this value was when it was built.
console.log('BUILD-TIME API_URL =', process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // e.g. https://alz-backend-xxxx.onrender.com
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ---- Auth endpoints removed ----
// We've removed signupUser and loginUser since they are no longer needed.

// ---- Analysis endpoint (multipart) ----
// We keep this function for your UploadPage
export const uploadAnalysisImage = (formData) =>
  api.post('/api/analysis/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default api;

