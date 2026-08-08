import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default function Register() {
    const navigate = useNavigate();
    
    // 1. Updated state key from 'name' to 'username'
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
            const response = await api.post('/auth/register', formData);
            console.log('Registration Successful:', response.data);

            navigate('/login');
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || `Error ${err.response.status}: Registration failed.`);
            } else if (err.request) {
                setError('Network Error: Unable to reach the server.');
            } else {
                setError('An unexpected error occurred.');
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
                        Create an Account
                    </h2>
                    <p className="text-sm text-gray-400">
                        Sign up to get started with your account
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-950/50 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder-gray-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
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
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 text-sm mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                {/* Login Link */}
                <div className="text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <a
                        href="/login"
                        className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline transition"
                    >
                        Sign in
                    </a>
                </div>
            </div>
        </div>
    );
}