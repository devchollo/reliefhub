// src/pages/Profile.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Mail, Phone, Save, AlertCircle, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateUser, changePassword } = useAuth();
  const { success, error: showError } = useNotification();
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    userType: user?.userType || 'individual'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateUser(formData);
    setLoading(false);

    if (result.success) {
      success('Profile updated successfully!');
      setEditing(false);
    } else {
      showError(result.error || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    setLoading(false);

    if (result.success) {
      success('Password changed successfully!');
      setChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      showError(result.error || 'Failed to change password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Verification Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Email</span>
              </div>
              {user?.isEmailVerified ? (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-yellow-600">
                  <AlertCircle className="w-4 h-4" />
                  Not Verified
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Phone</span>
              </div>
              {user?.isPhoneVerified ? (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-yellow-600">
                  <AlertCircle className="w-4 h-4" />
                  Not Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Profile Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
              >
                Edit
              </button>
            )}
          </div>

          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="individual">Individual</option>
                  <option value="organization">Organization/NGO</option>
                  <option value="company">Company</option>
                  <option value="government">Government/LGU</option>
                </select>
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: user?.name || '',
                      phone: user?.phone || '',
                      userType: user?.userType || 'individual'
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Change Password</h2>
            {!changingPassword && (
              <button
                onClick={() => setChangingPassword(true)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
              >
                Change
              </button>
            )}
          </div>

          {changingPassword ? (
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600">••••••••</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;