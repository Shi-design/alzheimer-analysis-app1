import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Save the name in localStorage so other pages can use it
    localStorage.setItem('participantName', name);
    // Go to the next step (the DetailsPage)
    navigate('/details'); 
  };

  return (
    // This is the outer container that centers everything
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4">
      
      {/* This is the white card with the 2-column grid */}
      <div className="w-full max-w-6xl bg-white/90 rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* ----- 1. LEFT PANEL (Image & Title) ----- */}
        {/* This is the part from your screenshot with the image */}
        <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-indigo-800 to-purple-900 text-white text-center">
          
          {/* Here is your image! 
            The path '/images/neuro-art.jpg' works because the 'images' folder 
            is inside the 'public' directory.
          */}
          <img 
            src="/images/neuro-art.jpg" 
            alt="NeuroAssess Art" 
            className="w-full max-w-sm rounded-xl mb-8" 
          />
          <h1 className="text-4xl font-extrabold">NeuroAssess</h1>
          <p className="text-xl font-light text-purple-200">
            Early Detection Platform
          </p>
        </div>

        {/* ----- 2. RIGHT PANEL (The Form) ----- */}
        {/* This is the part with the form, but simplified to only ask for a name */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
            Welcome!
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Enter your name to begin the assessment.
          </p>

          <form onSubmit={onSubmit} className="space-y-6 max-w-sm mx-auto w-full">
            <input 
              name="name" 
              type="text" 
              value={name} 
              // This is the corrected line
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your Name" 
              required 
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg" 
            />
            <button 
              type="submit" 
              className="w-full py-3 bg-indigo-700 text-white font-bold rounded-lg hover:bg-indigo-800 transition-colors disabled:bg-gray-400" 
              disabled={loading}
            >
              {loading ? 'Starting…' : 'Start Assessment'}
            </button>
          </form>
          {/* We have removed the "Sign In" link */}
        </div>

      </div>
    </div>
  );
}
