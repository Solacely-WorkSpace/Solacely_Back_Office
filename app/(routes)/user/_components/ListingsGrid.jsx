"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, BedDouble, Bath, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function ListingsGrid({ 
  listings, 
  wishlist, 
  toggleWishlist, 
  currentPage, 
  listingsPerPage, 
  handlePageChange 
}) {
  const getCurrentListings = () => {
    const startIndex = (currentPage - 1) * listingsPerPage;
    const endIndex = startIndex + listingsPerPage;
    return listings.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(listings.length / listingsPerPage);

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Explore Listings</h2>
        <Link href="/rent">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            View all
          </Button>
        </Link>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {getCurrentListings().map((listing) => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Link href={`/view-listing/${listing.id}`}>
                <Image
                  src={listing.listingimages?.[0]?.url || '/placeholder.svg'}
                  alt={listing.address}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover cursor-pointer"
                />
              </Link>
              <button
                onClick={() => toggleWishlist(listing.id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart
                  className={`w-5 h-5 ${
                    wishlist.includes(listing.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                />
              </button>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{listing.type} Apartment</h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <BedDouble className="w-4 h-4" />
                  <span>{listing.bedroom}bed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{listing.bathroom}bath</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  <span>{listing.area}sqft</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{listing.address}</span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-800">
                    ₦{listing.price?.toLocaleString()}
                  </span>
                  <span className="text-gray-600">/ month</span>
                </div>
              </div>
              
              <Link href={`/view-listing/${listing.id}`} className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Explore
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 p-0 ${
                  currentPage === page 
                    ? 'bg-primary hover:bg-primary/90 text-white' 
                    : 'text-gray-600'
                }`}
              >
                {page}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ListingsGrid;