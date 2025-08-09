"use client";
import React, { useEffect, useState } from "react";
import { listingsAPI } from "@/utils/api/listings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
// Add AlertDialog imports
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Add Plus to your imports at the top of the file
import { Search, Eye, Pencil, Trash, ChevronLeft, ChevronRight, Plus } from "lucide-react";

function ListingsManagement() {
  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]); // Store all listings for search/filter
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [imageErrors, setImageErrors] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
      const [locationFilter, setLocationFilter] = useState('all');
  // Add delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  
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
    // Open the custom dialog instead of using browser confirm
    setListingToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Function to execute the actual deletion after confirmation
  const confirmDelete = async () => {
    if (!listingToDelete) return;
    
    // Optimistic update - remove from UI immediately
    const originalListings = [...listings];
    const originalAllListings = [...allListings];
    setListings((prev) => prev.filter((listing) => listing.id !== listingToDelete));
    setAllListings((prev) => prev.filter((listing) => listing.id !== listingToDelete));

    try {
      await listingsAPI.deleteListing(listingToDelete);
      toast.success("Listing deleted successfully");
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('listingDeleted', {
        detail: { listingId: listingToDelete }
      }));
    } catch (error) {
      // Revert on error
      setListings(originalListings);
      setAllListings(originalAllListings);
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    } finally {
      // Reset state
      setListingToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  // Function to cancel deletion
  const cancelDelete = () => {
    setListingToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Enhanced status toggle with optimistic updates
  const toggleListingStatus = async (listingId) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;
  
    // Use correct backend status values: 'available' <-> 'rented' (instead of 'sold')
    const newStatus = listing.status === 'available' ? 'rented' : 'available';
    
    // Optimistic update
    setListings(prev => prev.map(l => 
      l.id === listingId ? { ...l, status: newStatus } : l
    ));
  
    try {
      await listingsAPI.updateListing(listingId, { status: newStatus });
      toast.success(`Listing marked as ${newStatus}`);
    } catch (error) {
      // Revert on error
      setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, status: listing.status } : l
      ));
      toast.error('Failed to update listing status');
      console.error('Error updating listing status:', error);
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

    // Update the useEffect that handles filtering (around line 80-120)
    useEffect(() => {
      let filteredListings = [...allListings];
    
      // Apply search filter
      if (searchTerm) {
        filteredListings = filteredListings.filter(
          (listing) =>
            (listing.location &&
              listing.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (listing.address &&
              listing.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (listing.title &&
              listing.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (listing.price && listing.price.toString().includes(searchTerm))
        );
      }
    
      // Apply type filter
      if (filterType !== 'all') {
        filteredListings = filteredListings.filter(
          (listing) => listing.listing_type === filterType || listing.type === filterType
        );
      }
    
      // Apply status filter
      if (filterStatus !== 'all') {
        filteredListings = filteredListings.filter(
          (listing) => listing.status === filterStatus
        );
      }
    
   
      filteredListings = filteredListings.filter(
        (listing) => 
          listing.location && 
          listing.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    
      setListings(filteredListings);
      setCurrentPage(1);
    }, [allListings, searchTerm, filterType, filterStatus, locationFilter]);
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
      {/* Add AlertDialog here */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              listing and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Listings Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-12 px-6"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button asChild className="bg-[#521282] hover:bg-[#521282]/90 text-white h-12 px-6 flex items-center gap-2">
            <Link href="/dashboard/add-new-listing">
              <Plus className="h-4 w-4" />
              Add New Listing
            </Link>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by location, address, title, or price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg w-full"
          />
        </div>
        <Button 
          onClick={handleSearch}
          className="h-12 px-6 bg-[#521282] hover:bg-[#521282]/90"
        >
          Search
        </Button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 min-w-fit">Type</span>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32 h-10 border-gray-200">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 min-w-fit">Status</span>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 h-10 border-gray-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 min-w-fit">Location</span>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-40 h-10 border-gray-200">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Lagos">Lagos</SelectItem>
              <SelectItem value="Abuja">Abuja</SelectItem>
              <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
              <SelectItem value="Kano">Kano</SelectItem>
              <SelectItem value="Ibadan">Ibadan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
                          <div className="relative h-20 w-28 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={imageUrl}
                              alt={
                                listing.location ||
                                listing.address ||
                                "Property image"
                              }
                              fill
                              className="object-contain"
                              onError={() => handleImageError(listing.id)}
                            />
                          </div>
                          <div>
                            {/* Location first */}
                            <p className="text-sm text-gray-600 mb-1">
                              {listing.location ||
                                listing.address ||
                                "Location not specified"}
                            </p>
                            
                            {/* Property name second */}
                            <p className="text-sm font-medium mb-2 truncate max-w-[250px]">
                              {listing.title ||
                                `${listing.building_type || listing.propertyType || "Property"} - ${
                                  listing.number_of_bedrooms || listing.bedroom || 0
                                } Bedroom`}
                            </p>
                            
                            {/* Bed, bath, sqft third - using actual data */}
                            <div className="flex items-center space-x-2 mb-2">
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
                                {listing.listing_type || listing.type || "Sale"}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {listing.number_of_bedrooms ||
                                  listing.bedroom ||
                                  0}{" "}
                                bed •{" "}
                                {listing.number_of_bathrooms ||
                                  listing.bathroom ||
                                  0}{" "}
                                bath • {listing.area_size_sqm || "N/A"} sqm
                              </span>
                            </div>
                            
                            {/* Price at the bottom */}
                            <h3
                              className="font-medium text-lg"
                              style={{ color: "#3DC5A1" }}
                            >
                              ₦
                              {listing.price
                                ? Number(listing.price).toLocaleString()
                                : "0"}
                            </h3>
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
