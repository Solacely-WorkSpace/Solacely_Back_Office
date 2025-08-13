import React, { useState, useEffect } from "react";
import { listingsAPI } from "@/utils/api/listings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, BedDouble, Bath, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function RecentListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Dummy data for fallback
  const dummyListings = [
    {
      id: "dummy-1",
      title: "Luxury 3 Bedroom Apartment",
      location: "Lagos, Lekki Phase 1",
      number_of_bedrooms: 3,
      number_of_bathrooms: 2,
      area_size_sqm: 120,
      price: 25000000,
      status: "available",
      listing_type: "Sale",
      images: [{ original_image_url: "/icons/Logo.svg" }],
    },
    {
      id: "dummy-2",
      title: "Modern 2 Bedroom Flat",
      location: "Abuja, Wuse 2",
      number_of_bedrooms: 2,
      number_of_bathrooms: 2,
      area_size_sqm: 85,
      price: 18000000,
      status: "available",
      listing_type: "Rent",
      images: [{ original_image_url: "/icons/Logo.svg" }],
    },
    {
      id: "dummy-3",
      title: "Spacious 4 Bedroom Duplex",
      location: "Port Harcourt, GRA",
      number_of_bedrooms: 4,
      number_of_bathrooms: 3,
      area_size_sqm: 200,
      price: 45000000,
      status: "available",
      listing_type: "Sale",
      images: [{ original_image_url: "/icons/Logo.svg" }],
    },
  ];

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getListings({
        limit: 5,
        ordering: "-created_at",
      });
      const data = response.results || response;
      console.log("API Response:", response);
      console.log("Listings data:", data);
      console.log("Number of listings:", data?.length);

      // Ensure we only take the first 3 listings
      const limitedListings = Array.isArray(data) ? data.slice(0, 3) : [];

      // If no listings were returned, use dummy data
      if (limitedListings.length === 0) {
        console.log("No listings returned from API, using dummy data");
        setListings(dummyListings);
      } else {
        setListings(limitedListings);
      }
    } catch (error) {
      console.error("Error fetching recent listings:", error);
      // Use dummy data when API call fails
      console.log("API call failed, using dummy data");
      setListings(dummyListings);
    }
    setLoading(false);
  };

  // Robust image URL handler with immediate fallback
  const getImageUrl = (listing) => {
    // If this listing's image has already failed, return placeholder immediately
    if (imageErrors.has(listing.id)) {
      return "/icons/Logo.svg";
    }

    // Try to get image from various possible fields
    const imageData = listing?.images?.[0] || listing?.listingimages?.[0];

    if (!imageData) {
      return "/icons/Logo.svg";
    }

    // Check for original_image_url first
    if (
      imageData.original_image_url &&
      imageData.original_image_url.startsWith("http")
    ) {
      // Validate that it's not a broken Cloudinary URL
      if (
        imageData.original_image_url.includes("cloudinary.com") &&
        (imageData.original_image_url.includes("undefined") ||
          imageData.original_image_url.includes("null"))
      ) {
        return "/icons/Logo.svg";
      }
      return imageData.original_image_url;
    }

    // Check for url field
    if (imageData.url && imageData.url.startsWith("http")) {
      if (
        imageData.url.includes("cloudinary.com") &&
        (imageData.url.includes("undefined") || imageData.url.includes("null"))
      ) {
        return "/icons/Logo.svg";
      }
      return imageData.url;
    }

    // Check for image field
    if (imageData.image) {
      if (imageData.image.startsWith("http")) {
        if (
          imageData.image.includes("cloudinary.com") &&
          (imageData.image.includes("undefined") ||
            imageData.image.includes("null"))
        ) {
          return "/icons/Logo.svg";
        }
        return imageData.image;
      }
    }

    // Default to placeholder for any other case
    return "/icons/Logo.svg";
  };

  // Handle image load errors - mark as failed and force re-render
  const handleImageError = (listingId) => {
    console.log(
      `Image failed to load for listing ${listingId}, switching to placeholder`
    );
    setImageErrors((prev) => {
      const newErrors = new Set([...prev, listingId]);
      return newErrors;
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Recently listed property
        </CardTitle>
        <Link
          href="/dashboard/listings"
          className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center"
        >
          View all <ChevronRight className="h-3 w-3 ml-1" />
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
          <div>
            {listings.map((listing, index) => {
              const imageUrl = getImageUrl(listing);
              const isPlaceholder = imageUrl === "/icons/Logo.svg";
              const isNotLast = index < listings.length - 1;

              return (
                <div key={listing.id}>
                  <Link
                    href={`/dashboard/view-listing/${listing.id}`}
                    className="block py-4"
                  >
                    <div className="flex gap-6">
                      {/* Image Container */}
                      <div className="relative h-32 w-56 md:h-36 md:w-64 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {isPlaceholder ? (
                          <Image
                            src="/icons/Logo.svg"
                            alt="Property placeholder"
                            fill
                            className="object-contain"
                            priority={false}
                          />
                        ) : (
                          <Image
                            src={imageUrl}
                            alt={listing.location || "Property image"}
                            fill
                            className="object-contain"
                            onError={() => handleImageError(listing.id)}
                            priority={false}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col">
                        {/* Apartment | City */}
                        <div className="text-sm text-gray-500 mb-1">
                          {listing.building_type || "Apartment"} |{" "}
                          {listing.location?.split(",")[0] || "City"}
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                          {listing.title ||
                            `${
                              listing.number_of_bedrooms || 0
                            } Bedroom Property`}
                        </h3>

                        {/* Bed, Bath, and Sqft in one line */}
                        <div className="flex flex-wrap gap-4 mb-2 text-xs text-gray-600"> 
                          {listing.number_of_bedrooms && (
                            <div className="flex items-center gap-1">
                              <BedDouble className="h-3 w-3" /> {/* Reduced icon size from h-4 w-4 to h-3 w-3 */}
                              <span>{listing.number_of_bedrooms} Bed</span>
                            </div>
                          )}
                          {listing.number_of_bathrooms && (
                            <div className="flex items-center gap-1">
                              <Bath className="h-3 w-3" /> {/* Reduced icon size from h-4 w-4 to h-3 w-3 */}
                              <span>{listing.number_of_bathrooms} Bath</span>
                            </div>
                          )}
                          {listing.area_size_sqm && (
                            <div className="flex items-center gap-1">
                              <Home className="h-3 w-3" /> {/* Reduced icon size from h-4 w-4 to h-3 w-3 */}
                              <span>{listing.area_size_sqm} sqft</span>
                            </div>
                          )}
                        </div>

                        {/* Location */}
                        <div className="text-xs text-gray-500 mb-2"> {/* Changed from text-sm to text-xs */}
                          <MapPin className="h-3 w-3 inline mr-1" /> {/* Reduced icon size from h-4 w-4 to h-3 w-3 */}
                          <span className="truncate">
                            {listing.location || "Location not specified"}
                          </span>
                        </div>

                        {/* Price section */}
                        <div className="mt-auto">
                          <span
                            className="text-lg font-bold" 
                            style={{ color: "#3DC5A1" }}
                          >
                            ₦
                            {listing.price
                              ? Number(listing.price).toLocaleString()
                              : "0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {isNotLast && <hr className="border-t border-gray-200" />}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentListings;
