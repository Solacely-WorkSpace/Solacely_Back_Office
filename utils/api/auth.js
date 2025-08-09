import { apiClient } from './client';

export const authAPI = {
  register: (userData) => apiClient.post('/api/v1/register/', userData),
  verifyEmail: (otpData) => apiClient.post('/api/v1/verify-email/', otpData),
  resendOTP: (email) => apiClient.post('/api/v1/resend-otp/', { email }),
  login: (credentials) => apiClient.post('/api/v1/admin/login/', credentials),
  logout: () => {
    const refreshToken = localStorage.getItem('refresh_token');
    return apiClient.post('/api/v1/logout/', { refresh: refreshToken });
  },
  refreshToken: (refreshToken) => apiClient.post('/api/v1/admin/token/refresh/', { refresh: refreshToken }),
  verify2FA: (data) => apiClient.post('/api/v1/admin/verify-2fa/', data),
  getProfile: () => apiClient.get('/api/v1/profile/'),
  updateProfile: (profileData) => apiClient.put('/api/v1/profile/', profileData),
  requestPasswordReset: (email) => apiClient.post('/api/v1/password-reset/', { email }),
  confirmPasswordReset: (resetData) => apiClient.post('/api/v1/password-reset/confirm/', resetData),
  changePassword: (passwordData) => apiClient.post('/api/v1/change-password/', passwordData),
  getCountries: () => apiClient.get('/api/v1/countries/'),
  updateCurrency: (currencyData) => apiClient.patch('/api/v1/currency/update/', currencyData),
  convertCurrency: (conversionData) => apiClient.post('/api/v1/currency/convert/', conversionData),
};