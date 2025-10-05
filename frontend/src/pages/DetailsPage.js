import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DetailsPage = () => {
  const [details, setDetails] = useState({ age: '', gender: '' });
  const navigate = useNavigate();

  const onChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('User Details:', details);
    navigate('/quiz', { state: { personalDetails: details } });
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
        
        {/* === Left Column: Informational Branding === */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
          <div className="text-6xl mb-6">📝</div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Assessment Setup</h1>
          <p className="text-lg font-light text-indigo-200">
            Your anonymous information helps us tailor the cognitive assessment to provide the most accurate insights.
          </p>
          <div className="mt-8 border-t border-indigo-500 w-full max-w-xs"></div>
          <p className="mt-8 text-sm text-indigo-300">
            All data is handled with strict confidentiality according to privacy regulations.
          </p>
        </div>

        {/* === Right Column: Personal Details Form === */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Personal Information</h2>
            <p className="text-gray-600">Tell us a bit about yourself to begin.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6 max-w-sm mx-auto lg:mx-0">
            <div>
              <label htmlFor="age" className="block text-base font-medium text-gray-700">Your Age</label>
              <input 
                type="number" 
                name="age" 
                onChange={onChange} 
                required 
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 65"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-base font-medium text-gray-700">Gender</label>
              <select 
                name="gender" 
                onChange={onChange} 
                required 
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all"
              >
                Proceed to Cognitive Quiz
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default DetailsPage; 