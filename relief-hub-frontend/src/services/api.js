// src/services/api.js - Complete API Service Layer
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Request API
export const requestAPI = {
  // Get all requests with filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.lat && filters.lng && filters.radius) {
      params.append('lat', filters.lat);
      params.append('lng', filters.lng);
      params.append('radius', filters.radius);
    }
    
    const response = await axios.get(`${API_URL}/requests?${params}`);
    return response.data;
  },

  // Get single request
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/requests/${id}`);
    return response.data;
  },

  // Create new request
  create: async (requestData) => {
    const response = await axios.post(`${API_URL}/requests`, requestData);
    return response.data;
  },

  // Update request
  update: async (id, updates) => {
    const response = await axios.put(`${API_URL}/requests/${id}`, updates);
    return response.data;
  },

  // Delete request
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/requests/${id}`);
    return response.data;
  },

  // Mark as helped
  markAsHelped: async (id, notes) => {
    const response = await axios.post(`${API_URL}/requests/${id}/help`, { notes });
    return response.data;
  },

  // Update status
  updateStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/requests/${id}/status`, { status });
    return response.data;
  }
};

// Donation API
export const donationAPI = {
  // Create Stripe donation
  createStripe: async (donationData) => {
    const response = await axios.post(`${API_URL}/donations/stripe`, donationData);
    return response.data;
  },

  // Create GCash donation
  createGCash: async (donationData) => {
    const response = await axios.post(`${API_URL}/donations/gcash`, donationData);
    return response.data;
  },

  // Confirm GCash payment
  confirmGCash: async (donationId, referenceNumber) => {
    const response = await axios.post(`${API_URL}/donations/gcash/confirm`, {
      donationId,
      referenceNumber
    });
    return response.data;
  },

  // Get my donations
  getMyDonations: async () => {
    const response = await axios.get(`${API_URL}/donations/my-donations`);
    return response.data;
  },

  // Get donations for a request
  getForRequest: async (requestId) => {
    const response = await axios.get(`${API_URL}/donations/request/${requestId}`);
    return response.data;
  }
};

// User API
export const userAPI = {
  // Get current user
  getMe: async () => {
    const response = await axios.get(`${API_URL}/users/me`);
    return response.data;
  },

  // Update profile
  updateProfile: async (updates) => {
    const response = await axios.put(`${API_URL}/users/me`, updates);
    return response.data;
  },

  // Get dashboard data
  getDashboard: async () => {
    const response = await axios.get(`${API_URL}/users/dashboard`);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await axios.put(`${API_URL}/users/change-password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await axios.delete(`${API_URL}/users/me`);
    return response.data;
  }
};

// Leaderboard API
export const leaderboardAPI = {
  get: async (type = 'all') => {
    const params = type !== 'all' ? `?type=${type}` : '';
    const response = await axios.get(`${API_URL}/leaderboard${params}`);
    return response.data;
  },

  getMyRank: async () => {
    const response = await axios.get(`${API_URL}/leaderboard/my-rank`);
    return response.data;
  },

  getBadges: async () => {
    const response = await axios.get(`${API_URL}/leaderboard/badges`);
    return response.data;
  },

  downloadCertificate: async (badgeId) => {
    const response = await axios.get(`${API_URL}/leaderboard/badges/${badgeId}/certificate`, {
      responseType: 'blob'
    });
    return response.data;
  }
};


// Admin API (requires admin authentication)
export const adminAPI = {
  // Get dashboard stats
  getStats: async () => {
    const response = await axios.get(`${API_URL}/admin/stats`);
    return response.data;
  },

  // Get all users
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}/admin/users?${params}`);
    return response.data;
  },

  // Get user details
  getUserDetails: async (userId) => {
    const response = await axios.get(`${API_URL}/admin/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, updates) => {
    const response = await axios.put(`${API_URL}/admin/users/${userId}`, updates);
    return response.data;
  },

  // Get all requests
  getRequests: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}/admin/requests?${params}`);
    return response.data;
  },

  // Verify request
  verifyRequest: async (requestId) => {
    const response = await axios.post(`${API_URL}/admin/requests/${requestId}/verify`);
    return response.data;
  },

  // Delete request
  deleteRequest: async (requestId) => {
    const response = await axios.delete(`${API_URL}/admin/requests/${requestId}`);
    return response.data;
  },

  // Get all donations
  getDonations: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}/admin/donations?${params}`);
    return response.data;
  },

  // Refund donation
  refundDonation: async (donationId, reason) => {
    const response = await axios.post(`${API_URL}/admin/donations/${donationId}/refund`, {
      reason
    });
    return response.data;
  },

  // Generate reports
  getReports: async (startDate, endDate, reportType = 'summary') => {
    const params = new URLSearchParams({ startDate, endDate, reportType });
    const response = await axios.get(`${API_URL}/admin/reports?${params}`);
    return response.data;
  },

  // Bulk operations
  bulkAction: async (action, ids, updates = {}) => {
    const response = await axios.post(`${API_URL}/admin/bulk/${action}`, { ids, updates });
    return response.data;
  }
};

// Stripe Integration
export const stripeAPI = {
  // Initialize Stripe (call this on app load)
  loadStripe: async () => {
    if (window.Stripe) {
      return window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    }
    throw new Error('Stripe not loaded');
  }
};

// Google Maps Integration
export const mapsAPI = {
  // Geocode address to coordinates
  geocode: async (address) => {
    // This would typically call Google Geocoding API
    // For now, return mock data
    return { lat: 11.2440, lng: 125.0040 };
  },

  // Reverse geocode coordinates to address
  reverseGeocode: async (lat, lng) => {
    // This would typically call Google Geocoding API
    return { address: 'Tacloban City, Leyte, Philippines' };
  }
};

// Helper function to handle API errors
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      errors: error.response.data?.errors || []
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Network error. Please check your connection.',
      status: 0
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1
    };
  }
};

// Export all APIs
const apiService = {
  request: requestAPI,
  donation: donationAPI,
  user: userAPI,
  leaderboard: leaderboardAPI,
  admin: adminAPI,
  stripe: stripeAPI,
  maps: mapsAPI,
  handleError: handleAPIError
};

export default apiService;