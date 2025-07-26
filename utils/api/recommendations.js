import { apiClient } from './client';

export const recommendationsAPI = {
  getRecommendations: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/v1/AI/recommendations/${queryString ? `?${queryString}` : ''}`);
  },
};