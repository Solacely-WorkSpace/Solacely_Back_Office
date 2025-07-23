"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { BarChart, Building, Home, Users, TrendingUp, DollarSign } from 'lucide-react';
import DashboardStats from './_components/DashboardStats';
import RecentListings from './_components/RecentListings';
import PropertyChart from './_components/PropertyChart';
import RevenueChart from './_components/RevenueChart';

function AdminDashboard() {
  const { user, isSignedIn } = useUser();
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
    if (isSignedIn) {
      fetchDashboardStats();
    }
  }, [isSignedIn]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    
    try {
      // Get total listings count
      const { count: totalListings, error: listingsError } = await supabase
        .from('listing')
        .select('*', { count: 'exact', head: true });
      
      if (listingsError) {
        console.error('Error fetching total listings:', listingsError);
      }
      
      // Get sell listings count
      const { count: sellListings, error: sellError } = await supabase
        .from('listing')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'Sell');
      
      if (sellError) {
        console.error('Error fetching sell listings:', sellError);
      }
      
      // Get rent listings count
      const { count: rentListings, error: rentError } = await supabase
        .from('listing')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'Rent');
      
      if (rentError) {
        console.error('Error fetching rent listings:', rentError);
      }
      
      // Get all listings data for customers and revenue calculation
      const { data: allListings, error: dataError } = await supabase
        .from('listing')
        .select('createdBy, price, fullName, profileImage');
      
      if (dataError) {
        console.error('Error fetching listings data:', dataError);
      }
      
      // Calculate unique customers
      const uniqueCustomers = allListings ? 
        [...new Set(allListings.map(item => item.createdBy).filter(Boolean))] : [];
      
      // Calculate total revenue (sum of all listing prices)
      const totalRevenue = allListings?.reduce((sum, listing) => {
        const price = parseFloat(listing.price?.toString().replace(/[^\d.-]/g, '') || 0);
        return sum + price;
      }, 0) || 0;
      
      // Update stats
      setStats({
        totalListings: totalListings || 0,
        totalCustomers: uniqueCustomers.length || 0,
        totalRevenue: totalRevenue,
        totalReports: 183, // Static for demo - you can make this dynamic
        sellListings: sellListings || 0,
        rentListings: rentListings || 0
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