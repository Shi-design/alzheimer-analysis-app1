import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration successful! Please log in.");
      navigate("/"); // back to login page
    } catch (err) {
      alert("Error: " + (err.response?.data?.msg || "Please try again."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden grid grid-cols-2">

        {/* === LEFT SIDE (Photo + Branding) === */}
        <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-indigo-800 to-purple-900 text-white text-center">
          <img
            src="/images/neuro-art.jpg"
            alt="NeuroAssess Art"
            className="w-full max-w-sm rounded-lg shadow-xl mb-8"
          />
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            NeuroAssess
          </h1>
          <p className="text-xl font-light text-purple-200">
            Advanced Early Detection Platform
          </p>
        </div>

        {/* === RIGHT SIDE (Signup Form) === */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600 text-lg">
              Join NeuroAssess to start your journey.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6 max-w-sm mx-auto lg:mx-0">
            <div>
              <label
                htmlFor="name"
                className="block text-base font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                onChange={onChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                onChange={onChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={onChange}
                minLength="6"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Minimum 6 characters"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="text-center text-gray-500 mt-8 text-sm max-w-sm mx-auto lg:mx-0">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
