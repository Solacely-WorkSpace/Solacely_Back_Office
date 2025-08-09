import { apiClient } from './client';

export const listingsAPI = {
  getListings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/v1/apart/listings/${queryString ? `?${queryString}` : ''}`);
  },
  
  getListing: (id) => apiClient.get(`/api/v1/apart/listings/${id}/`),
  
 createListing: (listingData) => {
   // If listingData is FormData, use postFormData
   if (listingData instanceof FormData) {
     return apiClient.postFormData('/api/v1/apart/listings/', listingData);
   }
   // Otherwise use regular post (for backward compatibility)
   return apiClient.post('/api/v1/apart/listings/', listingData);
 },

  updateListing: (id, listingData) => apiClient.put(`/api/v1/apart/listings/${id}/`, listingData),
  
  deleteListing: (id) => apiClient.delete(`/api/v1/apart/listings/${id}/`),
  
  // Add approval methods
  approveListing: (id, reason = '') => 
    apiClient.patch(`/api/v1/apart/listings/${id}/approve/`, { 
      status: 'approved', 
      reason 
    }),
  
  rejectListing: (id, reason = '') => 
    apiClient.patch(`/api/v1/apart/listings/${id}/approve/`, { 
      status: 'rejected', 
      reason 
    }),
  
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