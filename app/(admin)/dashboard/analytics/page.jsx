"use client";
import React, { useEffect, useState } from 'react';
import { listingsAPI } from '@/utils/api/listings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardStats from '../_components/DashboardStats';
import { Building, TrendingUp, DollarSign, BarChart } from 'lucide-react';

function Analytics() {
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    sellListings: 0,
    rentListings: 0,
    averagePrice: 0,
    averageBedrooms: 0,
    averageBathrooms: 0,
    propertyTypes: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    try {
      const response = await listingsAPI.getListings();
      const data = response.results || response;
      
      if (data) {
        // Calculate statistics
        const totalListings = data.length;
        const activeListings = data.filter(item => item.status === 'available').length;
        const sellListings = data.filter(item => item.listing_type === 'sale').length;
        const rentListings = data.filter(item => item.listing_type === 'rent').length;
        
        // Calculate averages
        const prices = data.map(item => item.price).filter(Boolean);
        const averagePrice = prices.length > 0 
          ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) 
          : 0;
        
        const bedrooms = data.map(item => item.number_of_bedrooms).filter(Boolean);
        const averageBedrooms = bedrooms.length > 0
          ? (bedrooms.reduce((sum, count) => sum + count, 0) / bedrooms.length).toFixed(1)
          : 0;
        
        const bathrooms = data.map(item => item.number_of_bathrooms).filter(Boolean);
        const averageBathrooms = bathrooms.length > 0
          ? (bathrooms.reduce((sum, count) => sum + count, 0) / bathrooms.length).toFixed(1)
          : 0;
        
        // Count property types
        const propertyTypes = {};
        data.forEach(item => {
          if (item.building_type) {
            propertyTypes[item.building_type] = (propertyTypes[item.building_type] || 0) + 1;
          }
        });
        
        setStats({
          totalListings,
          activeListings,
          sellListings,
          rentListings,
          averagePrice,
          averageBedrooms,
          averageBathrooms,
          propertyTypes
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    
    setLoading(false);
  };

  // Helper function to render a simple bar chart
  const renderBarChart = (data, title) => {
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{key}</span>
                <span>{value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStats
          title="Total Listings"
          value={stats.totalListings.toLocaleString()}
          subtitle="Properties"
          change="+5.2%"
          icon={<Building className="h-4 w-4 text-purple-600" />}
          loading={loading}
        />
        
        <DashboardStats
          title="Active Listings"
          value={stats.activeListings.toLocaleString()}
          subtitle={`${stats.totalListings > 0 ? Math.round((stats.activeListings / stats.totalListings) * 100) : 0}% of total`}
          change="+2.1%"
          icon={<TrendingUp className="h-4 w-4 text-green-600" />}
          loading={loading}
        />
        
        <DashboardStats
          title="Average Price"
          value={`$${stats.averagePrice.toLocaleString()}`}
          subtitle="Per property"
          change="+1.8%"
          icon={<DollarSign className="h-4 w-4 text-blue-600" />}
          loading={loading}
        />
        
        <DashboardStats
          title="Listing Types"
          value={`${stats.sellListings}/${stats.rentListings}`}
          subtitle="Sell/Rent"
          change="+0.5%"
          icon={<BarChart className="h-4 w-4 text-orange-600" />}
          loading={loading}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Property Characteristics</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-gray-100 animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Average Specifications</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <p className="text-xl font-bold">{stats.averageBedrooms}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="text-xl font-bold">{stats.averageBathrooms}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Price/Bedroom</p>
                      <p className="text-xl font-bold">
                        ${Math.round(stats.averagePrice / stats.averageBedrooms).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {renderBarChart(
                  { 'For Sale': stats.sellListings, 'For Rent': stats.rentListings },
                  'Listing Distribution'
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Property Types</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-gray-100 animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : (
              renderBarChart(stats.propertyTypes, 'Distribution by Property Type')
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;