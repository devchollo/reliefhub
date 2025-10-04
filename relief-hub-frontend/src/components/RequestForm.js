import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RequestForm = ({ onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    type: 'food',
    message: '',
    lat: '',
    lng: '',
    address: '',
    gcashNumber: '',
    bankAccount: '',
    donationGoal: ''
  });

  const requestTypes = [
    { value: 'food', label: 'Food', icon: '🍲' },
    { value: 'water', label: 'Water', icon: '💧' },
    { value: 'shelter', label: 'Shelter', icon: '🏠' },
    { value: 'medical', label: 'Medical', icon: '⚕️' },
    { value: 'money', label: 'Financial Aid', icon: '💰' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            lat: latitude.toString(),
            lng: longitude.toString()
          }));

          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data.display_name) {
              setFormData(prev => ({
                ...prev,
                address: data.display_name
              }));
            }
          } catch (err) {
            console.error('Error getting address:', err);
          }
          
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enter manually.');
          setLocationLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.phone || !formData.type || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.lat || !formData.lng) {
      setError('Please provide your location');
      return;
    }

    // Additional validation for money type
    if (formData.type === 'money') {
      if (!formData.gcashNumber && !formData.bankAccount) {
        setError('Please provide at least GCash number or bank account for financial aid requests');
        return;
      }
      if (formData.donationGoal && isNaN(formData.donationGoal)) {
        setError('Please enter a valid donation goal amount');
        return;
      }
    }

    try {
      setLoading(true);
      
      const requestData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        type: formData.type,
        message: formData.message,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        address: formData.address
      };

      // Add money-specific fields
      if (formData.type === 'money') {
        if (formData.gcashNumber) requestData.gcashNumber = formData.gcashNumber;
        if (formData.bankAccount) requestData.bankAccount = formData.bankAccount;
        if (formData.donationGoal) requestData.donationGoal = parseFloat(formData.donationGoal);
      }

      const response = await axios.post('/api/requests', requestData);

      if (response.data.success) {
        alert('Request submitted successfully! Help is on the way.');
        if (onSuccess) onSuccess(response.data.data);
        if (onClose) onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full h-[90vh] flex flex-col">
      
      {/* Header */}
      <div className="flex-shrink-0 sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg z-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Request Help</h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill out the form below and help will be on the way
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Scrollable Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Dela Cruz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+63 912 345 6789"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="juan@example.com"
              />
            </div>
          </div>
        </div>

        {/* Request Type */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What do you need? <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {requestTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: type.value })}
                className={`p-4 border-2 rounded-lg text-center transition ${
                  formData.type === type.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Request Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe your situation <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Please describe what you need and your current situation..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Be specific about what you need and why. This helps volunteers understand how to help you.
          </p>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Location <span className="text-red-500">*</span>
          </h3>
          
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="mb-4 w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {locationLoading ? 'Getting location...' : '📍 Use My Current Location'}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lat"
                required
                value={formData.lat}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10.3157"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lng"
                required
                value={formData.lng}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123.8854"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street, Barangay, City, Province"
            />
          </div>
        </div>

        {/* Financial Aid Additional Fields */}
        {formData.type === 'money' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Financial Aid Details
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₱</span>
                <input
                  type="number"
                  name="donationGoal"
                  value={formData.donationGoal}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="10000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GCash Number
              </label>
              <input
                type="text"
                name="gcashNumber"
                value={formData.gcashNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="09123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Account Details
              </label>
              <textarea
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Bank Name, Account Number, Account Name"
              />
            </div>

            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Please provide at least one payment method (GCash or Bank Account)
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>

        {!isAuthenticated && (
          <p className="text-sm text-gray-600 text-center pb-4">
            💡 <a href="/register" className="text-blue-600 hover:underline">Create an account</a> to track your requests and get faster help
          </p>
        )}
      </form>
    </div>
  </div>
);

};

export default RequestForm;