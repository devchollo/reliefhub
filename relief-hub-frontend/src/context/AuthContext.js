// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Utility to safely parse JSON from localStorage
const safeParse = (str) => {
  if (!str || str === 'undefined' || str === 'null') return null;
  try {
    return JSON.parse(str);
  } catch (err) {
    console.warn('Saved user corrupted, clearing...', err);
    localStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // Helper to get token and set headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Helper to safely update user state and localStorage
  const updateLocalUser = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  // Load user from localStorage and verify token
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const parsedUser = safeParse(localStorage.getItem('user'));
      setUser(parsedUser);

      if (token) {
        try {
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          updateLocalUser(response.data.data);
        } catch (err) {
          console.error('Token verification failed:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [API_URL]);

  // Generic request wrapper for protected routes
  const protectedRequest = async (method, url, data) => {
    try {
      const response = await axios({ method, url: `${API_URL}${url}`, data, headers: getAuthHeaders() });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Request failed';
      throw new Error(message);
    }
  };

  // ---------------- Auth Actions ---------------- //

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = data;
      localStorage.setItem('token', token);
      updateLocalUser(user);
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = data;
      localStorage.setItem('token', token);
      updateLocalUser(user);
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const updateUser = async (updates) => {
    try {
      setLoading(true);
      const data = await protectedRequest('put', '/users/me', { updates });
      updateLocalUser(data.data);
      return { success: true, user: data.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      await protectedRequest('post', '/auth/verify-email', { token });
      const updated = await protectedRequest('get', '/users/me');
      updateLocalUser(updated.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyPhone = async (code) => {
    try {
      setLoading(true);
      await protectedRequest('post', '/auth/verify-phone', { userId: user?.id, code });
      const updated = await protectedRequest('get', '/users/me');
      updateLocalUser(updated.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resendPhoneVerification = async () => {
    try {
      await protectedRequest('post', '/auth/resend-phone-verification', { userId: user?.id });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Request failed' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Reset failed' };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await protectedRequest('put', '/users/change-password', { currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Context Value ---------------- //

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    verifyEmail,
    verifyPhone,
    resendPhoneVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
