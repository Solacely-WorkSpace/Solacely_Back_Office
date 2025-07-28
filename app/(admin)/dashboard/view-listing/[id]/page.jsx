"use client";
import React, { useEffect, useState } from 'react';
import { listingsAPI } from '@/utils/api/listings';
// Remove supabase import
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
  const router = useRouter();

  useEffect(() => {
    getListingDetail();
  }, [params.id]);

  const getListingDetail = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getListing(params.id);
      setListingDetail(response);
      console.log(response);
    } catch (err) {
      console.error('Error fetching listing:', err);
      toast("Error fetching listing details");
      setError('Failed to fetch listing details');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (listingDetail?.listingimages) {
      setCurrentImageIndex((prev) => 
        prev === listingDetail.listingimages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listingDetail?.listingimages) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listingDetail.listingimages.length - 1 : prev - 1
      );
    }
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
            {listingDetail?.listingimages && listingDetail.listingimages.length > 0 ? (
              <>
          <Image
  src={listingDetail.listingimages[currentImageIndex]?.original_image_url || 
       (listingDetail.listingimages[currentImageIndex]?.url && 
        listingDetail.listingimages[currentImageIndex]?.url.startsWith('http') ? 
        listingDetail.listingimages[currentImageIndex]?.url : 
        `https://res.cloudinary.com/${listingDetail.listingimages[currentImageIndex]?.url}`)}
  alt="Property"
  fill
  className="object-cover transition-all duration-500 ease-in-out"
  priority
/>
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                
                {/* Navigation Arrows */}
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

                {/* Navigate Apartment Button */}
                <div className="absolute bottom-4 right-4">
                  <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30">
                    Navigate Apartment
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          {/* Property Header */}
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{listingDetail.address}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {listingDetail.propertyType} {listingDetail.type}
            </h1>
            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{listingDetail.bedroom}bed</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{listingDetail.bathroom}bath</span>
              </div>
              <div className="flex items-center">
                <Maximize className="w-4 h-4 mr-1" />
                <span>{listingDetail.area}sqft</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-3xl font-bold text-teal-600">
                ₦{listingDetail.price?.toLocaleString()}
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
            <p className="text-gray-600 leading-relaxed mb-4">
              {listingDetail.description || "Totally updated and move-in ready in Hidden Pond! This home is better than new! Kitchen offers all new stainless steel appliances, lighting, and granite countertops. Master bathroom features new tile floor and designer tile shower."}
            </p>
            <p className="text-gray-500 text-sm">
              Listed by {listingDetail.fullName || "Property Owner"}, {listingDetail.createdBy || "Alanna Fine Homes Sotheby's International"} #{listingDetail.id}
            </p>
          </div>

          {/* Home Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Home Details for {listingDetail.propertyType} {listingDetail.type}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Home Defects</h2>
            <div className="space-y-4">
              {homeDefects.map((defect, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{defect.icon}</span>
                    <span className="font-medium text-gray-900">{defect.label}:</span>
                  </div>
                  <span className="font-bold text-teal-600">{defect.cost}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Housing Agent */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Housing Agent</h2>
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

        {/* Right Column - Payment & Map */}
        <div className="space-y-6">
          {/* Payment Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Breakdown</h3>
            <p className="text-gray-600 text-sm mb-6">
              The annual fees below start at ₦0.00 except the house rent
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
                    ₦{listingDetail.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Location */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Map Location</h3>
            <div className="h-96 rounded-lg overflow-hidden">
              {listingDetail.coordinates ? (
                <GoogleMapSection
                  coordinates={listingDetail.coordinates}
                  listing={[listingDetail]}
                />
              ) : (
                <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No location data available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminViewListing;