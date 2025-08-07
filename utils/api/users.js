import { apiClient } from './client';

export const usersAPI = {
  // Get all users (admin only)
  getUsers: async () => {
    return await apiClient.get('/api/v1/admin/users/');
  },

  // Get user by ID
  getUser: async (id) => {
    return await apiClient.get(`/api/v1/users/${id}/`);
  },

  // Update user
  updateUser: async (id, userData) => {
    return await apiClient.put(`/api/v1/users/${id}/`, userData);
  },

  // Delete user
  deleteUser: async (id) => {
    return await apiClient.delete(`/api/v1/users/${id}/`);
  },

  // Get user profile
  getUserProfile: async () => {
    return await apiClient.get('/api/v1/profile/');
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    return await apiClient.patch('/api/v1/profile/', profileData);
  },
  
  // Get user activities (admin only)
  getUserActivities: async () => {
    return await apiClient.get('/api/v1/admin/user-activities/');
  }
};