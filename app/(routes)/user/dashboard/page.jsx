"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

// Import components
import Sidebar from '../_components/Sidebar';
import DashboardHeader from '../_components/DashboardHeader';
import RentalInfoCard from '../_components/RentalInfoCard';
import ListingsGrid from '../_components/ListingsGrid';
import WishlistSection from '../_components/WishlistSection';
import DashboardStats from '../_components/DashboardStats';

function UserDashboard() {
  const { user, isSignedIn } = useUser();
  const [listings, setListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasRentedApartment, setHasRentedApartment] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); // New state for active view
  
  const listingsPerPage = 6;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (isSignedIn && user) {
      fetchListings();
      fetchWishlist();
    }
  }, [isSignedIn, user]);

  // Close mobile sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listing')
      .select(`*, listingimages(url, listing_id)`)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (data) {
      setListings(data);
    }
    if (error) {
      console.error('Error fetching listings:', error);
    }
    setLoading(false);
  };

  const fetchWishlist = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_wishlist')
      .select('listing_id')
      .eq('user_email', user.primaryEmailAddress.emailAddress);

    if (data) {
      setWishlist(data.map(item => item.listing_id));
    }
    if (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlist = async (listingId) => {
    if (!user) {
      toast.error('Please sign in to add to wishlist');
      return;
    }

    const isInWishlist = wishlist.includes(listingId);
    
    if (isInWishlist) {
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
    } else {
      const { error } = await supabase
        .from('user_wishlist')
        .insert({
          user_email: user.primaryEmailAddress.emailAddress,
          listing_id: listingId,
          created_at: new Date().toISOString()
        });

      if (!error) {
        setWishlist(prev => [...prev, listingId]);
        toast.success('Added to wishlist');
      } else {
        toast.error('Failed to add to wishlist');
        console.error('Error adding to wishlist:', error);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to render content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'wishlist':
        return (
          <WishlistSection 
            user={user}
            wishlist={wishlist}
            setWishlist={setWishlist}
          />
        );
      case 'wallet':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Wallet</h2>
            <p className="text-gray-600">Wallet functionality coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Settings</h2>
            <p className="text-gray-600">Settings functionality coming soon...</p>
          </div>
        );
      default: // dashboard
        return (
          <>
            {/* Rental Information Card Component */}
            <RentalInfoCard 
              hasRentedApartment={hasRentedApartment}
              rentedApartment={null} // Add rental data when available
            />

            {/* Listings Grid Component */}
            <ListingsGrid 
              listings={listings}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              currentPage={currentPage}
              listingsPerPage={listingsPerPage}
              handlePageChange={handlePageChange}
            />
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Component */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content */}
      <div className="md:ml-[250px] p-4 md:p-6">
        {/* Header Component */}
        <DashboardHeader user={user} toggleSidebar={toggleSidebar} />

        {/* Dynamic Content Based on Active View */}
        {renderContent()}
      </div>
    </div>
  );
}

export default UserDashboard;