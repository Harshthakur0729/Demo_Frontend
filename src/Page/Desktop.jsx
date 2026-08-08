import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Desktop() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Dashboard
          </h1>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
          </nav>
        </div>

        {/* Profile & Logout Action */}
        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium px-4 py-2 rounded-xl transition border border-gray-700"
          >
            <svg
              className="w-4 h-4 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800 text-sm font-medium px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Desktop Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to Workspace
          </h2>
          <p className="text-gray-400 text-sm">
            You are authenticated and viewing the protected Desktop page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Status
            </h3>
            <p className="text-lg font-bold text-emerald-400">Active Session</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Route Access
            </h3>
            <p className="text-lg font-bold text-white">Protected Route</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Storage Mode
            </h3>
            <p className="text-lg font-bold text-indigo-400">JWT Token Saved</p>
          </div>
        </div>
      </main>
    </div>
  );
}