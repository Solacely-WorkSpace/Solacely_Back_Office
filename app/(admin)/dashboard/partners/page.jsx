"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { adminAPI } from '@/utils/api/admin';
import { toast } from 'react-hot-toast';

function PartnersManagement() {
  const [activeTab, setActiveTab] = useState('Agent');
  const [searchTerm, setSearchTerm] = useState('');
  const [partners, setPartners] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch partners data from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await adminAPI.getPartners();
        setPartners(response.data || []);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching partners:', error);
        toast.error('Failed to load partners data');
        setPartners([]);
        setIsDataLoaded(true);
      }
    };

    fetchPartners();
  }, []);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current sort configuration
  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUp className="w-4 h-4" /> : 
        <ChevronDown className="w-4 h-4" />;
    }
    return <ChevronUp className="w-4 h-4 opacity-30" />;
  };

  // Filter partners based on business type and search term
  const filteredPartners = partners.filter(partner => {
    const matchesTab = activeTab === 'Agent' ? 
      partner.business_type === 'individual' : 
      activeTab === 'Agency' ? 
        partner.business_type === 'agency' : 
        activeTab === 'Landlords' ? 
          partner.business_type === 'developer' || partner.business_type === 'other' : 
          true;
    
    const matchesSearch = searchTerm === '' || 
      partner.partner_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      partner.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      partner.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      partner.location_region?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: 'Agent', label: 'Agent' },
    { id: 'Agency', label: 'Agency' },
    { id: 'Landlords', label: 'Landlords' },
    { id: 'Verification', label: 'Verification', badge: true, count: partners.filter(p => p.status === 'pending').length }
  ];

  // Skeleton component for table rows
  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="p-4">
        <Skeleton className="h-4 w-4 rounded" />
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-8 w-16 rounded" />
      </td>
    </tr>
  );

  return (
    <div className="p-6 md:p-10">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#521282] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button 
            className="bg-[#521282] hover:bg-[#521282]/90 text-white"
            asChild
          >
            <Link href={`/dashboard/partners/add-${activeTab.toLowerCase()}`}>
              <Plus className="h-4 w-4 mr-2" />
              Add new
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-[#F8F7FE]">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-gray-700 cursor-pointer"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center">
                      Full Name
                      <span className="ml-1">{getSortIcon('fullName')}</span>
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-gray-700 cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      <span className="ml-1">{getSortIcon('email')}</span>
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-gray-700 cursor-pointer"
                    onClick={() => handleSort('phoneNumber')}
                  >
                    <div className="flex items-center">
                      Phone number
                      <span className="ml-1">{getSortIcon('phoneNumber')}</span>
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-gray-700 cursor-pointer"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center">
                      Location
                      <span className="ml-1">{getSortIcon('location')}</span>
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-gray-700 cursor-pointer"
                    onClick={() => handleSort('properties')}
                  >
                    <div className="flex items-center">
                      Properties
                      <span className="ml-1">{getSortIcon('properties')}</span>
                    </div>
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {!isDataLoaded ? (
                  // Show skeleton rows while loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No {activeTab.toLowerCase()} found
                    </td>
                  </tr>
                ) : (
                  // This would normally use real data, but we're using placeholder data as requested
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/images/Avatar.png" />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              SJ
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900">Samson John</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">John@gmail.com</td>
                      <td className="p-4 text-gray-600">+234890755623</td>
                      <td className="p-4 text-gray-600">Lagos, Nigeria</td>
                      <td className="p-4 text-gray-600">4</td>
                      <td className="p-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-[#521282] border-[#521282] hover:bg-[#521282] hover:text-white"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex items-center justify-between text-sm text-gray-500">
            <span>Showing 1 to 6 of 6 results</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PartnersManagement;