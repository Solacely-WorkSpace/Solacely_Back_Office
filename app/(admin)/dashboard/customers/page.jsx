"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  
  // Dummy customer data matching the image
  const customers = [
    {
      id: 1,
      fullName: 'Benita James',
      email: 'James@gmail.com',
      phoneNumber: '+234890756623',
      location: 'Lagos, Nigeria',
      avatar: '/images/UserDashboard/user1.jpg'
    },
    {
      id: 2,
      fullName: 'Benita James',
      email: 'James@gmail.com',
      phoneNumber: '+234890756623',
      location: 'Lagos, Nigeria',
      avatar: '/images/UserDashboard/user2.jpg'
    },
    {
      id: 3,
      fullName: 'Benita James',
      email: 'James@gmail.com',
      phoneNumber: '+234890756623',
      location: 'Lagos, Nigeria',
      avatar: '/images/UserDashboard/user3.jpg'
    },
    {
      id: 4,
      fullName: 'Benita James',
      email: 'James@gmail.com',
      phoneNumber: '+234890756623',
      location: 'Lagos, Nigeria',
      avatar: '/images/UserDashboard/user4.jpg'
    },
    {
      id: 5,
      fullName: 'Benita James',
      email: 'James@gmail.com',
      phoneNumber: '+234890756623',
      location: 'Lagos, Nigeria',
      avatar: '/images/UserDashboard/user5.jpg'
    },
    {
      id: 6,
      fullName: 'Benita James',
      email: 'James@gmail.com',
      phoneNumber: '+234890756623',
      location: 'Lagos, Nigeria',
      avatar: '/images/UserDashboard/user6.jpg'
    },
    {
      id: 7,
      fullName: 'Benita James',
      email: 'James@gmail.com',
      phoneNumber: '+234890756623',
      location: 'Lagos, Nigeria',
      avatar: '/images/UserDashboard/user7.jpg'
    },
    {
      id: 8,
      fullName: 'Benita James',
      email: 'James@gmail.com',
      phoneNumber: '+234890756623',
      location: 'Lagos, Nigeria',
      avatar: '/images/UserDashboard/user8.jpg'
    },
    {
      id: 9,
      fullName: 'Benita James',
      email: 'James@gmail.com',
      phoneNumber: '+234890756623',
      location: 'Lagos, Nigeria',
      avatar: '/images/UserDashboard/user9.jpg'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(customers.map(customer => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
      </div>
      
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search for customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>
      
      {/* Table Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={selectedCustomers.length === customers.length}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Full Name</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Phone number</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Location</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Action</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={customer.avatar} alt={customer.fullName} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                            {customer.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-900">{customer.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.phoneNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.location}</td>
                    <td className="py-3 px-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 px-3 text-xs border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/30">
            <div className="text-sm text-gray-600">
              Showing 1 to 9 of 20 results
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 text-xs text-gray-600 border-gray-300 hover:bg-gray-50"
                disabled
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 text-xs text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomersPage;