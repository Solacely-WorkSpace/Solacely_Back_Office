"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { BarChart, Building, Home, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardStats from './_components/DashboardStats';
import RecentListings from './_components/RecentListings';
import UserActivity from './_components/UserActivity';

function AdminDashboard() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalUsers: 0,
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
    
    // Get total listings count
    const { count: totalListings } = await supabase
      .from('listing')
      .select('*', { count: 'exact', head: true });
    
    // Get active listings count
    const { count: activeListings } = await supabase
      .from('listing')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);
    
    // Get sell listings count
    const { count: sellListings } = await supabase
      .from('listing')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'Sell');
    
    // Get rent listings count
    const { count: rentListings } = await supabase
      .from('listing')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'Rent');
    
    // Get unique users count (based on createdBy field)
    const { data } = await supabase
      .from('listing')
      .select('createdBy');
    
    // Process data to get unique users
    const uniqueUsers = data ? [...new Set(data.map(item => item.createdBy).filter(Boolean))] : [];
    
    setStats({
      totalListings: totalListings || 0,
      activeListings: activeListings || 0,
      totalUsers: uniqueUsers.length || 0,
      sellListings: sellListings || 0,
      rentListings: rentListings || 0
    });
    
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStats 
          title="Total Listings" 
          value={stats.totalListings} 
          icon={<Building className="h-8 w-8 text-blue-500" />} 
          change="+5%"
          loading={loading}
        />
        <DashboardStats 
          title="Active Listings" 
          value={stats.activeListings} 
          icon={<Home className="h-8 w-8 text-green-500" />} 
          change="+2%"
          loading={loading}
        />
        <DashboardStats 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users className="h-8 w-8 text-purple-500" />} 
          change="+8%"
          loading={loading}
        />
        <DashboardStats 
          title="Analytics" 
          value={`${stats.sellListings}/${stats.rentListings}`} 
          subtitle="Sell/Rent"
          icon={<BarChart className="h-8 w-8 text-orange-500" />} 
          loading={loading}
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentListings />
        </div>
        <div>
          <UserActivity />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;