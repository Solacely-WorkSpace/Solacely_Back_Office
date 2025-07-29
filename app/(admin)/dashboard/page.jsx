"use client";
import React, { useEffect, useState } from 'react';
import { listingsAPI } from '@/utils/api/listings';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Building, Home, Users, TrendingUp, DollarSign } from 'lucide-react';
import DashboardStats from './_components/DashboardStats';
import RecentListings from './_components/RecentListings';
import PropertyChart from './_components/PropertyChart';
import RevenueChart from './_components/RevenueChart';

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  
  // Dummy data for demonstration
  const dummyData = {
    totalListings: 247,
    totalCustomers: 156,
    totalRevenue: 45600000,
    totalReports: 183,
    sellListings: 142,
    rentListings: 105,
    propertyTypes: {
      apartment: 89,
      'co-working': 23,
      hotel: 15,
      'real estate': 120
    }
  };
  
  // Initialize with dummy data to avoid loading state
  const [stats, setStats] = useState(dummyData);
  const [loading, setLoading] = useState(false); // Start with false
  const [usingDummyData, setUsingDummyData] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }

    // Listen for listing creation events
    const handleListingCreated = () => {
      console.log('New listing created, refreshing dashboard...');
      fetchDashboardStats();
    };

    window.addEventListener('listingCreated', handleListingCreated);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (isAuthenticated) {
        fetchDashboardStats();
      }
    }, 30000);

    return () => {
      window.removeEventListener('listingCreated', handleListingCreated);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Get all listings - this fetches ALL properties
      const allListings = await listingsAPI.getListings();
      const listings = allListings.results || allListings || [];
      
      console.log('Fetched listings:', listings); // Debug log
      
      // If no data from API, keep using dummy data
      if (!listings || listings.length === 0) {
        console.log('No API data found, keeping dummy data');
        setUsingDummyData(true);
        return;
      }
      
      // If we have real data, switch to it
      setLoading(true);
      
      // Get sell listings
      const sellListings = await listingsAPI.getListings({ type: 'Sell' });
      const sellCount = sellListings.results?.length || sellListings.length || 0;
      
      // Get rent listings
      const rentListings = await listingsAPI.getListings({ type: 'Rent' });
      const rentCount = rentListings.results?.length || rentListings.length || 0;
      
      // Calculate unique customers
      const uniqueCustomers = listings ? 
        [...new Set(listings.map(item => item.created_by).filter(Boolean))] : [];
      
      // Calculate total revenue (sum of all listing prices)
      const totalRevenue = listings?.reduce((sum, listing) => {
        const price = parseFloat(listing.price?.toString().replace(/[^\d.-]/g, '') || 0);
        return sum + price;
      }, 0) || 0;
      
      // Count property types with improved categorization
      const propertyTypes = {
        apartment: 0,
        'co-working': 0,
        hotel: 0,
        'real estate': 0
      };
      
      listings.forEach(item => {
        console.log('Processing item:', item.building_type, item.propertyType); // Debug log
        
        // Check multiple fields for property type
        const buildingType = (item.building_type || item.propertyType || item.type || '').toLowerCase();
        
        if (buildingType.includes('apartment') || buildingType.includes('flat')) {
          propertyTypes.apartment++;
        } else if (buildingType.includes('co-working') || buildingType.includes('coworking') || buildingType.includes('office')) {
          propertyTypes['co-working']++;
        } else if (buildingType.includes('hotel') || buildingType.includes('lodge') || buildingType.includes('resort')) {
          propertyTypes.hotel++;
        } else if (buildingType.includes('house') || buildingType.includes('villa') || buildingType.includes('duplex') || buildingType.includes('bungalow')) {
          propertyTypes['real estate']++;
        } else {
          // Default to apartment if no specific type found
          propertyTypes.apartment++;
        }
      });
      
      console.log('Property types breakdown:', propertyTypes); // Debug log
      
      // Update stats with real data or zeros
      setStats({
        totalListings: listings.length || 0, // This is the total count of ALL properties
        totalCustomers: uniqueCustomers.length || 0,
        totalRevenue: totalRevenue || 0,
        totalReports: 0,
        sellListings: sellCount,
        rentListings: rentCount,
        propertyTypes
      });
      
      setUsingDummyData(false);
      
    } catch (error) {
      console.error('Error in fetchDashboardStats:', error);
      // Keep dummy data on error
      console.log('API error, keeping dummy data');
      setUsingDummyData(true);
    } finally {
      setLoading(false);
    }
  };

  // Custom Total Properties Card Component
  const TotalPropertiesCard = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        {/* First Row: Total Properties with Icon */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Properties</h3>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalListings.toLocaleString()}
            </div>
            {usingDummyData && (
              <p className="text-xs text-blue-500 mt-1">Demo data</p>
            )}
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <Building className="h-6 w-6" style={{color: '#3DC5A1'}} />
          </div>
        </div>
        
        {/* Second Row: Property Types in 4 Columns */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Apartment</div>
            <div className="text-sm font-semibold text-gray-900">
              {stats.propertyTypes.apartment}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Co-working</div>
            <div className="text-sm font-semibold text-gray-900">
              {stats.propertyTypes['co-working']}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Hotel</div>
            <div className="text-sm font-semibold text-gray-900">
              {stats.propertyTypes.hotel}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Real Estate</div>
            <div className="text-sm font-semibold text-gray-900">
              {stats.propertyTypes['real estate']}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Stats Cards - Updated layout with more space for total properties */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-6">
        {/* Smaller stat cards - each takes 1 column */}
        <DashboardStats 
          title="Total Customers" 
          value={stats.totalCustomers.toLocaleString()} 
          subtitle={`${stats.totalCustomers} users`}
          change="+2.1%"
          icon={<Users className="h-5 w-5" style={{color: '#521282'}} />} 
          loading={loading}
          compact={true}
        />
        <DashboardStats 
          title="Total Amount" 
          value={`₦${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          subtitle={`Revenue`}
          change="+0.8%"
          icon={<DollarSign className="h-5 w-5" style={{color: '#3DC5A1'}} />} 
          loading={loading}
          compact={true}
        />
        <DashboardStats 
          title="Total Reports" 
          value={stats.totalReports.toLocaleString()}
          subtitle="Reports"
          change="+1.2%"
          icon={<BarChart className="h-5 w-5" style={{color: '#521282'}} />} 
          loading={loading}
          compact={true}
        />
        {/* Spacious Total Properties Card spanning 4 columns for more modern look */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3">
          <TotalPropertiesCard />
        </div>
      </div>
      
      {/* Main Content Grid - Adjusted proportions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Properties - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentListings />
        </div>
        
        {/* Right Sidebar - Only Visitors Chart */}
        <div className="space-y-6">
          <PropertyChart />
        </div>
      </div>
      
      {/* Revenue Chart - Full Width Below Recent Listings */}
      <div className="w-full">
        <RevenueChart />
      </div>
    </div>
  );
}

export default AdminDashboard;