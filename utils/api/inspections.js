import { apiClient } from './client';

export const inspectionsAPI = {
  // Credit Management
  getCredits: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/inspections/credits/${queryString ? `?${queryString}` : ''}`);
  },

  createCredit: async (creditData) => {
    return await apiClient.post('/api/v1/inspections/credits/', creditData);
  },

  updateCredit: async (creditId, creditData) => {
    return await apiClient.put(`/api/v1/inspections/credits/${creditId}/`, creditData);
  },

  // Booking Management
  getBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/inspections/bookings/${queryString ? `?${queryString}` : ''}`);
  },

  createBooking: async (bookingData) => {
    return await apiClient.post('/api/v1/inspections/bookings/', bookingData);
  },

  getBooking: async (bookingId) => {
    return await apiClient.get(`/api/v1/inspections/bookings/${bookingId}/`);
  },

  updateBooking: async (bookingId, bookingData) => {
    return await apiClient.put(`/api/v1/inspections/bookings/${bookingId}/`, bookingData);
  },

  rescheduleBooking: async (bookingId, rescheduleData) => {
    return await apiClient.post(`/api/v1/inspections/bookings/${bookingId}/reschedule/`, rescheduleData);
  },

  cancelBooking: async (bookingId, cancelData) => {
    return await apiClient.post(`/api/v1/inspections/bookings/${bookingId}/cancel/`, cancelData);
  },

  // Agent Management
  getAgentBookings: async (agentId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/inspections/agents/${agentId}/bookings/${queryString ? `?${queryString}` : ''}`);
  },

  // Activities
  getActivities: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/inspections/activities/${queryString ? `?${queryString}` : ''}`);
  },

  // Reviews
  getReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/inspections/reviews/${queryString ? `?${queryString}` : ''}`);
  },

  createReview: async (reviewData) => {
    return await apiClient.post('/api/v1/inspections/reviews/', reviewData);
  }
};