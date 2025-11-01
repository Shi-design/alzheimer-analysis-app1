import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// I've added the .js extension here as a safeguard for Linux build systems.
import { signupUser } from '../api.js';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Use state for errors
  const [success, setSuccess] = useState(''); // Use state for success
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await signupUser(form);
      console.log('Signup OK:', data);
      setSuccess('✅ Registration successful! Please log in.');
      // Don't navigate immediately, let them see the success message.
      setTimeout(() => {
        navigate('/'); // go to login after 2 seconds
      }, 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        'Signup failed.';
      console.error('Signup Error:', err?.response?.data || err);
      setError('❌ ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-6xl bg-white/90 rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-indigo-800 to-purple-900 text-white text-center">
          <img
            src="https://placehold.co/400x300/6366f1/ffffff?text=NeuroAssess"
            alt="NeuroAssess"
            className="w-full max-w-sm rounded-xl mb-8"
          />
          <h1 className="text-4xl font-extrabold">NeuroAssess</h1>
          <p className="text-xl text-purple-200">Early Detection Platform</p>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
            Create Your Account
          </h2>
          <form onSubmit={onSubmit} className="space-y-6 max-w-sm mx-auto w-full">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Full Name"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            {/* Display success or error message */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-700 text-white font-bold rounded-lg hover:bg-indigo-800 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Signing up…' : 'Sign Up'}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/" className="text-indigo-600 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
