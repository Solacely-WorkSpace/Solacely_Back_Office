import React, { useState, useEffect } from "react";
import { listingsAPI } from "@/utils/api/listings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  CarFront, 
  Home
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function RecentListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getListings({ limit: 5, ordering: '-created_at' });
      const data = response.results || response;
      console.log('API Response:', response);
      console.log('Listings data:', data);
      console.log('Number of listings:', data?.length);
      
      // Ensure we only take the first 3 listings
      const limitedListings = Array.isArray(data) ? data.slice(0, 3) : [];
      setListings(limitedListings);
    } catch (error) {
      console.error('Error fetching recent listings:', error);
    }
    setLoading(false);
  };

  // Robust image URL handler with immediate fallback
  const getImageUrl = (listing) => {
    // If this listing's image has already failed, return placeholder immediately
    if (imageErrors.has(listing.id)) {
      return "/images/apartment-placeholder.jpg";
    }

    // Try to get image from various possible fields
    const imageData = listing?.images?.[0] || listing?.listingimages?.[0];
    
    if (!imageData) {
      return "/images/apartment-placeholder.jpg";
    }

    // Check for original_image_url first
    if (imageData.original_image_url && imageData.original_image_url.startsWith('http')) {
      // Validate that it's not a broken Cloudinary URL
      if (imageData.original_image_url.includes('cloudinary.com') && 
          (imageData.original_image_url.includes('undefined') || 
           imageData.original_image_url.includes('null'))) {
        return "/images/apartment-placeholder.jpg";
      }
      return imageData.original_image_url;
    }

    // Check for url field
    if (imageData.url && imageData.url.startsWith('http')) {
      if (imageData.url.includes('cloudinary.com') && 
          (imageData.url.includes('undefined') || 
           imageData.url.includes('null'))) {
        return "/images/apartment-placeholder.jpg";
      }
      return imageData.url;
    }

    // Check for image field
    if (imageData.image) {
      if (imageData.image.startsWith('http')) {
        if (imageData.image.includes('cloudinary.com') && 
            (imageData.image.includes('undefined') || 
             imageData.image.includes('null'))) {
          return "/images/apartment-placeholder.jpg";
        }
        return imageData.image;
      }
    }

    // Default to placeholder for any other case
    return "/images/apartment-placeholder.jpg";
  };

  // Handle image load errors - mark as failed and force re-render
  const handleImageError = (listingId) => {
    console.log(`Image failed to load for listing ${listingId}, switching to placeholder`);
    setImageErrors(prev => {
      const newErrors = new Set([...prev, listingId]);
      return newErrors;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recently listed property </CardTitle>
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
            {listings.map((listing) => {
              const imageUrl = getImageUrl(listing);
              const isPlaceholder = imageUrl === "/images/apartment-placeholder.jpg";
              
              return (
                <Link
                  key={listing.id}
                  href={`/dashboard/view-listing/${listing.id}`}
                  className="block"
                >
                  <div className="flex gap-6 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="relative h-32 w-48 md:h-36 md:w-56 rounded-lg overflow-hidden flex-shrink-0">
                      {isPlaceholder ? (
                        <Image
                          src="/images/apartment-placeholder.jpg"
                          alt="Property placeholder"
                          fill
                          className="object-cover"
                          priority={false}
                        />
                      ) : (
                        <Image
                          src={imageUrl}
                          alt={listing.location || 'Property image'}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(listing.id)}
                          priority={false}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                        {listing.title || `${listing.building_type || 'Property'} - ${listing.number_of_bedrooms || 0} Bedroom`}
                      </h3>
                      
                      {/* Bed/Bath section */}
                      <div className="flex flex-wrap gap-3 mb-3">
                        {listing.number_of_bedrooms && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <BedDouble className="h-4 w-4" />
                            <span>{listing.number_of_bedrooms} Bed</span>
                          </div>
                        )}
                        {listing.number_of_bathrooms && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Bath className="h-4 w-4" />
                            <span>{listing.number_of_bathrooms} Bath</span>
                          </div>
                        )}
                        {listing.amenities && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Home className="h-4 w-4" />
                            <span className="capitalize">{listing.amenities.split(',')[0]?.trim()}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Full location section - moved between bed/bath and price */}
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {listing.location || 'Location not specified'}
                        </span>
                      </div>
                      
                      {/* Price section */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold" style={{color: '#3DC5A1'}}>
                          ₦{listing.price ? Number(listing.price).toLocaleString() : '0'}
                        </span>
                        <Badge variant={listing.status === 'available' ? "default" : "secondary"}>
                          {listing.status === 'available' ? "Available" : listing.status}
                        </Badge>
                        <Badge variant="outline">{listing.listing_type || 'Sale'}</Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentListings;
