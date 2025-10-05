import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 shadow-xl text-white">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between">
        <div className="flex flex-col items-center sm:items-start mb-2 sm:mb-0">
          <Link to="/" className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-green-300 via-blue-300 to-indigo-300 text-transparent bg-clip-text">
            NeuroAssess
          </Link>
          <span className="text-sm sm:text-lg font-light mt-1 opacity-90">
            Advanced Early Alzheimer's Detection Platform
          </span>
        </div>
        {/* You can add actual navigation links here if needed */}
      </div>
    </nav>
  );
};

export default Navbar;