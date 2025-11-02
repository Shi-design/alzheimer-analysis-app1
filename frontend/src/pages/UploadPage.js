// frontend/src/pages/UploadPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Decide API base once, at module load
const API_BASE =
  // CRA build-time var (Render -> REACT_APP_API_URL)
  process.env.REACT_APP_API_URL ||
  // Vite fallback if you ever switch
  (import.meta?.env?.VITE_API_BASE) ||
  // If running on Render (production) and env var missing, hardcode backend URL
  (typeof window !== "undefined" &&
  window.location.hostname.includes("onrender.com")
    ? "https://alz-backend-drxj.onrender.com"
    : "http://localhost:5000"); // local dev

const UploadPage = () => {
  const [mriFile, setMriFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [status, setStatus] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const quizScore = location.state?.quizScore ?? 0;

  // Optional: warm up ML API when page loads (harmless if already warm)
  useEffect(() => {
    axios.get(`${API_BASE}/ping-ml`, { timeout: 12000 }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mriFile || !audioFile) {
      alert("Please upload both MRI and voice files.");
      return;
    }

    setStatus("Warming up service...");
    try {
      await axios.get(`${API_BASE}/ping-ml`, { timeout: 12000 });
    } catch {
      // not fatal; continue anyway
    }

    setStatus("Analyzing...");
    try {
      const formData = new FormData();
      formData.append("mri", mriFile);
      formData.append("voice", audioFile);
      formData.append("quizScore", quizScore);

      const url = `${API_BASE}/api/analysis/upload`;
      console.log("[Upload] POST", url);

      const response = await axios.post(url, formData, {
        // Let axios set the multipart boundary automatically
        timeout: 180000, // 3 minutes
        withCredentials: false,
      });

      console.log("✅ Analysis success:", response.data);

      // Accept either {results: {...}} or {result: {...}}
      const results = response.data?.results || response.data?.result;
      if (results) {
        navigate("/results", { state: { results } });
      } else {
        alert("Unexpected response from server.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.details ||
        err.message ||
        "Network error";
      console.error("❌ Upload/analysis error:", err.response?.status, msg);
      alert(`Analysis failed: ${msg}`);
    } finally {
      setStatus("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Upload Medical Data
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Provide your MRI scan and a pre-recorded voice sample for analysis.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* MRI Upload */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <label className="block text-md font-semibold text-blue-800 mb-2">
              1. Upload MRI Scan
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Upload a clear MRI image (e.g., .jpg, .png).
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMriFile(e.target.files?.[0] || null)}
              required
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 hover:file:bg-blue-200 cursor-pointer"
            />
          </div>

          {/* Audio Upload */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <label className="block text-md font-semibold text-green-800 mb-2">
              2. Upload Voice Sample
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Upload a pre-recorded audio file (e.g., .wav, .mp3).
            </p>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              required
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 hover:file:bg-green-200 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={status === "Analyzing..." || status === "Warming up service..."}
              className="w-full text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 font-bold rounded-lg text-lg px-5 py-3 text-center transition-transform transform hover:scale-105"
            >
              {status || "Get Analysis Results"}
            </button>
            <p className="mt-2 text-xs text-gray-400 text-center">
              Using API: {API_BASE}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
