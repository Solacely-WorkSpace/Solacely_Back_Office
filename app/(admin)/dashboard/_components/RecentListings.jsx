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

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getListings({ limit: 5, ordering: '-created_at' });
      const data = response.results || response;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching recent listings:', error);
    }
    setLoading(false);
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
              <Link
                key={listing.id}
                href={`/dashboard/view-listing/${listing.id}`}
                className="block"
              >
                <div className="flex gap-6 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="relative h-32 w-48 md:h-36 md:w-56 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={listing?.images?.[0]?.image || "/placeholder.svg"}
                      alt={listing.location || 'Property image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {listing.location || 'Location not specified'}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                      {listing.title || `${listing.building_type || 'Property'} - ${listing.number_of_bedrooms || 0} Bedroom`}
                    </h3>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg font-bold text-green-600">
                        ${listing.price ? Number(listing.price).toLocaleString() : '0'}
                      </span>
                      <Badge variant={listing.status === 'available' ? "default" : "secondary"}>
                        {listing.status === 'available' ? "Available" : listing.status}
                      </Badge>
                      <Badge variant="outline">{listing.listing_type || 'Sale'}</Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-2">
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentListings;
