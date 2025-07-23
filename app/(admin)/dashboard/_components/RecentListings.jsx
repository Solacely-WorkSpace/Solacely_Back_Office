"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Pencil, 
  Trash, 
  MoreHorizontal, 
  MapPin, 
  BedDouble, 
  Bath, 
  CarFront, 
  Home,
  Wifi,
  Tv,
  Car,
  Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

function RecentListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listing")
      .select(`*, listingimages(url, listing_id)`)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) {
      setListings(data);
    }
    setLoading(false);
  };

  const handleDeleteListing = async (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await supabase.from("listing").delete().eq("id", id);
      fetchRecentListings();
    }
  };

  const toggleListingStatus = async (id, currentStatus) => {
    await supabase
      .from("listing")
      .update({ active: !currentStatus })
      .eq("id", id);
    fetchRecentListings();
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity?.toLowerCase() || '';
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="h-4 w-4" />;
    if (amenityLower.includes('tv') || amenityLower.includes('television')) return <Tv className="h-4 w-4" />;
    if (amenityLower.includes('parking') || amenityLower.includes('garage')) return <Car className="h-4 w-4" />;
    if (amenityLower.includes('kitchen') || amenityLower.includes('dining')) return <Utensils className="h-4 w-4" />;
    return <Home className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recently listed property</CardTitle>
        <Link href="/dashboard/listings" className="text-sm text-blue-600 hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-100 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex gap-6 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
              >
                {/* Larger Image */}
                <div className="relative h-24 w-32 md:h-28 md:w-40 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      listing?.listingimages?.[0]?.url || "/placeholder.svg"
                    }
                    alt={listing.address || 'Property image'}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Location above listing name */}
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {listing.address || 'Location not specified'}
                    </span>
                  </div>
                  
                  {/* Listing Name */}
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                    {listing.propertyType || 'Property'} - {listing.bedroom || 0} Bedroom {listing.propertyType || 'Unit'}
                  </h3>
                  
                  {/* Price and Status */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-bold text-green-600">
                      ${listing.price ? Number(listing.price).toLocaleString() : '0'}
                    </span>
                    <Badge variant={listing.active ? "default" : "secondary"}>
                      {listing.active ? "Active" : "Draft"}
                    </Badge>
                    <Badge variant="outline">{listing.type || 'Sale'}</Badge>
                  </div>
                  
                  {/* Amenities with Icons */}
                  <div className="flex flex-wrap gap-3 mb-2">
                    {/* Basic Property Features */}
                    {listing.bedroom && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <BedDouble className="h-4 w-4" />
                        <span>{listing.bedroom} Bed</span>
                      </div>
                    )}
                    {listing.bathroom && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Bath className="h-4 w-4" />
                        <span>{listing.bathroom} Bath</span>
                      </div>
                    )}
                    {listing.parking && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <CarFront className="h-4 w-4" />
                        <span>{listing.parking} Parking</span>
                      </div>
                    )}
                    
                    {/* Additional Amenities */}
                    {listing.amenities && listing.amenities.split(',').slice(0, 3).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-1 text-sm text-gray-600">
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity.trim()}</span>
                      </div>
                    ))}
                    
                    {/* Show area if available */}
                    {listing.area && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Home className="h-4 w-4" />
                        <span>{listing.area}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/dashboard/view-listing/${listing.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/edit-listing/${listing.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleListingStatus(listing.id, listing.active)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {listing.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteListing(listing.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentListings;
