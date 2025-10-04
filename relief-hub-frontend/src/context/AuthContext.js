// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Optionally verify token with backend
          const response = await axios.get('/users/me');
          setUser(response.data.data);
          localStorage.setItem('user', JSON.stringify(response.data.data));
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
  }, []);

  // Register
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };
  

  // Update user profile
  const updateUser = async (updates) => {
    try {
      setLoading(true);
      const response = await axios.put('/users/me', updates);
      const updatedUser = response.data.data;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      await axios.post('/auth/verify-email', { token });
      
      // Refresh user data
      const response = await axios.get('/users/me');
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Verification failed';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Verify phone
  const verifyPhone = async (code) => {
    try {
      setLoading(true);
      await axios.post('/auth/verify-phone', { userId: user.id, code });
      
      // Refresh user data
      const response = await axios.get('/users/me');
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Verification failed';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Resend phone verification
  const resendPhoneVerification = async () => {
    try {
      await axios.post('/auth/resend-phone-verification', { userId: user.id });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resend code';
      return { success: false, error: errorMessage };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await axios.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Request failed';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await axios.post('/auth/reset-password', { token, newPassword });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Reset failed';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await axios.put('/users/change-password', { currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Password change failed';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

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
    isAuthenticated: !!user
  };
  
  

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

