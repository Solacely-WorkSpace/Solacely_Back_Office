import { apiClient } from './client';
import { walletAPI } from './wallet';

export const adminAPI = {
  // Dashboard Stats - Updated to match backend endpoints
  getDashboardStats: async () => {
    return await apiClient.get('/api/v1/admin/dashboard/stats/');
  },

  getWalletStats: async () => {
    return await apiClient.get('/api/v1/wallet/dashboard-stats/');
  },

  // Revenue calculation from rent payments
  getRevenueStats: async () => {
    try {
      // Use the monthly-revenue endpoint instead of rent-payments
      const response = await apiClient.get('/api/v1/wallet/monthly-revenue/');
      
      return {
        data: {
          total_revenue: response.data.total_revenue || 0,
          total_payments: 0, // This data isn't available from monthly-revenue
          pending_payments: 0 // This data isn't available from monthly-revenue
        }
      };
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      return { data: { total_revenue: 0, total_payments: 0, pending_payments: 0 } };
    }
  },

  // User Management
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/admin/users/${queryString ? `?${queryString}` : ''}`);
  },

  updateUserStatus: async (userId, status) => {
    return await apiClient.patch(`/api/v1/admin/users/${userId}/status/`, { status });
  },

  exportUsers: async (format = 'csv') => {
    return await apiClient.get(`/api/v1/admin/users/export/?format=${format}`);
  },

  getUserActivities: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/admin/user-activities/${queryString ? `?${queryString}` : ''}`);
  },

  // Partner Management
  getPartners: async () => {
    return await apiClient.get('/api/v1/admin/partners/');
  },

  createPartner: async (partnerData) => {
    return await apiClient.post('/api/v1/admin/partners/', partnerData);
  },

  updatePartner: async (partnerId, partnerData) => {
    return await apiClient.put(`/api/v1/admin/partners/${partnerId}/`, partnerData);
  },

  deletePartner: async (partnerId) => {
    return await apiClient.delete(`/api/v1/admin/partners/${partnerId}/`);
  },

  // Listing Management
  approveListing: async (listingId, approved) => {
    return await apiClient.post(`/api/v1/apart/listings/${listingId}/approve/`, { approved });
  },

  getPendingListings: async () => {
    return await apiClient.get('/api/v1/admin/listings/pending/');
  },

  // Get monthly revenue data
  getMonthlyRevenue: async (year = new Date().getFullYear()) => {
    try {
      // Add a console.log to debug the URL being called
      console.log(`Calling: /api/v1/wallet/monthly-revenue/?year=${year}`);
      const response = await apiClient.get(`/api/v1/wallet/monthly-revenue/?year=${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      // Return a more detailed error message
      console.log('Error details:', error.message);
      return { 
        monthly_data: [], 
        total_revenue: 0, 
        percentage_change: 0 
      };
    }
  }
};