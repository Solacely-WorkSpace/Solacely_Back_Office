import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function DashboardStats({ title, value, subtitle, change, icon, loading, variant = 'default' }) {
  const variants = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
    default: 'bg-white border-gray-200'
  };

  return (
    <Card className={cn('border', variants[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : (
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            {subtitle && (
              <div className="text-sm text-gray-500 mb-2">{subtitle}</div>
            )}
            {change && (
              <div className="text-xs text-gray-500">
                <span className={change.includes('+') ? 'text-green-600' : 'text-red-600'}>
                  {change}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardStats;