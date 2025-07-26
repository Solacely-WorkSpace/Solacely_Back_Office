"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/utils/api/auth';
import { toast } from 'sonner';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userData = await authAPI.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      toast.success('Registration successful! Please check your email for verification.');
      return response;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const verifyEmail = async (otpData) => {
    try {
      const response = await authAPI.verifyEmail(otpData);
      toast.success('Email verified successfully!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Email verification failed');
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authAPI.updateProfile(profileData);
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      return updatedUser;
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
      throw error;
    }
  };

  // Add these methods to the AuthProvider component:
const requestPasswordReset = async (email) => {
  try {
    await authAPI.requestPasswordReset(email);
    toast.success('Password reset email sent!');
  } catch (error) {
    toast.error(error.message || 'Failed to send reset email');
    throw error;
  }
};

const resendOTP = async (email) => {
  try {
    await authAPI.resendOTP(email);
    toast.success('OTP sent successfully!');
  } catch (error) {
    toast.error(error.message || 'Failed to resend OTP');
    throw error;
  }
};

// Add to the value object:
const value = {
  user,
  isAuthenticated,
  loading,
  register,
  verifyEmail,
  login,
  logout,
  updateProfile,
  checkAuthStatus,
  requestPasswordReset,
  resendOTP,
};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};