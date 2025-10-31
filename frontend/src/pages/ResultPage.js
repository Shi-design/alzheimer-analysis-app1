import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || {};

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-600">
          No results found. Please complete an assessment first.
        </h2>
      </div>
    );
  }

  const { cognitive, mri, voice, overall_score } = results;

  const formatPercent = (val) => `${parseFloat(val).toFixed(2)}%`;

  const getColor = (score) => {
    if (score < 35) return "text-green-600";
    if (score < 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Your NeuroAssess Report
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Detailed insights from your multi-modal evaluation.
        </p>

        {/* Overall Score Section */}
        <div className="text-center bg-indigo-50 rounded-xl p-6 mb-8 border border-indigo-100">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Overall Alzheimer’s Risk Score
          </h2>
          <p className={`text-5xl font-extrabold ${getColor(overall_score)}`}>
            {formatPercent(overall_score)}
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Based on comprehensive multi-modal assessment.
          </p>
        </div>

        {/* Detailed Breakdown */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Breakdown:</h3>

        <div className="space-y-4">
          {/* Cognitive */}
          <div className="p-4 rounded-lg border-l-8 border-blue-400 bg-blue-50">
            <p className="text-md font-semibold text-blue-800">
              🧠 Cognitive Assessment:
              <span className="float-right text-gray-700">
                {formatPercent(cognitive)}
              </span>
            </p>
          </div>

          {/* MRI */}
          <div className="p-4 rounded-lg border-l-8 border-green-400 bg-green-50">
            <p className="text-md font-semibold text-green-800">
              🧩 MRI Scan Analysis:
              <span className="float-right text-gray-700">
                {formatPercent(mri)}
              </span>
            </p>
          </div>

          {/* Voice */}
          <div className="p-4 rounded-lg border-l-8 border-yellow-400 bg-yellow-50">
            <p className="text-md font-semibold text-yellow-800">
              🎤 Voice Pattern Analysis:
              <span className="float-right text-gray-700">
                {formatPercent(voice)}
              </span>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 text-sm italic">
            Disclaimer: This application is for informational purposes only and
            is not intended for medical diagnosis or treatment. Please consult a
            qualified healthcare professional for any health concerns.
          </p>
        </div>

        {/* Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
