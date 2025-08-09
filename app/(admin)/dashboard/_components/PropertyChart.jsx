"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { listingsAPI } from '@/utils/api/listings';

const colors = ['#0062FF', '#3DD598', '#FFC542', '#8B5CF6', '#FF974A', '#EF4444'];

function PropertyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalListings, setTotalListings] = useState(0);

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    setLoading(true);
    try {
      const response = await listingsAPI.getListings({ status: 'available' });
      const listings = response.results || response;

      if (listings) {
        // Extract city/state from location and count occurrences
        const locationCounts = {};
        
        listings.forEach(listing => {
          if (listing.location) {
            // Extract the last part of the location (usually city/state)
            const locationParts = listing.location.split(',');
            let location = 'Other';
            
            if (locationParts.length >= 2) {
              location = locationParts[locationParts.length - 2].trim();
            } else if (locationParts.length === 1) {
              location = locationParts[0].trim();
            }
            
            // Clean up common location names
            if (location.toLowerCase().includes('lagos')) {
              location = 'Lagos';
            } else if (location.toLowerCase().includes('abuja')) {
              location = 'Abuja';
            }
            
            locationCounts[location] = (locationCounts[location] || 0) + 1;
          }
        });

        // Convert to chart data format
        const total = listings.length;
        setTotalListings(total);
        
        const chartData = Object.entries(locationCounts)
          .map(([name, count], index) => ({
            name,
            value: count,
            count,
            color: colors[index % colors.length]
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);

        setData(chartData);
      }
    } catch (error) {
      console.error('Error in fetchLocationData:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Visitors</CardTitle>
        <div className="text-right">
          <span className="text-sm text-gray-500">This Year</span>
          <select className="ml-2 text-sm border-none bg-transparent">
            <option>2022</option>
            <option>2023</option>
            <option>2024</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={77}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalListings.toLocaleString()}</div>
              <div className="text-sm text-gray-500"> Listings by Area</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertyChart;