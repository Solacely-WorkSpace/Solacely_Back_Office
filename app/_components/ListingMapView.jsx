"use client";
import React, { useEffect, useState } from "react";
import Listing from "./Listing";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import GoogleMapSection from "./GoogleMapSection";
import Nav from "../../components/nav";

function ListingMapView({ type }) {
  const [listing, setListing] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [searchedAddress, setSearchedAddress] = useState();
  const [bedCount, setBedCount] = useState(0);
  const [bathCount, setBathCount] = useState(0);
  const [parkingCount, setParkingCount] = useState(0);
  const [homeType, setHomeType] = useState();
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [coordinates, setCoordinates] = useState();
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const listingsPerPage = 4;

  useEffect(() => {
    getLatestListing();
  }, []);

  const getLatestListing = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select(
        `*,listingimages(
            url,
            listing_id
        )`
      )
      .eq("active", true)
      // Remove the type filter to get both rent and sell
      // .eq("type", type)
      .order("id", { ascending: false })
      .limit(4); // Get only 4 recent listings

    if (data) {
      setRecentListings(data);
      setListing(data);
      setTotalListings(data.length);
    }
    if (error) {
      toast("Server Side Error");
    }
  };

  const handleSearchClick = async () => {
    setHasSearched(true);
    setCurrentPage(1);

    const searchTerm = searchedAddress?.value?.structured_formatting?.main_text;
    setSearchLocation(searchTerm || "Selected Area");

    let query = supabase
      .from("listing")
      .select(
        `*,listingimages(
            url,
            listing_id
        )`
      )
      .eq("active", true)
      .eq("type", type)
      .order("id", { ascending: false });

    // Apply filters
    if (bedCount > 0) {
      query = query.gte("bedroom", bedCount);
    }
    if (bathCount > 0) {
      query = query.gte("bathroom", bathCount);
    }
    if (parkingCount > 0) {
      query = query.gte("parking", parkingCount);
    }
    if (searchTerm) {
      query = query.like("address", "%" + searchTerm + "%");
    }
    if (homeType) {
      query = query.eq("propertyType", homeType);
    }
    // Add price range filtering
    if (priceRange.min && priceRange.min !== "") {
      query = query.gte("regularPrice", parseInt(priceRange.min));
    }
    if (priceRange.max && priceRange.max !== "") {
      query = query.lte("regularPrice", parseInt(priceRange.max));
    }

    const { data, error } = await query;
    if (data) {
      setListing(data);
      setTotalListings(data.length);
    }
    if (error) {
      toast("Search Error");
    }
  };

  // Get current listings for pagination
  const getCurrentListings = () => {
    const startIndex = (currentPage - 1) * listingsPerPage;
    const endIndex = startIndex + listingsPerPage;
    return listing.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(totalListings / listingsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Nav />

      {/* Main content - Responsive layout */}
      <div className="flex flex-col lg:flex-row min-h-screen pt-7 lg:pt-7">
        {/* Map Section - Top on mobile, Left on desktop */}
        <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-full order-2 lg:order-1">
          <GoogleMapSection
            listing={getCurrentListings()}
            coordinates={coordinates}
          />
        </div>

        {/* Listings Section - Bottom on mobile, Right on desktop */}
        <div className="w-full lg:w-1/2 flex-1 lg:h-full overflow-y-auto bg-white order-1 lg:order-2">
          <Listing
            listing={getCurrentListings()}
            recentListings={recentListings}
            totalListings={totalListings}
            hasSearched={hasSearched}
            searchLocation={searchLocation}
            handleSearchClick={handleSearchClick}
            searchedAddress={(v) => setSearchedAddress(v)}
            setBathCount={setBathCount}
            setBedCount={setBedCount}
            setParkingCount={setParkingCount}
            setHomeType={setHomeType}
            setPriceRange={setPriceRange}
            setCoordinates={setCoordinates}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ListingMapView;
