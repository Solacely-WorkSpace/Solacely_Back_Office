"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listingsAPI } from '@/utils/api/listings';
import { toast } from 'sonner';

// Import components
import Sidebar from '../_components/Sidebar';
import DashboardHeader from '../_components/DashboardHeader';
import RentalInfoCard from '../_components/RentalInfoCard';
import ListingsGrid from '../_components/ListingsGrid';
import WishlistSection from '../_components/WishlistSection';
import DashboardStats from '../_components/DashboardStats';

function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasRentedApartment, setHasRentedApartment] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  
  const listingsPerPage = 6;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchListings();
      fetchWishlist();
    }
  }, [isAuthenticated, user]);

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
    try {
      const data = await listingsAPI.getListings({ active: true });
      setListings(data.results || data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      // Note: You'll need to implement wishlist API endpoints in Django
      // For now, using localStorage as fallback
      const savedWishlist = localStorage.getItem(`wishlist_${user.email}`);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlist = async (listingId) => {
    if (!user) {
      toast.error('Please sign in to add to wishlist');
      return;
    }

    const isInWishlist = wishlist.includes(listingId);
    
    try {
      let newWishlist;
      if (isInWishlist) {
        newWishlist = wishlist.filter(id => id !== listingId);
        toast.success('Removed from wishlist');
      } else {
        newWishlist = [...wishlist, listingId];
        toast.success('Added to wishlist');
      }
      
      setWishlist(newWishlist);
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(newWishlist));
    } catch (error) {
      toast.error('Failed to update wishlist');
      console.error('Error updating wishlist:', error);
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
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'md:ml-64' : 'md:ml-64'
      }`}>
        {/* Dashboard Header */}
        <DashboardHeader 
          user={user}
          toggleSidebar={toggleSidebar}
          activeView={activeView}
        />

        {/* Main Dashboard Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;