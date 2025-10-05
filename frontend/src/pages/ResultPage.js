import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: null };

  if (!results) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl text-center border border-red-300">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Analysis Failed</h2>
          <p className="text-gray-700 text-lg">We couldn't retrieve the analysis results. Please ensure all data was uploaded correctly and try again.</p>
          <button onClick={() => navigate('/details')} className="mt-8 text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 font-bold rounded-lg text-lg px-8 py-3 transition-all">
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  const scoreValue = parseFloat(results.finalScore);
  let scoreColorClass = 'text-green-600'; // Low risk
  if (scoreValue > 20) scoreColorClass = 'text-orange-500'; // Moderate risk
  if (scoreValue > 50) scoreColorClass = 'text-red-600'; // High risk

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border border-purple-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Your NeuroAssess Report</h2>
        <p className="text-center text-gray-600 mb-8">Detailed insights from your multi-modal evaluation.</p>
        
        <div className="text-center my-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-inner border border-indigo-200">
          <p className="text-2xl font-semibold text-gray-700">Overall Alzheimer's Risk Score</p>
          <p className={`text-8xl font-extrabold ${scoreColorClass} mt-4`}>{results.finalScore}%</p>
          <p className="text-lg text-gray-600 mt-2">Based on comprehensive multi-modal assessment.</p>
        </div>

        <div className="space-y-6 mt-10">
          <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Detailed Breakdown:</h3>
          
          <div className="flex items-center justify-between p-5 bg-blue-50 rounded-xl shadow-sm border border-blue-200">
            <span className="text-lg font-medium text-blue-800 flex items-center">
              <span className="text-3xl mr-3">🧠</span> Cognitive Assessment
            </span>
            <span className="text-2xl font-bold text-blue-600">{results.quiz}%</span>
          </div>
          
          <div className="flex items-center justify-between p-5 bg-green-50 rounded-xl shadow-sm border border-green-200">
            <span className="text-lg font-medium text-green-800 flex items-center">
              <span className="text-3xl mr-3">🖼️</span> MRI Scan Analysis
            </span>
            <span className="text-2xl font-bold text-green-600">{results.mri}%</span>
          </div>
          
          <div className="flex items-center justify-between p-5 bg-yellow-50 rounded-xl shadow-sm border border-yellow-200">
            <span className="text-lg font-medium text-yellow-800 flex items-center">
              <span className="text-3xl mr-3">🎙️</span> Voice Pattern Analysis
            </span>
            <span className="text-2xl font-bold text-yellow-600">{results.voice}%</span>
          </div>
        </div>

        <div className="mt-12 text-center p-6 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-800 italic">
            <strong>Disclaimer:</strong> This application is for informational purposes only and is not intended for medical diagnosis or treatment. Please consult a qualified healthcare professional for any health concerns.
          </p>
          <button onClick={() => navigate('/details')} className="mt-8 w-full md:w-auto text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 font-bold rounded-lg text-lg px-8 py-3 transition-all duration-300 ease-in-out">
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;