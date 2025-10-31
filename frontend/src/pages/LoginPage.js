import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      alert("✅ Login successful!");
      navigate("/details"); // 👈 redirects to your DetailsPage
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      alert("❌ " + (err.response?.data?.msg || "Login failed. Check credentials."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-6xl bg-white/90 rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-indigo-800 to-purple-900 text-white text-center">
          <img
            src="/images/neuro-art.jpg"
            alt="NeuroAssess"
            className="w-full max-w-sm rounded-xl mb-8"
          />
          <h1 className="text-4xl font-extrabold">NeuroAssess</h1>
          <p className="text-xl font-light text-purple-200">Early Detection Platform</p>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-lg mb-6">Sign in to continue.</p>

          <form onSubmit={onSubmit} className="space-y-6 max-w-sm mx-auto">
            <input
              type="email"
              name="email"
              onChange={onChange}
              placeholder="Email Address"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              name="password"
              onChange={onChange}
              placeholder="Password"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full py-3 bg-indigo-700 text-white font-bold rounded-lg"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Need an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
