import { Bath, BedDouble, MapPin, Ruler, Search, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import GoogleAddressSearch from "./GoogleAddressSearch";
import { Button } from "@/components/ui/button";
import FilterSection from "./FilterSection";
import Link from "next/link";

function Listing({
  listing,
  recentListings,
  totalListings,
  hasSearched,
  searchLocation,
  handleSearchClick,
  searchedAddress,
  setBathCount,
  setBedCount,
  setParkingCount,
  setHomeType,
  setPriceRange, // Add this new prop
  setCoordinates,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const [address, setAddress] = useState();
  
  const renderListingCard = (item, index) => (
    <Link key={item.id} href={"/view-listing/" + item.id}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <div className="relative">
          <Image
            src={item.listingimages?.[0]?.url || "/images/apartment-placeholder.jpg"}
            width={300}
            height={160}
            className="w-full h-40 object-cover"
            alt={`Property ${index + 1}`}
          />
          <div className="absolute top-2 left-2 flex gap-2">
            {/* Status indicator for Rent or Sell with white background and purple text */}
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-primary border border-gray-200">
              {item.type === 'Rent' ? 'FOR RENT' : 'FOR SALE'}
            </span>
          </div>
          <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors">
            <Heart className="h-3 w-3 text-gray-600" />
          </button>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 mb-2">
            {item?.bedroom || 1} Bedroom {item?.propertyType || 'Apartment'}
          </h3>
          
          <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <BedDouble className="h-3 w-3" />
              <span>{item?.bedroom || 1}bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-3 w-3" />
              <span>{item?.bathroom || 1}bath</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="h-3 w-3" />
              <span>{item?.area || '8,725'}sqft</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{item?.address || '1998 Wufma Minnesota, Festac'}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900">
              ₦{item?.price?.toLocaleString() || '24,000,000'}
              {item.type === 'Rent' ? '/ month' : ''}
            </div>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1">
              Explore
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
  
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Search and Filter Section - No padding top to remove gap */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <GoogleAddressSearch
              selectedAddress={(v) => {
                searchedAddress(v);
                setAddress(v);
              }}
              setCoordinates={setCoordinates}
            />
          </div>
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6" 
            onClick={handleSearchClick}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <FilterSection
          setBathCount={setBathCount}
          setBedCount={setBedCount}
          setParkingCount={setParkingCount}
          setHomeType={setHomeType}
          setPriceRange={setPriceRange}
        />
      </div>

      {/* Search Results Count - Only show after search */}
      {hasSearched && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {totalListings} listings in {searchLocation || 'Lekki, Lagos'}
          </h1>
          <p className="text-gray-600 mt-1">Rent your next home at one of our properties.</p>
        </div>
      )}

      {/* Listings Content */}
      <div className="flex-1 p-6">
        {!hasSearched ? (
          /* Recent Listings - Show before search */
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Listings</h2>
              <div className="grid grid-cols-2 gap-4">
                {recentListings.map((item, index) => renderListingCard(item, index))}
              </div>
            </div>
          </>
        ) : (
          /* Search Results - Show after search */
          listing?.length > 0 ? (
            <>
              {/* 2x2 Grid Layout */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {listing.map((item, index) => renderListingCard(item, index))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className={currentPage === page ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Listing;
