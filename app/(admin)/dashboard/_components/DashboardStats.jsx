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
    <Card className={cn('border border-gray-200 bg-white h-40', className)}>  {/* Changed from h-32 to h-40 */}
      <CardContent className="p-4 h-full flex flex-col justify-between">  {/* Changed from p-3 to p-4 */}
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
            <div className="flex items-center justify-between mb-3">  {/* Changed from mb-2 to mb-3 */}
              <span className="text-sm font-medium text-gray-600 truncate">{title}</span>  {/* Changed from text-xs to text-sm */}
              <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">  {/* Changed from p-1.5 to p-2 */}
                {icon}
              </div>
            </div>
            
            {/* Value */}
            <div className="text-2xl font-bold text-gray-900 mb-2 truncate">{value}</div>  {/* Changed from text-xl to text-2xl and mb-1 to mb-2 */}
            
            {/* Subtitle and change */}
            <div className="flex items-center justify-between text-sm">  {/* Changed from text-xs to text-sm */}
              {subtitle && (
                <div className="text-gray-500 truncate">{subtitle}</div>
              )}
              {change && (
                <div className="text-gray-500 flex-shrink-0">
                  <span className={change.includes('+') ? 'text-[#3DC5A1]' : 'text-red-600'}>
                    {change}
                  </span>
                </div>
              )}
            </div>
            
            {/* Date at bottom if showDate is true */}
            {showDate && (
              <div className="text-sm text-gray-400 mt-2">  {/* Changed from text-xs to text-sm and mt-1 to mt-2 */}
                {getCurrentDate()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardStats;