import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Dedicated Axios instance with default settings
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default function Login() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', formData);

            if (response.data?.success && response.data?.data) {
                // LocalStorage update
                localStorage.setItem("userToken", response.data.data);

                // Force full reload & navigate to instant sync cookies/auth state
                window.location.href = '/';
            } else {
                setError(response.data?.message || 'Login failed. Please try again.');
            }

        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || `Error ${err.response.status}: Invalid credentials`);
            } else if (err.request) {
                setError('Network Error: Server unreachable');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100 px-4">
            <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-400">
                        Sign in with your Email or Username
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-950/50 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            name="identifier"
                            required
                            value={formData.identifier}
                            onChange={handleChange}
                            placeholder="Username or email address"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-500 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 text-sm cursor-pointer"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                {/* Register Navigation Link */}
                <div className="text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline transition"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}