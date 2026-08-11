import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const navigate = useNavigate();

  // State Management
  const [profileData, setProfileData] = useState({ username: '', email: '' });
  const [editData, setEditData] = useState({ username: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const API = import.meta.env.VITE_API_BASE_URL;

  // Helper Function: LocalStorage se token nikal kar Auth Header banana
  const getAuthHeaders = () => {
    // Agar aapne token 'userToken' ya 'jwtToken' kisi bhi naam se save kiya ho
    const token = localStorage.getItem('userToken') || localStorage.getItem('jwtToken') || localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. Fetch Profile Data (GET)
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API}/users/profile`, {
        headers: getAuthHeaders(), // Authorization Header Added
        withCredentials: true,
      });
      console.log("Profile Fetch Response:", response);

      const data = response.data?.data || response.data;
      setProfileData({ username: data.username || '', email: data.email || '' });
      setEditData({ username: data.username || '', email: data.email || '' });

    } catch (err) {
      handleError(err, 'Failed to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Update Profile Data (PUT)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await axios.put(`${API}/users/profile`, editData, {
        headers: getAuthHeaders(), // Authorization Header Added
        withCredentials: true,
      });

      const updated = response.data?.data || response.data;
      setProfileData({
        username: updated.username || editData.username,
        email: updated.email || editData.email,
      });
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      handleError(err, 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  // 3. Delete Profile (DELETE)
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    setDeleting(true);
    setError('');

    try {
      await axios.delete(`${API}/users/profile`, {
        headers: getAuthHeaders(), // Authorization Header Added
        withCredentials: true,
      });

      // Clear local auth tokens and redirect to login
      localStorage.removeItem('userToken');
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    } catch (err) {
      handleError(err, 'Failed to delete account.');
      setDeleting(false);
    }
  };

  // Helper for Error Formatting
  const handleError = (err, fallbackMsg) => {
    if (err.response) {
      setError(err.response.data?.message || `HTTP Error ${err.response.status}: ${fallbackMsg}`);
    } else if (err.request) {
      setError('Network Error: Server is unreachable.');
    } else {
      setError('An unexpected error occurred.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-sm font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">User Profile</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage your personal account settings</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700 transition"
          >
            Back
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-950/50 border border-emerald-800 text-emerald-400 px-4 py-3 rounded-xl text-sm">
            {successMsg}
          </div>
        )}

        {/* Profile Details / Edit Form */}
        {!isEditing ? (
          /* View Mode */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Username
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-800 text-gray-200 rounded-xl text-sm font-medium">
                {profileData.username || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Email Address
              </label>
              <div className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-800 text-gray-200 rounded-xl text-sm font-medium">
                {profileData.email || 'N/A'}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800/60 font-semibold py-2.5 px-4 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={editData.username}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
              />
            </div>

            {/* Edit Actions */}
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={updating}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditData(profileData);
                }}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 font-semibold py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}