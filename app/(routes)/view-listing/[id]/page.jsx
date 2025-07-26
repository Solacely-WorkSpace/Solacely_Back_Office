"use client";
import { listingsAPI } from "@/utils/api/listings";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, MapPin, Users, Calendar, Maximize, DollarSign, Check, X, User, Grid3X3, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GoogleMapSection from "@/app/_components/GoogleMapSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function ViewListing({ params }) {
  const [listingDetail, setListingDetail] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchListingDetail();
    }
  }, [params?.id]);

  const fetchListingDetail = async () => {
    try {
      setLoading(true);
      const data = await listingsAPI.getListing(params.id);
      setListingDetail(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Failed to load listing details');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (listingDetail?.images) {
      setCurrentImageIndex((prev) => 
        prev === listingDetail.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listingDetail?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listingDetail.images.length - 1 : prev - 1
      );
    }
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-[60vh] bg-gray-200 rounded-b-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!listingDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Listing Not Found</h2>
          <p className="text-gray-600">The listing you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const paymentBreakdown = [
    { label: "Light fee", duration: "0 Year", amount: "₦0.00" },
    { label: "Security Fee", duration: "0 Year", amount: "₦0.00" },
    { label: "Estate Due", duration: "0 Year", amount: "₦0.00" },
    { label: "Bin Contribution", duration: "0 Year", amount: "₦0.00" },
    { label: "House Rent", duration: "0 Year", amount: "₦0.00" },
  ];

  const homeDetails = [
    { label: "Condo", checked: true },
    { label: "2 Days on Oval", checked: true },
    { label: "Cooling System: Central", checked: true },
    { label: `${listingDetail.area}sqft`, checked: true },
    { label: "Rooms: Dining Room", checked: true },
    { label: "Air Conditioning", checked: true },
    { label: "Built in 1905", checked: true },
    { label: "Heating: Forced Air", checked: true },
    { label: "prepaid meter", checked: true },
  ];

  const homeDefects = [
    { label: "Kitchen Sink", cost: "₦25,000", icon: "🔧" },
    { label: "Toilet Sink", cost: "₦25,000", icon: "🚽" },
    { label: "AC Repairs", cost: "₦25,000", icon: "❄️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Hero Image Section */}
      <div className="relative bg-white">
        {listingDetail?.images && listingDetail.images.length > 0 ? (
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden rounded-b-3xl bg-gray-100">
              <Image
                src={listingDetail.images[currentImageIndex]?.image}
                alt="Property"
                fill
                className="object-cover transition-all duration-500 ease-in-out"
                priority
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              
              {/* Modern Navigation Arrows */}
              {listingDetail.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 transition-all duration-200 shadow-lg hover:shadow-xl group"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800 group-hover:text-gray-900" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 transition-all duration-200 shadow-lg hover:shadow-xl group"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800 group-hover:text-gray-900" />
                  </button>
                </>
              )}

              {/* Modern Top Controls */}
              <div className="absolute top-6 right-6 flex gap-3">
                {/* Image Counter */}
                <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {listingDetail.images.length}
                </div>
                
                {/* View All Photos Button */}
                <Button 
                  onClick={() => setShowImageGallery(true)}
                  className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 border-0 rounded-full px-4 py-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>

              {/* Navigate Apartment Button */}
              <div className="absolute bottom-6 right-6">
                <Button className="bg-teal-600/90 backdrop-blur-sm hover:bg-teal-700 text-white border-0 rounded-full px-6 py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  Navigate Apartment
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Modern Thumbnail Strip */}
            {listingDetail.images.length > 1 && (
              <div className="absolute bottom-6 left-6 flex gap-2 max-w-md overflow-x-auto scrollbar-hide">
                {listingDetail.images.slice(0, 6).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'ring-3 ring-white ring-offset-2 ring-offset-transparent scale-105 shadow-xl' 
                        : 'hover:scale-105 hover:shadow-lg opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image.image}
                      alt={`Property image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-[60vh] md:h-[70vh] bg-gray-200 rounded-b-3xl flex items-center justify-center">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>

      {/* Enhanced Image Gallery Modal */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl mx-auto p-4 md:p-8">
            {/* Close Button */}
            <button
              onClick={() => setShowImageGallery(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all duration-200 group"
            >
              <X className="w-6 h-6 text-white group-hover:text-gray-200" />
            </button>
            
            <div className="h-full flex flex-col">
              {/* Main Gallery */}
              <div className="flex-1 flex items-center justify-center mb-6">
                <Carousel className="w-full max-w-5xl">
                  <CarouselContent>
                    {listingDetail.listingimages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative h-[70vh] md:h-[75vh] rounded-2xl overflow-hidden bg-gray-900">
                          <Image
                            src={image.url}
                            alt={`Property image ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
                  <CarouselNext className="right-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
                </Carousel>
              </div>
              
              {/* Gallery Thumbnails */}
              <div className="flex gap-3 justify-center overflow-x-auto pb-4 scrollbar-hide">
                {listingDetail.listingimages.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-200">
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm md:text-base">{listingDetail.address}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {listingDetail.propertyType} {listingDetail.type}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{listingDetail.bedroom} bed</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{listingDetail.bathroom} bath</span>
                </div>
                <div className="flex items-center">
                  <Maximize className="w-4 h-4 mr-2" />
                  <span>{listingDetail.area} sqft</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-2xl md:text-3xl font-bold text-teal-600">
                  ₦{listingDetail.price?.toLocaleString()}/month
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  I'm Interested
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {listingDetail.description || "Totally updated and move-in ready in Hidden Pond! This home is better than new! Kitchen offers all new stainless steel appliances, lighting, and granite countertops. Master bathroom features new tile floor and designer tile shower."}
              </p>
              <p className="text-gray-500 text-sm">
                Listed by {listingDetail.fullName || "Philip A Morneau"}, {listingDetail.createdBy || "Alanna Fine Homes Sotheby's International"} #{listingDetail.id || "9799510"}
              </p>
            </div>

            {/* Home Details */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Home Details for {listingDetail.propertyType} {listingDetail.type}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {homeDetails.map((detail, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{detail.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Defects */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Home Defects</h2>
              <div className="space-y-3">
                {homeDefects.map((defect, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
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
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Housing Agent</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {listingDetail.profileImage ? (
                    <Image
                      src={listingDetail.profileImage}
                      alt="Agent"
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {listingDetail.fullName || "Mr. Sandara Kemi"}
                  </h3>
                  <p className="text-gray-600">
                    {listingDetail.createdBy || "Professional House Agent"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Breakdown & Map */}
          <div className="space-y-8">
            {/* Payment Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Breakdown</h3>
              <p className="text-gray-600 text-sm mb-6">
                The annual fees below start at ₦0.00 except the house rent
              </p>
              <div className="space-y-4">
                {paymentBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <span className="text-gray-700 text-sm">{item.label}</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-gray-600 text-xs">{item.duration}</span>
                    </div>
                    <div className="flex-1 text-right">
                      <span className="font-medium text-gray-900 text-sm">{item.amount}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Amount:</span>
                    <span className="font-bold text-xl text-teal-600">
                      ₦{listingDetail.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Map Location</h3>
              <div className="h-64 bg-gray-100 rounded-xl overflow-hidden">
                <GoogleMapSection
                  coordinates={listingDetail.coordinates}
                  listing={[listingDetail]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default ViewListing;
