"use client";
import React, { useEffect, useState } from 'react';
import { usersAPI } from '@/utils/api/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

function UserActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserActivity();
  }, []);

  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      // Process user data to show recent activity
      setActivities(response.results || response);
    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setLoading(false);
    }
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