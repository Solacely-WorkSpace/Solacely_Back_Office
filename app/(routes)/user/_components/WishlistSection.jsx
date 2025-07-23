"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, BedDouble, Bath, Ruler, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

function WishlistSection({ user, wishlist, setWishlist }) {
  const [wishlistListings, setWishlistListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length > 0) {
      fetchWishlistListings();
    } else {
      setWishlistListings([]);
      setLoading(false);
    }
  }, [wishlist]);

  const fetchWishlistListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listing')
      .select(`*, listingimages(url, listing_id)`)
      .in('id', wishlist)
      .eq('active', true);

    if (data) {
      setWishlistListings(data);
    }
    if (error) {
      console.error('Error fetching wishlist listings:', error);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (listingId) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_wishlist')
      .delete()
      .eq('user_email', user.primaryEmailAddress.emailAddress)
      .eq('listing_id', listingId);

    if (!error) {
      setWishlist(prev => prev.filter(id => id !== listingId));
      toast.success('Removed from wishlist');
    } else {
      toast.error('Failed to remove from wishlist');
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-3"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-4"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
        <div className="text-sm text-gray-600 mt-2 md:mt-0">
          {wishlistListings.length} {wishlistListings.length === 1 ? 'property' : 'properties'} saved
        </div>
      </div>

      {wishlistListings.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No saved properties yet</h3>
            <p className="text-gray-500 mb-4">Start exploring and save properties you like to see them here.</p>
            <Link href="/rent">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Explore Properties
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {wishlistListings.map((listing) => (
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
                  onClick={() => removeFromWishlist(listing.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow group"
                  title="Remove from wishlist"
                >
                  <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                </button>
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Saved
                </div>
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
                
                <div className="flex gap-2">
                  <Link href={`/view-listing/${listing.id}`} className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromWishlist(listing.id)}
                    className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistSection;