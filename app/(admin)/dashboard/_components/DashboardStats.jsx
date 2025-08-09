import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function DashboardStats({ title, value, subtitle, change, icon, loading, compact = false, className, customContent, showDate = false }) {
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className={cn('border border-gray-200 bg-white h-32', className)}>
      <CardContent className="p-3 h-full flex flex-col justify-between">
        {loading ? (
          <div className="space-y-2">
            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-3 w-12 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : customContent ? (
          customContent
        ) : (
          <div className="h-full flex flex-col justify-between">
            {/* Header with title and icon */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 truncate">{title}</span>
              <div className="p-1.5 bg-gray-50 rounded-lg flex-shrink-0">
                {icon}
              </div>
            </div>
            
            {/* Value */}
            <div className="text-xl font-bold text-gray-900 mb-1 truncate">{value}</div>
            
            {/* Subtitle */}
            {subtitle && (
              <div className="text-xs text-gray-500 truncate mb-2">{subtitle}</div>
            )}
            
            {/* Bottom row: Percentage on left, Date on right */}
            <div className="flex items-center justify-between text-xs">
              {change && (
                <div className="text-left">
                  <span className={change.includes('+') ? 'text-[#3DC5A1] font-medium' : 'text-red-600 font-medium'}>
                    {change}
                  </span>
                </div>
              )}
              {showDate && (
                <div className="text-gray-400 text-right">
                  {getCurrentDate()}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardStats;