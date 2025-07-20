"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

function RecentListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listing")
      .select(`*, listingimages(url, listing_id)`)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) {
      setListings(data);
    }
    setLoading(false);
  };

  const handleDeleteListing = async (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await supabase.from("listing").delete().eq("id", id);

      fetchRecentListings();
    }
  };

  const toggleListingStatus = async (id, currentStatus) => {
    await supabase
      .from("listing")
      .update({ active: !currentStatus })
      .eq("id", id);

    fetchRecentListings();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Listings</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 animate-pulse rounded-md"
              ></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden">
                    <Image
                      src={
                        listing?.listingimages?.[0]?.url || "/placeholder.svg"
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
                      <Badge variant={listing.active ? "success" : "secondary"}>
                        {listing.active ? "Active" : "Draft"}
                      </Badge>
                      <Badge variant="outline">{listing.type}</Badge>
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
                    <Badge variant={listing.active ? "destructive" : "outline"}>
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
            ))}

            <div className="flex justify-end mt-4">
              <Button asChild variant="outline">
                <Link href="/dashboard/listings">View All Listings</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentListings;
