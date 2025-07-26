import { apiClient } from './client';

export const authAPI = {
  register: (userData) => apiClient.post('/api/v1/register/', userData),
  verifyEmail: (otpData) => apiClient.post('/api/v1/verify-email/', otpData),
  resendOTP: (email) => apiClient.post('/api/v1/resend-otp/', { email }),
  login: (credentials) => apiClient.post('/api/v1/login/', credentials),
  logout: () => apiClient.post('/api/v1/logout/'),
  refreshToken: (refreshToken) => apiClient.post('/api/v1/token/refresh/', { refresh: refreshToken }),
  getProfile: () => apiClient.get('/api/v1/profile/'),
  updateProfile: (profileData) => apiClient.put('/api/v1/profile/', profileData),
  requestPasswordReset: (email) => apiClient.post('/api/v1/password-reset/', { email }),
  confirmPasswordReset: (resetData) => apiClient.post('/api/v1/password-reset/confirm/', resetData),
  changePassword: (passwordData) => apiClient.post('/api/v1/change-password/', passwordData),
  getCountries: () => apiClient.get('/api/v1/countries/'),
  updateCurrency: (currencyData) => apiClient.put('/api/v1/currency/', currencyData),
  convertCurrency: (conversionData) => apiClient.get('/api/v1/convert/', conversionData),
};