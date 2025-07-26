import { apiClient } from './client';

export const listingsAPI = {
  getListings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/v1/apart/listings/${queryString ? `?${queryString}` : ''}`);
  },
  
  getListing: (id) => apiClient.get(`/api/v1/apart/listings/${id}/`),
  
  createListing: (listingData) => apiClient.post('/api/v1/apart/listings/', listingData),
  
  updateListing: (id, listingData) => apiClient.put(`/api/v1/apart/listings/${id}/`, listingData),
  
  deleteListing: (id) => apiClient.delete(`/api/v1/apart/listings/${id}/`),
  
  getListingImages: (listingId) => apiClient.get(`/api/v1/apart/listings/${listingId}/images/`),
  
  uploadListingImages: (listingId, imageData) => {
    const formData = new FormData();
    Object.keys(imageData).forEach(key => {
      if (imageData[key] instanceof File) {
        formData.append(key, imageData[key]);
      } else {
        formData.append(key, imageData[key]);
      }
    });
    
    return apiClient.postFormData(`/api/v1/apart/listings/${listingId}/images/`, formData);
  },
  
  deleteListingImage: (listingId, imageId) => 
    apiClient.delete(`/api/v1/apart/listings/${listingId}/images/${imageId}/`),
};