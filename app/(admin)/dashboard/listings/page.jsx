"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
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
    let query = supabase
      .from("listing")
      .select(`*, listingimages(url, listing_id)`);

    if (filterType) {
      query = query.eq("type", filterType);
    }

    if (filterStatus === "active") {
      query = query.eq("active", true);
    } else if (filterStatus === "inactive") {
      query = query.eq("active", false);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (data) {
      setListings(data);
    }
    setLoading(false);
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
      await supabase.from("listing").delete().eq("id", id);

      fetchListings();
    }
  };

  const toggleListingStatus = async (id, currentStatus) => {
    await supabase
      .from("listing")
      .update({ active: !currentStatus })
      .eq("id", id);

    fetchListings();
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
                            listing?.listingimages?.[0]?.url ||
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
                        onClick={() =>
                          toggleListingStatus(listing.id, listing.active)
                        }
                      >
                        <Badge
                          variant={listing.active ? "destructive" : "success"}
                        >
                          {listing.active ? "Deactivate" : "Activate"}
                        </Badge>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
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
