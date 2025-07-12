"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

function UserActivity() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    setLoading(true);
    
    // Get unique users with their listing counts
    const { data, error } = await supabase
      .from('listing')
      .select('createdBy, fullName, profileImage')
      .order('created_at', { ascending: false });
    
    if (data) {
      // Process data to get unique users with counts
      const userMap = {};
      data.forEach(item => {
        if (item.createdBy) {
          if (!userMap[item.createdBy]) {
            userMap[item.createdBy] = {
              email: item.createdBy,
              name: item.fullName || 'Unknown User',
              avatar: item.profileImage || '',
              count: 1
            };
          } else {
            userMap[item.createdBy].count += 1;
          }
        }
      });
      
      // Convert to array and sort by count
      const userArray = Object.values(userMap);
      userArray.sort((a, b) => b.count - a.count);
      
      setUsers(userArray.slice(0, 5)); // Top 5 users
    }
    
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Users</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">{user.count} listings</span>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end mt-4">
              <Link href="/dashboard/users" className="text-sm text-blue-500 hover:underline">
                View All Users
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UserActivity;