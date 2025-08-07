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
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [intermediateToken, setIntermediateToken] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);

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
      
      // Check if 2FA is required
      if (response['2fa_required']) {
        setIs2FARequired(true);
        setIntermediateToken(response.intermediate_token);
        setPendingEmail(response.email);
        toast.info('Please enter your 2FA code');
        return { requires2FA: true, email: response.email };
      }
      
      // No 2FA required, proceed with login
      localStorage.setItem('access_token', response.token || response.access);
      localStorage.setItem('refresh_token', response.refresh_token || response.refresh);
      
      // Also set a cookie for the middleware
      document.cookie = `access_token=${response.token || response.access}; path=/; max-age=${60*60*24*7}`; // 7 days
      
      const userData = await authAPI.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return { requires2FA: false, user: userData };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const verify2FA = async (code) => {
    try {
      if (!intermediateToken || !pendingEmail) {
        throw new Error('No intermediate token or email found');
      }
      
      const response = await authAPI.verify2FA({
        code,
        token: intermediateToken,
        email: pendingEmail
      });
      
      localStorage.setItem('access_token', response.token || response.access);
      localStorage.setItem('refresh_token', response.refresh_token || response.refresh);
      
      // Also set a cookie for the middleware
      document.cookie = `access_token=${response.token || response.access}; path=/; max-age=${60*60*24*7}`; // 7 days
      
      // Get user profile
      const userData = await authAPI.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      setIs2FARequired(false);
      setIntermediateToken(null);
      setPendingEmail(null);
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      toast.error(error.message || '2FA verification failed');
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
      
      // Also clear the cookie
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
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
    is2FARequired,
    verify2FA,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};