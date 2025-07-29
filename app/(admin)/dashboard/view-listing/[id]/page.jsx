"use client";
import React, { useEffect, useState } from 'react';
import { listingsAPI } from '@/utils/api/listings';
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, MapPin, Users, Calendar, Maximize, DollarSign, Check, X, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GoogleMapSection from "@/app/_components/GoogleMapSection";

function AdminViewListing({ params }) {
  const [listingDetail, setListingDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getListingDetail();
  }, [params.id]);

  const getListingDetail = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getListing(params.id);
      setListingDetail(response);
      console.log('Listing detail:', response);
    } catch (err) {
      console.error('Error fetching listing:', err);
      toast.error("Error fetching listing details");
      setError('Failed to fetch listing details');
    } finally {
      setLoading(false);
    }
  };

  // Robust image URL handling
  const getImageUrl = (imageData) => {
    const placeholder = "/images/apartment-placeholder.jpg";
    
    if (!imageData) return placeholder;
    
    try {
      // Check for original_image_url first
      if (imageData.original_image_url) {
        return imageData.original_image_url;
      }
      
      // Check for direct URL
      if (imageData.url && imageData.url.startsWith('http')) {
        return imageData.url;
      }
      
      // Handle Cloudinary URLs
      if (imageData.url && !imageData.url.includes('undefined')) {
        return `https://res.cloudinary.com/dmlgns85e/image/upload/${imageData.url}`;
      }
      
      // Handle image field
      if (imageData.image) {
        if (imageData.image.startsWith('http')) {
          return imageData.image;
        }
        if (!imageData.image.includes('undefined')) {
          return `https://res.cloudinary.com/dmlgns85e/image/upload/${imageData.image}`;
        }
      }
      
      return placeholder;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return placeholder;
    }
  };

  const getCurrentImage = () => {
    if (!listingDetail?.listingimages || listingDetail.listingimages.length === 0) {
      return "/images/apartment-placeholder.jpg";
    }
    return getImageUrl(listingDetail.listingimages[currentImageIndex]);
  };

  const nextImage = () => {
    if (listingDetail?.listingimages && listingDetail.listingimages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === listingDetail.listingimages.length - 1 ? 0 : prev + 1
      );
      setImageError(false);
    }
  };

  const prevImage = () => {
    if (listingDetail?.listingimages && listingDetail.listingimages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listingDetail.listingimages.length - 1 : prev - 1
      );
      setImageError(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Listing</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => getListingDetail()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!listingDetail) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">The requested listing could not be found.</p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const paymentBreakdown = [
    { label: "Light fee", duration: "0 Year", amount: "₦0.00" },
    { label: "Security Fee", duration: "0 Year", amount: "₦0.00" },
    { label: "Estate Due", duration: "0 Year", amount: "₦0.00" },
    { label: "Bin Contribution", duration: "0 Year", amount: "₦0.00" },
    { label: "House Rent", duration: "1 Year", amount: `₦${listingDetail.price?.toLocaleString() || '0'}` },
  ];

  const homeDetails = [
    { label: listingDetail.propertyType || "Property", checked: true },
    { label: `${listingDetail.bedroom || 0} Bedrooms`, checked: true },
    { label: `${listingDetail.bathroom || 0} Bathrooms`, checked: true },
    { label: `${listingDetail.area || 0} sqft`, checked: true },
    { label: listingDetail.type === 'Rent' ? 'For Rent' : 'For Sale', checked: true },
    { label: "Air Conditioning", checked: true },
    { label: "Modern Kitchen", checked: true },
    { label: "Parking Available", checked: true },
    { label: "Security", checked: true },
  ];

  const homeDefects = [
    { label: "Kitchen Maintenance", cost: "₦25,000", icon: "🔧" },
    { label: "Plumbing Check", cost: "₦15,000", icon: "🚽" },
    { label: "AC Servicing", cost: "₦20,000", icon: "❄️" },
  ];

  // Prepare coordinates for map
  const mapCoordinates = listingDetail.coordinates || 
    (listingDetail.latitude && listingDetail.longitude ? 
      { lat: parseFloat(listingDetail.latitude), lng: parseFloat(listingDetail.longitude) } : 
      null);

  return (
    <div className="p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          onClick={handleBack}
          variant="ghost" 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Property Details */}
        <div className="space-y-6">
          {/* Hero Image Section */}
          <div className="relative h-80 bg-gray-900 rounded-lg overflow-hidden">
            {!imageError ? (
              <>
                <Image
                  src={getCurrentImage()}
                  alt={`${listingDetail.propertyType || 'Property'} - ${listingDetail.address || 'Image'}`}
                  fill
                  className="object-cover transition-all duration-500 ease-in-out"
                  priority
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                
                {/* Navigation Arrows - Only show if multiple images */}
                {listingDetail?.listingimages && listingDetail.listingimages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {listingDetail?.listingimages && listingDetail.listingimages.length > 1 && (
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {listingDetail.listingimages.length}
                  </div>
                )}

                {/* Navigate Apartment Button */}
                <div className="absolute bottom-4 right-4">
                  <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30">
                    View on Map
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏠</div>
                  <span className="text-gray-500">Image not available</span>
                </div>
              </div>
            )}
          </div>

          {/* Property Header */}
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{listingDetail.address || 'Address not available'}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {listingDetail.title || `${listingDetail.propertyType || 'Property'} ${listingDetail.type || ''}`}
            </h1>
            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{listingDetail.bedroom || 0} bed</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{listingDetail.bathroom || 0} bath</span>
              </div>
              <div className="flex items-center">
                <Maximize className="w-4 h-4 mr-1" />
                <span>{listingDetail.area || 0} sqft</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-3xl font-bold text-teal-600">
                ₦{listingDetail.price?.toLocaleString() || '0'}
                {listingDetail.type === 'Rent' ? '/month' : ''}
              </div>
              <div className="flex gap-2">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                  I'm Interested
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {listingDetail.description || "This is a beautiful property with modern amenities and excellent location. Perfect for comfortable living with all necessary facilities nearby."}
            </p>
            <p className="text-gray-500 text-sm">
              Listed by {listingDetail.fullName || listingDetail.createdBy || "Property Owner"} • ID: #{listingDetail.id}
            </p>
          </div>

          {/* Home Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homeDetails.map((detail, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">{detail.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Home Defects */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Maintenance & Services</h2>
            <div className="space-y-4">
              {homeDefects.map((defect, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{defect.icon}</span>
                    <span className="font-medium text-gray-900">{defect.label}</span>
                  </div>
                  <span className="font-bold text-teal-600">{defect.cost}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Housing Agent */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Agent</h2>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-lg border">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                {listingDetail.profileImage ? (
                  <Image
                    src={listingDetail.profileImage}
                    alt="Agent"
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">
                  {listingDetail.fullName || listingDetail.createdBy || "Property Agent"}
                </h3>
                <p className="text-gray-600">
                  Professional Real Estate Agent
                </p>
                <p className="text-sm text-gray-500">
                  Contact for viewing and inquiries
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                  Call Agent
                </Button>
                <Button size="sm" variant="outline">
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment & Map */}
        <div className="space-y-6">
          {/* Payment Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Breakdown</h3>
            <p className="text-gray-600 text-sm mb-6">
              Annual fees and charges for this property
            </p>
            <div className="space-y-4">
              {paymentBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-gray-600 text-sm">{item.duration}</span>
                  </div>
                  <div className="flex-1 text-right">
                    <span className="font-medium text-gray-900">{item.amount}</span>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount:</span>
                  <span className="font-bold text-2xl text-teal-600">
                    ₦{listingDetail.price?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Location */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Map Location</h3>
            <div className="h-96 rounded-lg overflow-hidden">
              {mapCoordinates ? (
                <GoogleMapSection
                  coordinates={mapCoordinates}
                  listing={[listingDetail]}
                />
              ) : (
                <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-500">Location data not available</span>
                    <p className="text-sm text-gray-400 mt-1">
                      {listingDetail.address || 'No address provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Property Status */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Property Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  listingDetail.active ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {listingDetail.active ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Property Type:</span>
                <span className="font-medium">{listingDetail.propertyType || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Listing Type:</span>
                <span className="font-medium">{listingDetail.type || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date Listed:</span>
                <span className="font-medium">
                  {listingDetail.createdAt ? 
                    new Date(listingDetail.createdAt).toLocaleDateString() : 
                    'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminViewListing;