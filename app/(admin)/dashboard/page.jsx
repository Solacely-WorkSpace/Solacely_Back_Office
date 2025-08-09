"use client";
import React, { useEffect, useState } from 'react';
import { listingsAPI } from '@/utils/api/listings';
import { adminAPI } from '@/utils/api/admin';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Building, Home, Users, TrendingUp, DollarSign } from 'lucide-react';
import DashboardStats from './_components/DashboardStats';
import RecentListings from './_components/RecentListings';
import PropertyChart from './_components/PropertyChart';
import RevenueChart from './_components/RevenueChart';

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  
  // Initialize with zero values instead of dummy data
  const initialData = {
    totalListings: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalReports: 0,
    sellListings: 0,
    rentListings: 0,
    propertyTypes: {
      apartment: 0,
      'co-working': 0,
      hotel: 0,
      'real estate': 0
    }
  };
  
  // Initialize with zero values
  const [stats, setStats] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [usingRealData, setUsingRealData] = useState(false);

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
    
    // Remove the auto-refresh interval
    // const interval = setInterval(() => {
    //   if (isAuthenticated) {
    //     fetchDashboardStats();
    //   }
    // }, 30000);

    return () => {
      window.removeEventListener('listingCreated', handleListingCreated);
      // clearInterval(interval); // Remove this as well since we removed the interval
    };
  }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch data from multiple endpoints concurrently
      const results = await Promise.allSettled([
        adminAPI.getDashboardStats(),
        adminAPI.getWalletStats(),
        adminAPI.getRevenueStats(),
        listingsAPI.getListings({ status: 'available' })
      ]);

      const [adminStatsResult, walletStatsResult, revenueStatsResult, listingsResult] = results;

      let newStats = { ...initialData };
      let hasRealData = false;

      // Process admin stats (users)
      if (adminStatsResult.status === 'fulfilled' && adminStatsResult.value && adminStatsResult.value.data) {
        const adminData = adminStatsResult.value.data;
        newStats.totalCustomers = adminData.total_users || 0;
        hasRealData = true;
      }
  
      // Process wallet stats
      if (walletStatsResult.status === 'fulfilled' && walletStatsResult.value && walletStatsResult.value.data) {
        const walletData = walletStatsResult.value.data;
        // You can use wallet data for additional metrics if needed
        hasRealData = true;
      }
  
      // Process revenue stats
      if (revenueStatsResult.status === 'fulfilled' && revenueStatsResult.value && revenueStatsResult.value.data) {
        const revenueData = revenueStatsResult.value.data;
        newStats.totalRevenue = revenueData.total_revenue || 0;
        hasRealData = true;
      }

      // Process listings data - Use same pattern as PropertyChart
      if (listingsResult.status === 'fulfilled') {
        const response = listingsResult.value;
        const listings = response.results || response; // Same pattern as PropertyChart
        
        // Always set the total listings count, even if it's 0
        newStats.totalListings = listings ? listings.length : 0;
        
        // Set hasRealData to true even if we have 0 listings
        hasRealData = true;
        
        if (listings && listings.length > 0) {
          // Count sell and rent listings directly from the existing data
          // instead of making additional API calls
          const sellCount = listings.filter(item => 
            (item.type || '').toLowerCase() === 'sell').length;
          
          const rentCount = listings.filter(item => 
            (item.type || '').toLowerCase() === 'rent').length;
          
          // Count property types with improved categorization
          const propertyTypes = {
            apartment: 0,
            'co-working': 0,
            hotel: 0,
            'real estate': 0
          };
          
          listings.forEach(item => {
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
          
          newStats.sellListings = sellCount;
          newStats.rentListings = rentCount;
          newStats.propertyTypes = propertyTypes;
        } else {
          // If no listings, set property types to 0
          newStats.propertyTypes = {
            apartment: 0,
            'co-working': 0,
            hotel: 0,
            'real estate': 0
          };
        }
      }
      
      // Always update stats (either with real data or zeros)
      setStats(newStats);
      setUsingRealData(hasRealData);
      
    } catch (error) {
      console.error('Error in fetchDashboardStats:', error);
      // Set to zero values on error
      setStats(initialData);
      setUsingRealData(false);
      
      // Add error handling to prevent redirect loops
      if (error.message && error.message.includes('Authentication failed')) {
        // Display error message instead of redirecting
        toast.error('Authentication error. Please try refreshing the page or logging in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Custom Total Properties Card Content
  const TotalPropertiesContent = () => {
    return (
      <div className="h-full flex flex-col justify-between">
        {/* First Row: Total Properties with Icon */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex-1">
            <h3 className="text-xs font-medium text-gray-600 mb-0.5">Total Properties</h3>
            <div className="text-lg font-bold text-gray-900 leading-tight">
              {stats.totalListings.toLocaleString()}
            </div>
            {!usingRealData && (
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">No data</p>
            )}
          </div>
          <div className="p-1.5 bg-green-50 rounded-lg flex-shrink-0">
          <img src="/Frame 162465-4.png" alt="Total Customers" className="h-6 w-6" />
          </div>
        </div>
        
        {/* Second Row: Property Types in 4 Columns */}
        <div className="grid grid-cols-4 gap-0.5 mt-1">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-0.5 leading-tight truncate">Apt</div>
            <div className="text-xs font-semibold text-gray-900 leading-tight">
              {stats.propertyTypes.apartment}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-0.5 leading-tight truncate">Co-work</div>
            <div className="text-xs font-semibold text-gray-900 leading-tight">
              {stats.propertyTypes['co-working']}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-0.5 leading-tight truncate">Hotel</div>
            <div className="text-xs font-semibold text-gray-900 leading-tight">
              {stats.propertyTypes.hotel}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-0.5 leading-tight truncate">Estate</div>
            <div className="text-xs font-semibold text-gray-900 leading-tight">
              {stats.propertyTypes['real estate']}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Stats Cards - Updated layout with consistent sizing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStats 
          title="Total Customers" 
          value={stats.totalCustomers.toLocaleString()} 
         
          change="+2.1%"
          icon={<img src="/Frame 162465.png" alt="Total Customers" className="h-6 w-6" />} 
          loading={loading}
          showDate={true}
        />
        <DashboardStats 
          title="Total Amount" 
          value={`₦${(stats.totalRevenue / 1000000).toFixed(1)}M`}
         
          change="+0.8%"
          icon={<img src="/Frame 162465-2.png" alt="Total Customers" className="h-6 w-6" />} 
          loading={loading}
          showDate={true}
        />
        <DashboardStats 
          title="Total Reports" 
          value={stats.totalReports.toLocaleString()}
         
          change="+1.2%"
          icon={<img src="/Frame 162465-3.png" alt="Total Customers" className="h-6 w-6" />} 
          loading={loading}
          showDate={true}
        />
        <DashboardStats 
          loading={loading}
          customContent={<TotalPropertiesContent />}
        />
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