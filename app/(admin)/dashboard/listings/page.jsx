"use client";
import React, { useEffect, useState } from "react";
import { listingsAPI } from "@/utils/api/listings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Pencil,
  Trash,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ListingsManagement() {
  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]); // Store all listings for search/filter
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [imageErrors, setImageErrors] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchListings();

    // Listen for listing creation events
    const handleListingCreated = (event) => {
      console.log("New listing created:", event.detail);
      fetchListings(false); // Refresh without loading spinner
    };

    window.addEventListener("listingCreated", handleListingCreated);

    return () => {
      window.removeEventListener("listingCreated", handleListingCreated);
    };
  }, [filterType, filterStatus]);

  // Update pagination when listings change
  useEffect(() => {
    const total = Math.ceil(listings.length / itemsPerPage);
    setTotalPages(total);
    // Reset to page 1 if current page exceeds total pages
    if (currentPage > total && total > 0) {
      setCurrentPage(1);
    }
  }, [listings, itemsPerPage, currentPage]);

  // Enhanced fetchListings with better error handling
  const fetchListings = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(!showLoading);
    try {
      const params = {};
      if (filterType && filterType !== "all") {
        params.listing_type = filterType;
      }
      if (filterStatus === "active") {
        params.status = "available";
      } else if (filterStatus === "inactive") {
        params.status = "sold";
      }

      const data = await listingsAPI.getListings(params);
      console.log("Fetched listings:", data);
      const fetchedListings = data.results || data;
      setAllListings(fetchedListings);
      setListings(fetchedListings);
      setCurrentPage(1); // Reset to first page when fetching new data

      // Clear image errors when refreshing data
      setImageErrors(new Set());
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to fetch listings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Enhanced delete with optimistic updates
  const handleDeleteListing = async (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      // Optimistic update
      const originalListings = [...listings];
      const originalAllListings = [...allListings];
      setListings((prev) => prev.filter((listing) => listing.id !== id));
      setAllListings((prev) => prev.filter((listing) => listing.id !== id));

      try {
        await listingsAPI.deleteListing(id);
        toast.success("Listing deleted successfully");
      } catch (error) {
        // Revert on error
        setListings(originalListings);
        setAllListings(originalAllListings);
        console.error("Error deleting listing:", error);
        toast.error("Failed to delete listing");
      }
    }
  };

  // Enhanced status toggle with optimistic updates
  const toggleListingStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "available" ? "sold" : "available";

    // Optimistic update
    const originalListings = [...listings];
    const originalAllListings = [...allListings];
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, status: newStatus } : listing
      )
    );
    setAllListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, status: newStatus } : listing
      )
    );

    try {
      await listingsAPI.updateListing(id, { status: newStatus });
      toast.success("Listing status updated");
    } catch (error) {
      // Revert on error
      setListings(originalListings);
      setAllListings(originalAllListings);
      console.error("Error updating listing status:", error);
      toast.error("Failed to update listing status");
    }
  };

  // Add refresh functionality
  const handleRefresh = () => {
    fetchListings(false); // Don't show loading spinner for refresh
  };

  // Enhanced image URL handling with error tracking
  const getImageUrl = (listing) => {
    // If this listing's image has failed before, use placeholder immediately
    if (imageErrors.has(listing.id)) {
      return "/icons/Logo.svg";
    }

    // Check for images array first (current API structure)
    if (
      listing?.images &&
      Array.isArray(listing.images) &&
      listing.images.length > 0
    ) {
      const firstImage = listing.images[0];

      // Check for original_image_url
      if (
        firstImage.original_image_url &&
        firstImage.original_image_url !== "undefined"
      ) {
        return firstImage.original_image_url;
      }

      // Check for image field with full URL
      if (firstImage.image && firstImage.image.startsWith("http")) {
        return firstImage.image;
      }

      // Check for image field with valid Cloudinary path
      if (
        firstImage.image &&
        firstImage.image !== "undefined" &&
        !firstImage.image.includes("undefined")
      ) {
        if (
          firstImage.image.startsWith("v1/") ||
          firstImage.image.includes("/")
        ) {
          return `https://res.cloudinary.com/dsar6jtux/image/upload/${firstImage.image}`;
        }
      }
    }

    // Return proper fallback image
    return "/icons/Logo.svg";
  };

  // Handle image load errors
  const handleImageError = (listingId) => {
    console.log(
      `Image failed to load for listing ${listingId}, switching to placeholder`
    );
    setImageErrors((prev) => new Set([...prev, listingId]));
  };

  const handleSearch = () => {
    if (!searchTerm) {
      setListings(allListings);
      setCurrentPage(1);
      return;
    }

    const filteredListings = allListings.filter(
      (listing) =>
        (listing.location &&
          listing.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (listing.address &&
          listing.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (listing.title &&
          listing.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (listing.price && listing.price.toString().includes(searchTerm))
    );

    setListings(filteredListings);
    setCurrentPage(1); // Reset to first page after search
  };

  // Pagination functions
  const getCurrentPageListings = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return listings.slice(startIndex, endIndex);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const currentPageListings = getCurrentPageListings();
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, listings.length);

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Listings Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button asChild>
            <Link href="/dashboard/add-new-listing">Add New Listing</Link>
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by location, address, title, or price"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Available</SelectItem>
                  <SelectItem value="inactive">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Listings ({listings.length})</CardTitle>
            {listings.length > 0 && (
              <div className="text-sm text-gray-500">
                Showing {startIndex}-{endIndex} of {listings.length} listings
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-100 animate-pulse rounded-md"
                ></div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentPageListings.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    No listings found
                  </p>
                ) : (
                  currentPageListings.map((listing) => {
                    const imageUrl = getImageUrl(listing);
                    console.log(`Listing ${listing.id} image URL:`, imageUrl);

                    return (
                      <div
                        key={listing.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={
                                listing.location ||
                                listing.address ||
                                "Property image"
                              }
                              fill
                              className="object-cover"
                              onError={() => handleImageError(listing.id)}
                            />
                          </div>
                          <div>
                            <h3
                              className="font-medium text-lg"
                              style={{ color: "#3DC5A1" }}
                            >
                              ₦
                              {listing.price
                                ? Number(listing.price).toLocaleString()
                                : "0"}
                            </h3>
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">
                              {listing.location ||
                                listing.address ||
                                "Location not specified"}
                            </p>
                            <p className="text-sm font-medium truncate max-w-[250px]">
                              {listing.title ||
                                `${listing.building_type || "Property"} - ${
                                  listing.number_of_bedrooms || 0
                                } Bedroom`}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant={
                                  listing.status === "available"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {listing.status === "available"
                                  ? "Available"
                                  : listing.status || "Draft"}
                              </Badge>
                              <Badge variant="outline">
                                {listing.listing_type || "Sale"}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {listing.number_of_bedrooms ||
                                  listing.bedroom ||
                                  0}{" "}
                                bed •{" "}
                                {listing.number_of_bathrooms ||
                                  listing.bathroom ||
                                  0}{" "}
                                bath • {listing.area || "N/A"} sqft
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" asChild>
                            <Link
                              href={`/dashboard/view-listing/${listing.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <Link
                              href={`/dashboard/edit-listing/${listing.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              toggleListingStatus(listing.id, listing.status)
                            }
                          >
                            {listing.status === "available"
                              ? "Mark as Sold"
                              : "Mark as Available"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteListing(listing.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex space-x-1">
                      {getPageNumbers().map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ListingsManagement;
