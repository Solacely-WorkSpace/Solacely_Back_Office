import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function DashboardStats({ title, value, subtitle, change, icon, loading, compact = false }) {
  return (
    <Card className={cn('border border-gray-200 bg-white', compact && 'h-fit')}>
      <CardContent className={cn('p-4', compact && 'p-3')}>
        {loading ? (
          <div className="space-y-2">
            <div className={cn('bg-gray-200 animate-pulse rounded', compact ? 'h-6 w-16' : 'h-8 w-20')}></div>
            <div className={cn('bg-gray-200 animate-pulse rounded', compact ? 'h-3 w-12' : 'h-4 w-16')}></div>
          </div>
        ) : (
          <div>
            {/* Header with title and icon on the right */}
            <div className="flex items-center justify-between mb-3">
              <span className={cn('font-medium text-gray-600', compact ? 'text-xs' : 'text-sm')}>{title}</span>
              <div className={cn('p-2 bg-gray-50 rounded-lg', compact && 'p-1.5')}>
                {icon}
              </div>
            </div>
            
            {/* Value */}
            <div className={cn('font-bold text-gray-900 mb-1', compact ? 'text-xl' : 'text-3xl')}>{value}</div>
            
            {/* Subtitle and change in same line for compact */}
            <div className={cn('flex items-center justify-between', compact ? 'text-xs' : 'text-sm')}>
              {subtitle && (
                <div className="text-gray-500">{subtitle}</div>
              )}
              {change && (
                <div className={cn('text-gray-500', compact ? 'text-xs' : 'text-xs')}>
                  <span className={change.includes('+') ? 'text-[#3DC5A1]' : 'text-red-600'}>
                    {change}
                  </span>
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