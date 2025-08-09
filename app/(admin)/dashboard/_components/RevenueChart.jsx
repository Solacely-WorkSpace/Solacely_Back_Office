"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { adminAPI } from '@/utils/api/admin';
import { Skeleton } from '@/components/ui/skeleton';

function RevenueChart({ initialData, loading: parentLoading }) {
  const [revenueData, setRevenueData] = useState(initialData || {
    monthly_data: [],
    total_revenue: 0,
    percentage_change: 0
  });
  const [loading, setLoading] = useState(parentLoading || true);

  useEffect(() => {
    // Update from parent data if provided
    if (initialData) {
      setRevenueData(initialData);
      setLoading(parentLoading);
    } else {
      // Only fetch if no initial data provided
      const fetchRevenueData = async () => {
        setLoading(true);
        try {
          const data = await adminAPI.getMonthlyRevenue();
          // Add null check
          if (data) {
            setRevenueData(data);
          } else {
            setRevenueData({
              monthly_data: [],
              total_revenue: 0,
              percentage_change: 0
            });
          }
        } catch (error) {
          console.error('Error fetching monthly revenue:', error);
          setRevenueData({
            monthly_data: [],
            total_revenue: 0,
            percentage_change: 0
          });
        } finally {
          setLoading(false);
        }
      };

      fetchRevenueData();
      
      return () => {};
    }
  }, [initialData, parentLoading]);

  // Format the total revenue as currency
  const formattedTotalRevenue = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(revenueData.total_revenue);

  // Determine the color for percentage change
  const percentageColor = revenueData.percentage_change >= 0 ? '#3DC5A1' : '#EF4444';
  const percentagePrefix = revenueData.percentage_change >= 0 ? '+' : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Overall Revenue</CardTitle>
        {loading ? (
          <>
            <Skeleton className="h-8 w-48 mb-1" />
            <Skeleton className="h-4 w-16" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{formattedTotalRevenue}</div>
            <div className="text-sm" style={{ color: percentageColor }}>
              {percentagePrefix}{revenueData.percentage_change}%
            </div>
          </>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData.monthly_data}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis hide />
              <Tooltip 
                formatter={(value) => [`₦${(value/1000).toFixed(0)}K`, 'Revenue']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#6b7280', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3DC5A1" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#3DC5A1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default RevenueChart;