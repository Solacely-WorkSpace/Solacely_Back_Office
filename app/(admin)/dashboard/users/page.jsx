"use client";
import React, { useEffect, useState } from 'react';
import { usersAPI } from '@/utils/api/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function UsersManagement() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkAction, setBulkAction] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'activity') {
      fetchUserActivities();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      setUsers(response.results || response);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivities = async () => {
    try {
      setActivityLoading(true);
      const response = await usersAPI.getUserActivities();
      setActivities(response.results || response);
    } catch (error) {
      console.error('Error fetching user activities:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchTerm);
  };

  const handleBulkAction = () => {
    console.log('Bulk action:', bulkAction, 'for users:', selectedUsers);
  };

  const handleRoleFilter = () => {
    console.log('Role filter:', roleFilter);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Users</h2>
              <Button 
                onClick={() => router.push('/dashboard/users/add')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add user
              </Button>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Bulk Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="activate">Activate</SelectItem>
                    <SelectItem value="deactivate">Deactivate</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={handleBulkAction}
                  className="px-6 py-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  Apply
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Change Role to..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={handleRoleFilter}
                  className="px-6 py-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  Apply
                </Button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">
                  All ({users.length})
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Search Users
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700">
                          <input
                            type="checkbox"
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            checked={selectedUsers.length === users.length && users.length > 0}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                        </th>
                        <th className="text-left p-4 font-medium text-gray-700">Name</th>
                        <th className="text-left p-4 font-medium text-gray-700">Username</th>
                        <th className="text-left p-4 font-medium text-gray-700">Email</th>
                        <th className="text-left p-4 font-medium text-gray-700">Role</th>
                        <th className="text-left p-4 font-medium text-gray-700">Status</th>
                        <th className="text-left p-4 font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={user.profile_image} alt={user.full_name} />
                                  <AvatarFallback className="bg-purple-100 text-purple-600">
                                    {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : user.email.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-gray-900">{user.full_name || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-700">{user.username || 'N/A'}</td>
                            <td className="p-4 text-gray-700">{user.email}</td>
                            <td className="p-4 text-gray-700">
                              {user.is_staff ? 'Admin' : user.is_landlord ? 'Landlord' : user.is_tenant ? 'Tenant' : user.is_agent ? 'Agent' : 'User'}
                            </td>
                            <td className="p-4 text-gray-700">{user.account_status || 'Active'}</td>
                            <td className="p-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-purple-200 text-purple-600 hover:bg-purple-50 flex items-center gap-1"
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="p-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">User Activity</h2>
              <Button 
                onClick={fetchUserActivities}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {activityLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700">User</th>
                        <th className="text-left p-4 font-medium text-gray-700">Action</th>
                        <th className="text-left p-4 font-medium text-gray-700">Timestamp</th>
                        <th className="text-left p-4 font-medium text-gray-700">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.length > 0 ? (
                        activities.map((activity) => (
                          <tr key={activity.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-900">{activity.user_email}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-700">{activity.action}</td>
                            <td className="p-4 text-gray-700">{new Date(activity.timestamp).toLocaleString()}</td>
                            <td className="p-4 text-gray-700">
                              {activity.meta && (
                                <pre className="text-xs overflow-x-auto max-w-xs">
                                  {JSON.stringify(activity.meta, null, 2)}
                                </pre>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-4 text-center text-gray-500">
                            No activity records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UsersManagement;