import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function DashboardStats({ title, value, icon, change, subtitle, loading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {change && (
              <p className="text-xs text-muted-foreground mt-1">
                <span className={change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                  {change}
                </span>{' '}
                from last month
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardStats;