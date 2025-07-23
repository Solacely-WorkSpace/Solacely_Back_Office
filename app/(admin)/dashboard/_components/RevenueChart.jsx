"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { month: 'Jan', revenue: 400000 },
  { month: 'Feb', revenue: 300000 },
  { month: 'Mar', revenue: 500000 },
  { month: 'Apr', revenue: 450000 },
  { month: 'May', revenue: 600000 },
  { month: 'Jun', revenue: 550000 },
  { month: 'Jul', revenue: 700000 },
  { month: 'Aug', revenue: 650000 },
  { month: 'Sep', revenue: 800000 },
  { month: 'Oct', revenue: 750000 },
  { month: 'Nov', revenue: 900000 },
  { month: 'Dec', revenue: 850000 }
];

function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Overall Revenue</CardTitle>
        <div className="text-2xl font-bold">₦48,000,574.21</div>
        <div className="text-sm text-green-600">+20%</div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
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
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default RevenueChart;