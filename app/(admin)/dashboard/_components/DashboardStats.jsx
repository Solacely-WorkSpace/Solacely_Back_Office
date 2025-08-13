import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function DashboardStats({ title, value, subtitle, change, icon, loading, compact = false, className, customContent, showDate = false, isWide = false }) {
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className={cn(
      'border border-gray-200 bg-white h-32', 
      isWide ? 'w-[320px]' : 'w-[200px]',
      className
    )}>      
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
            {/* Top section with icon and title below it */}
            <div className="flex flex-col items-start">
              <div className="flex-shrink-0 mb-1">
                {React.cloneElement(icon, { className: 'h-8 w-8' })}
              </div>
              <span className="text-xs font-medium text-gray-600 truncate">{title}</span>
            </div>
            
            {/* Value - aligned to the left */}
            <div className="text-xl font-bold text-gray-900 flex items-start justify-start flex-grow truncate">{value}</div>
            
            {/* Subtitle */}
            {subtitle && (
              <div className="text-xs text-gray-500 truncate mb-1">{subtitle}</div>
            )}
            
            {/* Bottom row: Percentage and Date closer together */}
            <div className="flex items-center gap-2 text-xs">
              {change && (
                <div>
                  <span className={change.includes('+') ? 'text-[#3DC5A1] font-medium' : 'text-red-600 font-medium'}>
                    {change}
                  </span>
                </div>
              )}
              {showDate && (
                <div className="text-gray-400">
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