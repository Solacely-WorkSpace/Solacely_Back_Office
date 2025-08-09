"use client";
import React, { useEffect, useState } from "react";
import { listingsAPI } from "@/utils/api/listings";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Calendar,
  Maximize,
  DollarSign,
  Check,
  X,
  User,
  ArrowLeft,
} from "lucide-react";
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
      console.log("Listing detail:", response);
    } catch (err) {
      console.error("Error fetching listing:", err);
      toast.error("Error fetching listing details");
      setError("Failed to fetch listing details");
    } finally {
      setLoading(false);
    }
  };

  // Robust image URL handling
  const getImageUrl = (imageData) => {
    const placeholder = "/icons/Logo.svg";

    if (!imageData) return placeholder;

    try {
      // Check for original_image_url first
      if (imageData.original_image_url) {
        return imageData.original_image_url;
      }

      // Check for direct URL
      if (imageData.url && imageData.url.startsWith("http")) {
        return imageData.url;
      }

      // Handle Cloudinary URLs
      if (imageData.url && !imageData.url.includes("undefined")) {
        return `https://res.cloudinary.com/dmlgns85e/image/upload/${imageData.url}`;
      }

      // Handle image field
      if (imageData.image) {
        if (imageData.image.startsWith("http")) {
          return imageData.image;
        }
        if (!imageData.image.includes("undefined")) {
          return `https://res.cloudinary.com/dmlgns85e/image/upload/${imageData.image}`;
        }
      }

      return placeholder;
    } catch (error) {
      console.error("Error processing image URL:", error);
      return placeholder;
    }
  };

  const getCurrentImage = () => {
    if (
      !listingDetail?.images ||
      listingDetail.images.length === 0
    ) {
      return "/icons/Logo.svg";
    }
    return getImageUrl(listingDetail.images[currentImageIndex]);
  };

  const nextImage = () => {
    if (
      listingDetail?.images &&
      listingDetail.images.length > 1
    ) {
      setCurrentImageIndex((prev) =>
        prev === listingDetail.images.length - 1 ? 0 : prev + 1
      );
      setImageError(false);
    }
  };

  const prevImage = () => {
    if (
      listingDetail?.images &&
      listingDetail.images.length > 1
    ) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listingDetail.images.length - 1 : prev - 1
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Listing
          </h2>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Listing Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested listing could not be found.
          </p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  

  // Remove the first paymentBreakdown declaration and fix the JSX placement
  
  // Update the homeDetails array to show actual values instead of generic labels
  const homeDetails = [
    // Only show building type if it exists, with actual value
    ...(listingDetail.building_type ? [{ label: listingDetail.building_type, checked: true }] : []),
    { label: `${listingDetail.bedroom || listingDetail.number_of_bedrooms || 0} Bedrooms`, checked: true },
    { label: `${listingDetail.bathroom || listingDetail.number_of_bathrooms || 0} Bathrooms`, checked: true },
    { label: `${listingDetail.area || listingDetail.area_size_sqm || 0} sqft`, checked: true },
    // Only show garage info if it exists, with actual value
    ...(listingDetail.garage ? [{ label: listingDetail.garage, checked: true }] : []),
    // Only show availability if it exists, with actual value
    ...(listingDetail.propertyAvailability ? [{ label: listingDetail.propertyAvailability, checked: true }] : []),
    { label: listingDetail.type === "Rent" ? "For Rent" : "For Sale", checked: true },
    // Fix amenities handling - ensure it's an array and handle different data formats
    ...(Array.isArray(listingDetail.amenities) 
    ? listingDetail.amenities.map(amenity => ({
        label: typeof amenity === 'string' ? amenity : amenity.name || amenity.label || 'Amenity',
        checked: true
      }))
    : listingDetail.amenities && typeof listingDetail.amenities === 'string'
    ? listingDetail.amenities.split(',').map(amenity => ({
        label: amenity.trim(),
        checked: true
      }))
    : []
  )
];

  // Update the payment breakdown to use actual data
  const paymentBreakdown = [
    { 
      label: "Light fee", 
      duration: "1 Year", 
      amount: `₦${listingDetail.lightFee?.toLocaleString() || "0"}` 
    },
    { 
      label: "Security Fee", 
      duration: "1 Year", 
      amount: `₦${listingDetail.securityFee?.toLocaleString() || "0"}` 
    },
    { 
      label: "Estate Due", 
      duration: "1 Year", 
      amount: `₦${listingDetail.estateDue?.toLocaleString() || "0"}` 
    },
    { 
      label: "Bin Contribution", 
      duration: "1 Year", 
      amount: `₦${listingDetail.binContribution?.toLocaleString() || "0"}` 
    },
    {
      label: "House Rent",
      duration: "1 Year",
      amount: `₦${listingDetail.price?.toLocaleString() || "0"}`,
    },
    // Add additional fees if available
    ...(listingDetail.additionalFees || []).map(fee => ({
      label: fee.name,
      duration: "1 Year",
      amount: `₦${fee.amount?.toLocaleString() || "0"}`
    }))
  ];

  // Update coordinates handling for better map display
  const mapCoordinates = 
    listingDetail.coordinates ||
    (listingDetail.latitude && listingDetail.longitude
      ? {
          lat: parseFloat(listingDetail.latitude),
          lng: parseFloat(listingDetail.longitude),
        }
      : null);
  
  // Create a listing object with coordinates for the map
  const listingWithCoordinates = mapCoordinates ? {
    ...listingDetail,
    coordinates: mapCoordinates
  } : null;

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

      {/* Hero Image Section - Full Width */}
      <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-8">
        {!imageError ? (
          <>
            <Image
              src={getCurrentImage()}
              alt={`${listingDetail.propertyType || "Property"} - ${
                listingDetail.address || "Image"
              }`}
              fill
              className="object-contain transition-all duration-500 ease-in-out"
              priority
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>

            {/* Navigation Arrows - Only show if multiple images */}
            {listingDetail?.images &&
              listingDetail.images.length > 1 && (
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
            {listingDetail?.images &&
              listingDetail.images.length > 1 && (
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} /{" "}
                  {listingDetail.images.length}
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

      {/* Main Content Grid - Property Details Left, Payment Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Details (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Header */}
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{listingDetail.location || "Address not available"}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {listingDetail.title ||
                `${listingDetail.propertyType || "Property"} ${
                  listingDetail.type || ""
                }`}
            </h1>
            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{listingDetail.number_of_bedrooms || 0} bed</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{listingDetail.number_of_bathrooms || 0} bath</span>
              </div>
              <div className="flex items-center">
                <Maximize className="w-4 h-4 mr-1" />
                <span>{listingDetail.area_size_sqm || 0} sqft</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-3xl font-bold text-teal-600">
                ₦{listingDetail.price?.toLocaleString() || "0"}
                {listingDetail.type === "Rent" ? "/month" : ""}
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {listingDetail.description || "No description available."}
            </p>
            <p className="text-gray-500 text-sm">
              Listed by{" "}
              {listingDetail.fullName ||
                listingDetail.createdBy ||
                "Property Owner"}{" "}
              • ID: #{listingDetail.id}
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

          {/* Add amenities section after Property Details */}
          {listingDetail.amenities && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listingDetail.amenities.split(',').map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">{amenity.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Add repairs section if available */}
          {listingDetail.repairs && listingDetail.repairs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Required Repairs
              </h2>
              <div className="space-y-4">
                {listingDetail.repairs.map((repair, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔧</span>
                      <span className="font-medium text-gray-900">{repair}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Add defects section if available */}
          {listingDetail.defects && listingDetail.defects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Property Defects
              </h2>
              <div className="space-y-4">
                {listingDetail.defects.map((defect, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⚠️</span>
                      <span className="font-medium text-gray-900">{defect}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Housing Agent */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Agent
            </h2>
            <div className="flex items-center space-x-4 p-4  rounded-xl">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                {listingDetail.profileImage ? (
                  <Image
                    src={listingDetail.profileImage}
                    alt="Agent"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {listingDetail.fullName ||
                    listingDetail.createdBy ||
                    "Property Agent"}
                </h3>
                <p className="text-xs text-gray-500">
                  Contact for viewing and inquiries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Breakdown & Map (1/3 width) */}
        <div className="space-y-6">
          {/* Payment Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Payment Breakdown
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Annual fees and charges for this property
            </p>
            <div className="space-y-4">
              {paymentBreakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-gray-600 text-sm">
                      {item.duration}
                    </span>
                  </div>
                  <div className="flex-1 text-right">
                    <span className="font-medium text-gray-900">
                      {item.amount}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount:</span>
                  <span className="font-bold text-2xl text-teal-600">
                    ₦{listingDetail.price?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Location - No Border, Wider */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Map Location
            </h3>
            {/* Map Location section */}
            <div className="h-80 rounded-2xl overflow-hidden w-full">
              {mapCoordinates ? (
                <GoogleMapSection
                  coordinates={mapCoordinates}
                  listing={listingWithCoordinates ? [listingWithCoordinates] : []}
                />
              ) : (
                <div className="h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-500">
                      Location data not available
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      {listingDetail.location || "No address provided"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

         

          {/* Add RTO section if RTO data is available */}
          {(listingDetail.rentalPeriod || listingDetail.optionToBuyPeriod) && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Rent-to-Own Details
              </h3>
              <div className="space-y-3">
                {listingDetail.rentalPeriod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rental Period:</span>
                    <span className="font-medium">{listingDetail.rentalPeriod} months</span>
                  </div>
                )}
                {listingDetail.optionToBuyPeriod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Option to Buy Period:</span>
                    <span className="font-medium">{listingDetail.optionToBuyPeriod} months</span>
                  </div>
                )}
                {listingDetail.buyOptionExpiryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Buy Option Expires:</span>
                    <span className="font-medium">{new Date(listingDetail.buyOptionExpiryDate).toLocaleDateString()}</span>
                  </div>
                )}
                {listingDetail.monthlyRent && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rent:</span>
                    <span className="font-medium">₦{listingDetail.monthlyRent.toLocaleString()}</span>
                  </div>
                )}
                {listingDetail.buyPrice && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Buy Price:</span>
                    <span className="font-medium">₦{listingDetail.buyPrice.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminViewListing;
