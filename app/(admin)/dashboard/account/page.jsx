"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

function AccountPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Account/Transaction data matching the image
  const transactions = [
    {
      id: 1,
      name: 'Samson John',
      email: 'John@gmail.com',
      time: 'Jan 29, 2022',
      timeDetail: 'at 08:00 PM',
      location: 'Lagos',
      property: 'Home in Coral Gables',
      propertyType: 'Apartment Building',
      amount: 'N4,000,000',
      period: 'Annual',
      status: 'Paid',
      avatar: '/images/UserDashboard/user1.jpg'
    },
    {
      id: 2,
      name: 'Samson John',
      email: 'John@gmail.com',
      time: 'Jan 29, 2022',
      timeDetail: 'at 08:00 PM',
      location: 'Lagos',
      property: 'Home in Coral Gables',
      propertyType: 'Apartment Building',
      amount: 'N9,000,000',
      period: 'Annual',
      status: 'Failed',
      avatar: '/images/UserDashboard/user2.jpg'
    },
    {
      id: 3,
      name: 'Samson John',
      email: 'John@gmail.com',
      time: 'Jan 29, 2022',
      timeDetail: 'at 08:00 PM',
      location: 'Lagos',
      property: 'Home in Coral Gables',
      propertyType: 'Apartment Building',
      amount: 'N4,300,000',
      period: 'Annual',
      status: 'Pending',
      avatar: '/images/UserDashboard/user3.jpg'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Paid': { color: 'bg-green-100 text-green-700', text: 'Paid' },
      'Failed': { color: 'bg-red-100 text-red-700', text: 'Failed' },
      'Pending': { color: 'bg-orange-100 text-orange-700', text: 'Pending' }
    };
    
    const config = statusConfig[status] || statusConfig['Pending'];
    return (
      <Badge className={`${config.color} border-0 font-medium px-2 py-1 text-xs`}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Account</h1>
      </div>
      
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search" 
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Name/email</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Time</span>
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
                      <span>Property</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={transaction.avatar} alt={transaction.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                            {transaction.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{transaction.name}</span>
                          <span className="text-xs text-gray-500">{transaction.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{transaction.time}</span>
                        <span className="text-xs text-gray-500">{transaction.timeDetail}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{transaction.location}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{transaction.property}</span>
                        <span className="text-xs text-gray-500">{transaction.propertyType}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{transaction.amount}</span>
                        <span className="text-xs text-gray-500">{transaction.period}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="py-4 px-4">
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
              Showing 1 to 6 of 6 results
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

export default AccountPage;