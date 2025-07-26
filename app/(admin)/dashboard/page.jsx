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
  const [stats, setStats] = useState({
    totalListings: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalReports: 0,
    sellListings: 0,
    rentListings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    
    try {
      // Get all listings
      const allListings = await listingsAPI.getListings();
      const listings = allListings.results || allListings;
      
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
      
      // Update stats
      setStats({
        totalListings: listings?.length || 0,
        totalCustomers: uniqueCustomers.length || 0,
        totalRevenue: totalRevenue,
        totalReports: 183, // Static for demo - you can make this dynamic
        sellListings: sellCount,
        rentListings: rentCount
      });
      
    } catch (error) {
      console.error('Error in fetchDashboardStats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Stats Cards - Moved to top with better spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStats 
          title="Total Customers" 
          value={stats.totalCustomers.toLocaleString()} 
          subtitle={`${stats.totalCustomers} unique users`}
          change="+2.1% vs last week"
          icon={<Users className="h-6 w-6" style={{color: '#521282'}} />} 
          loading={loading}
          variant="purple"
        />
        <DashboardStats 
          title="Total Amount" 
          value={`₦${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          subtitle={`₦${stats.totalRevenue.toLocaleString()}`}
          change="+0.8% vs last week"
          icon={<DollarSign className="h-6 w-6" style={{color: '#3DC5A1'}} />} 
          loading={loading}
          variant="green"
        />
        <DashboardStats 
          title="Total Reports" 
          value={stats.totalReports.toLocaleString()}
          subtitle="System reports"
          change="+1.2% vs last week"
          icon={<BarChart className="h-6 w-6" style={{color: '#521282'}} />} 
          loading={loading}
          variant="purple"
        />
        <DashboardStats 
          title="Total Properties" 
          value={stats.totalListings.toLocaleString()}
          subtitle={`${stats.sellListings} Sell / ${stats.rentListings} Rent`}
          change={`${((stats.sellListings + stats.rentListings) / Math.max(stats.totalListings, 1) * 100).toFixed(1)}% active`}
          icon={<Building className="h-6 w-6" style={{color: '#3DC5A1'}} />} 
          loading={loading}
          variant="green"
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