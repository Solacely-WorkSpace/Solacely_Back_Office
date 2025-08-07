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
            src={item.listingimages?.[0]?.url || "/icons/Logo.svg"}
            width={300}
            height={160}
            className="w-full h-32 sm:h-40 object-cover"
            alt={`Property ${index + 1}`}
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-primary border border-gray-200">
              {item.type === 'Rent' ? 'FOR RENT' : 'FOR SALE'}
            </span>
          </div>
          <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors">
            <Heart className="h-3 w-3 text-gray-600" />
          </button>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-1">
            {item?.bedroom || 1} Bedroom {item?.propertyType || 'Apartment'}
          </h3>
          
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-600 mb-2 flex-wrap">
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
              <span className="hidden sm:inline">{item?.area || '8,725'}sqft</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{item?.address || '1998 Wufma Minnesota, Festac'}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900">
              <span className="block sm:inline">₦{item?.price?.toLocaleString() || '24,000,000'}</span>
              {item.type === 'Rent' && <span className="text-xs text-gray-600">/ month</span>}
            </div>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-2 sm:px-3 py-1">
              Explore
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
  
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Search and Filter Section - Mobile optimized */}
      <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 w-full sm:w-auto" 
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

      {/* Search Results Count - Mobile optimized */}
      {hasSearched && (
        <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {totalListings} listings in {searchLocation || 'Lekki, Lagos'}
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Rent your next home at one of our properties.</p>
        </div>
      )}

      {/* Listings Content - Responsive grid */}
      <div className="flex-1 p-3 sm:p-6">
        {!hasSearched ? (
          /* Recent Listings - Responsive grid */
          <>
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recent Listings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {recentListings.map((item, index) => renderListingCard(item, index))}
              </div>
            </div>
          </>
        ) : (
          /* Search Results - Responsive grid */
          listing?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                {listing.map((item, index) => renderListingCard(item, index))}
              </div>

              {/* Pagination - Mobile optimized */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  
                  <div className="flex gap-1 max-w-xs overflow-x-auto">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(page)}
                          className={`min-w-[32px] text-xs sm:text-sm ${
                            currentPage === page ? "bg-emerald-500 hover:bg-emerald-600" : ""
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">No properties found matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Listing;
