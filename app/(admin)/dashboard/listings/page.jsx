"use client";
import React, { useEffect, useState } from "react";
import { listingsAPI } from "@/utils/api/listings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash, Search, Filter } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchListings();
  }, [filterType, filterStatus]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType && filterType !== "all") {
        params.type = filterType;
      }
      if (filterStatus === "active") {
        params.active = true;
      } else if (filterStatus === "inactive") {
        params.active = false;
      }

      const data = await listingsAPI.getListings(params);
      setListings(data.results || data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm) {
      fetchListings();
      return;
    }

    const filteredListings = listings.filter(
      (listing) =>
        listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.price.toString().includes(searchTerm)
    );

    setListings(filteredListings);
  };

  const handleDeleteListing = async (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await listingsAPI.deleteListing(id);
        toast.success('Listing deleted successfully');
        fetchListings();
      } catch (error) {
        console.error('Error deleting listing:', error);
        toast.error('Failed to delete listing');
      }
    }
  };

  const toggleListingStatus = async (id, currentStatus) => {
    try {
      await listingsAPI.updateListing(id, { active: !currentStatus });
      toast.success('Listing status updated');
      fetchListings();
    } catch (error) {
      console.error('Error updating listing status:', error);
      toast.error('Failed to update listing status');
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-6">Listings Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by address or price"
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
                  <SelectItem value="Sell">For Sale</SelectItem>
                  <SelectItem value="Rent">For Rent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Listings ({listings.length})</CardTitle>
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
            <div className="space-y-4">
              {listings.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  No listings found
                </p>
              ) : (
                listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={
                            (listing?.images?.[0]?.original_image_url ||
                             (listing?.images?.[0]?.image && 
                              listing?.images?.[0]?.image.startsWith('http') ? 
                              listing?.images?.[0]?.image : 
                              `https://res.cloudinary.com/${listing?.images?.[0]?.image}`)) ||
                            "/placeholder.svg"
                          }
                          alt={listing.address}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">${listing.price}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">
                          {listing.address}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={listing.active ? "success" : "secondary"}
                          >
                            {listing.active ? "Active" : "Draft"}
                          </Badge>
                          <Badge variant="outline">{listing.type}</Badge>
                          <span className="text-xs text-gray-500">
                            {listing.bedroom} bed • {listing.bathroom} bath •{" "}
                            {listing.area} sqft
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/view-listing/${listing.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/edit-listing/${listing.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleListingStatus(listing.id, listing.active)}
                      >
                        {listing.active ? "Deactivate" : "Activate"}
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
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ListingsManagement;
