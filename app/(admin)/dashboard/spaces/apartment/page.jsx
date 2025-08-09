"use client";
import React, { useEffect, useState } from "react";
import { listingsAPI } from "@/utils/api/listings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function ApartmentPage() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  // Add this new state to track failed images
  const [imageErrors, setImageErrors] = useState(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState(null);

  useEffect(() => {
    fetchApartments();
  }, [filterType, filterStatus, filterLocation, sortBy, sortOrder]);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {};

      // Add type filter
      if (filterType !== "all") {
        params.type = filterType;
      }

      // Add status filter
      if (filterStatus === "active") {
        params.active = true;
      } else if (filterStatus === "inactive") {
        params.active = false;
      }

      // Add location filter (will be handled by backend)
      if (filterLocation !== "all") {
        params.location = filterLocation;
      }

      // Add sorting
      params.ordering = sortOrder === "asc" ? sortBy : `-${sortBy}`;

      // Fetch data using the API
      const response = await listingsAPI.getListings(params);
      const data = response.results || response;
      setApartments(data || []);
    } catch (error) {
      console.error("Error fetching apartments:", error);
      toast.error("Failed to fetch apartments");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm) {
      fetchApartments();
      return;
    }

    const filteredApartments = apartments.filter(
      (apartment) =>
        apartment.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apartment.price?.toString().includes(searchTerm)
    );

    setApartments(filteredApartments);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Updated to format price in Naira
  const formatPrice = (price) => {
    if (!price) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("NGN", "₦");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Updated status badges with complementary colors
  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 font-medium rounded-md">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 font-medium rounded-md">
        Inactive
      </Badge>
    );
  };

  // Helper function to get proper image URL
  const getImageUrl = (apartment) => {
    // If this listing's image has already failed, return placeholder immediately
    if (imageErrors.has(apartment.id)) {
      return "/icons/Logo.svg";
    }

    // The API returns images under 'images' field, not 'listingimages'
    if (apartment?.images && apartment.images.length > 0) {
      const firstImage = apartment.images[0];

      // Check for original_image_url first (highest priority)
      if (firstImage.original_image_url && firstImage.original_image_url.startsWith("http")) {
        // Validate that it's not a broken Cloudinary URL
        if (
          firstImage.original_image_url.includes("cloudinary.com") &&
          (firstImage.original_image_url.includes("undefined") ||
            firstImage.original_image_url.includes("null") ||
            firstImage.original_image_url.includes("placeholder"))
        ) {
          return "/icons/Logo.svg";
        }
        return firstImage.original_image_url;
      }

      // Check for image field (Cloudinary field)
      if (firstImage.image) {
        // If it's already a full URL, use it
        if (firstImage.image.startsWith && firstImage.image.startsWith("http")) {
          // Validate that it's not a broken Cloudinary URL
          if (
            firstImage.image.includes("cloudinary.com") &&
            (firstImage.image.includes("undefined") || 
             firstImage.image.includes("null") ||
             firstImage.image.includes("placeholder"))
          ) {
            return "/icons/Logo.svg";
          }
          return firstImage.image;
        }
        // For Cloudinary fields, the image field might be an object
        if (typeof firstImage.image === 'object' && firstImage.image.url) {
          return firstImage.image.url;
        }
        // If it's a string path, construct the full URL
        if (typeof firstImage.image === 'string') {
          if (firstImage.image.includes("cloudinary")) {
            return firstImage.image;
          } else {
            return `https://res.cloudinary.com/dsar6jtux/image/upload/${firstImage.image}`;
          }
        }
      }
    }

    // Fallback to placeholder
    return "/icons/Logo.svg";
  };

  // Add this function to handle image errors
  const handleImageError = (apartmentId) => {
    console.log(`Image failed to load for apartment ${apartmentId}, switching to placeholder`);
    setImageErrors((prev) => new Set([...prev, apartmentId]));
  };

  // Add this new function to handle listing deletion
  const handleDeleteListing = async (id) => {
    // Open the custom dialog instead of using browser confirm
    setApartmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Function to execute the actual deletion after confirmation
  const confirmDelete = async () => {
    if (!apartmentToDelete) return;
    
    // Optimistic update - remove from UI immediately
    const originalApartments = [...apartments];
    setApartments((prev) => prev.filter((apartment) => apartment.id !== apartmentToDelete));

    try {
      // Delete in backend
      // In confirmDelete function after successful deletion:
      try {
        await listingsAPI.deleteListing(apartmentToDelete);
        toast.success("Apartment listing deleted successfully");
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('listingDeleted'));
      } catch (error) {
        // Error handling...
      }
    } catch (error) {
      // Revert on error
      setApartments(originalApartments);
      console.error("Error deleting apartment listing:", error);
      toast.error("Failed to delete apartment listing");
    } finally {
      // Reset state
      setApartmentToDelete(null);
      setDeleteDialogOpen(false);
    }
};

  // Function to cancel deletion
  const cancelDelete = () => {
    setApartmentToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="flex-1 p-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Apartment Listings</h1>
        <Button className="bg-[#521282] hover:bg-[#521282]/90 text-white h-12 px-6 flex items-center gap-2" asChild>
          <Link href="/dashboard/add-new-listing">
            <Plus className="h-4 w-4" />
            Add new
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by address or price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg w-full"
          />
        </div>
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
              <SelectItem value="Rent">For Rent</SelectItem>
              <SelectItem value="Sell">For Sale</SelectItem>
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
              <SelectItem value="active">For rent</SelectItem>
              <SelectItem value="inactive">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 min-w-fit">Location</span>
          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger className="w-32 h-10 border-gray-200">
              <SelectValue placeholder="Lagos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Lagos">Lagos</SelectItem>
              <SelectItem value="Abuja">Abuja</SelectItem>
              <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 min-w-fit">Date</span>
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value) => {
              const [column, order] = value.split("-");
              setSortBy(column);
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="w-40 h-10 border-gray-200">
              <SelectValue placeholder="Past 30 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Past 30 Days</SelectItem>
              <SelectItem value="created_at-asc">Oldest First</SelectItem>
              <SelectItem value="price-desc">Price High to Low</SelectItem>
              <SelectItem value="price-asc">Price Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

 <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              apartment listing and remove the data from our servers.
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
      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-[50px] text-center">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("address")}
                >
                  <div className="flex items-center gap-2">
                    Title/Property ID
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("address")}
                >
                  <div className="flex items-center gap-2">
                    Location
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : apartments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    No apartments found
                  </TableCell>
                </TableRow>
              ) : (
                apartments.map((apartment) => (
                  <TableRow key={apartment.id} className="hover:bg-gray-50">
                    <TableCell className="text-center">
                      <input type="checkbox" className="rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-20 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            key={`${apartment.id}-${imageErrors.has(apartment.id) ? 'placeholder' : 'image'}`}
                            src={getImageUrl(apartment)}
                            alt={apartment.address || "Property"}
                            fill
                            className={getImageUrl(apartment) === "/icons/Logo.svg" ? "object-contain p-2" : "object-cover"}
                            onError={() => {
                              handleImageError(apartment.id);
                            }}
                            onLoad={() => {
                              // Optional: Log successful image loads for debugging
                              if (process.env.NODE_ENV === 'development') {
                                console.log(`Image loaded successfully for apartment ${apartment.id}`);
                              }
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {apartment.title ||
                              `${
                                apartment.propertyType ||
                                apartment.building_type ||
                                "Property"
                              } - ${
                                apartment.bedroom ||
                                apartment.number_of_bedrooms ||
                                0
                              } Bedroom`}
                          </div>
                          <div className="text-xs text-gray-500">
                            RH-{apartment.id.toString().padStart(4, "0")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(apartment.created_at)}
                      </div>
                      <div className="text-xs text-gray-500">
                        at{" "}
                        {new Date(apartment.created_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {apartment.location ||
                          (apartment.address
                            ? apartment.address
                                .split(",")
                                .slice(-2)
                                .join(",")
                                .trim()
                            : "No address")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold" style={{ color: "#3DC5A1" }}>
                        {formatPrice(apartment.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {apartment.type === "Rent" ? "Monthly" : "Total"}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(apartment.active)}</TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-500">
                        {apartment.propertyType ||
                          apartment.building_type ||
                          "Property"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/view-listing/${apartment.id}`}
                            >
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/edit-listing/${apartment.id}`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteListing(apartment.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApartmentPage;
