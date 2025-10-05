import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadPage = () => {
  const [mriFile, setMriFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null); // New state for audio file
  const [status, setStatus] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { personalDetails, quizScore } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mriFile || !audioFile) {
      alert('Please upload both an MRI scan and an audio file.');
      return;
    }
    setStatus('Analyzing...');
    
    const formData = new FormData();
    formData.append('mriScan', mriFile);
    formData.append('voiceRecording', audioFile); // Use the uploaded audio file
    formData.append('quizScore', quizScore);
    
    try {
      const res = await axios.post('http://localhost:5000/api/analysis/submit', formData);
      navigate('/results', { state: { results: res.data.results } });
    } catch (err) {
      setStatus('Analysis failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border border-yellow-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Upload Medical Data</h2>
        <p className="text-center text-gray-600 mb-8">Provide your MRI scan and a pre-recorded voice sample for analysis.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* MRI Upload */}
          <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-100">
            <label className="block text-md font-semibold text-yellow-800 mb-2">1. Upload MRI Scan</label>
            <p className="text-sm text-gray-600 mb-4">Upload a clear MRI image (e.g., .jpg, .png) of the brain.</p>
            <input 
              type="file"
              accept="image/*"
              onChange={(e) => setMriFile(e.target.files[0])} 
              required 
              className="block w-full text-sm text-yellow-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 hover:file:bg-yellow-200"
            />
          </div>

          {/* === UPDATED SECTION: Audio File Upload === */}
          <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-100">
            <label className="block text-md font-semibold text-yellow-800 mb-2">2. Upload Voice Sample</label>
            <p className="text-sm text-gray-600 mb-4">Upload a pre-recorded audio file (e.g., .wav, .mp3).</p>
            <input 
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])} 
              required 
              className="block w-full text-sm text-yellow-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 hover:file:bg-yellow-200"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" disabled={!!status} className="w-full text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 font-bold rounded-lg text-lg px-5 py-3 transition-all">
              {status ? status : 'Get Analysis Results'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;