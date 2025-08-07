"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowLeft, ChevronDown, Edit, Wallet, PiggyBank, Coins, CreditCard, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import DashboardStats from '../_components/DashboardStats';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data matching the interface
  const walletStats = {
    totalBalance: '₦10,000,000',
    totalSavings: '₦5,000,000',
    totalTRC: '80,000 TRC',
    escrowTransactions: '₦8,430,000',
    autoSaveEnabled: '124 Tenants',
    trcRedeemed: '₦ 680,000'
  };

  const trcDistribution = {
    surveys: { amount: 48000, percentage: 60, color: '#3B82F6' },
    microTasks: { amount: 22400, percentage: 28, color: '#F59E0B' },
    referrals: { amount: 9600, percentage: 12, color: '#10B981' }
  };

  // Convert TRC distribution to chart data format
  const trcChartData = [
    {
      name: 'Surveys',
      value: trcDistribution.surveys.percentage,
      amount: trcDistribution.surveys.amount,
      color: trcDistribution.surveys.color
    },
    {
      name: 'Micro Tasks',
      value: trcDistribution.microTasks.percentage,
      amount: trcDistribution.microTasks.amount,
      color: trcDistribution.microTasks.color
    },
    {
      name: 'Referrals',
      value: trcDistribution.referrals.percentage,
      amount: trcDistribution.referrals.amount,
      color: trcDistribution.referrals.color
    }
  ];

  const totalTRC = trcDistribution.surveys.amount + trcDistribution.microTasks.amount + trcDistribution.referrals.amount;

  const transactions = [
    {
      id: 1,
      user: 'Samson John',
      avatar: '/images/UserDashboard/avatar.png',
      type: 'Flag',
      category: 'Wallet',
      date: 'May 10, 2025',
      amount: '₦31,000',
      note: 'Duplicate fund removal',
      status: 'Pending'
    },
    {
      id: 2,
      user: 'Samson John',
      avatar: '/images/UserDashboard/avatar.png',
      type: 'Credit',
      category: 'TRC',
      date: 'May 10, 2025',
      amount: '₦1,000',
      note: 'Referral bonus correction',
      status: 'Completed'
    },
    {
      id: 3,
      user: 'Samson John',
      avatar: '/images/UserDashboard/avatar.png',
      type: 'Debit',
      category: 'Rent savings',
      date: 'May 10, 2025',
      amount: '₦200,000',
      note: 'Duplicate deposit report',
      status: 'Completed'
    },
    {
      id: 4,
      user: 'Samson John',
      avatar: '/images/UserDashboard/avatar.png',
      type: 'Credit',
      category: 'Wallet',
      date: 'May 10, 2025',
      amount: '₦10,000',
      note: 'Failed automatic deposit',
      status: 'Completed'
    }
  ];

  const escrowData = [
    {
      id: 1,
      tenant: 'Samson John',
      avatar: '/images/UserDashboard/avatar.png',
      property: 'Unit B3, Sunrise Apartments, Janey Estate',
      amount: '₦500,000',
      payment: 'Wallet',
      date: 'May 10, 2025',
      status: 'Pending'
    },
    {
      id: 2,
      tenant: 'Samson John',
      avatar: '/images/UserDashboard/avatar.png',
      property: 'Unit B3, Sunrise Apartments, Janey Estate',
      amount: '₦200,000',
      payment: 'Rent Savings',
      date: 'May 10, 2025',
      status: 'Pending'
    },
    {
      id: 3,
      tenant: 'Samson John',
      avatar: '/images/UserDashboard/avatar.png',
      property: 'Unit B3, Sunrise Apartments, Janey Estate',
      amount: '₦200,000',
      payment: 'Rent Savings',
      date: 'May 10, 2025',
      status: 'Pending'
    },
    {
      id: 4,
      tenant: 'Samson John',
      avatar: '/images/UserDashboard/avatar.png',
      property: 'Unit B3, Sunrise Apartments, Janey Estate',
      amount: '₦500,000',
      payment: 'Wallet',
      date: 'May 10, 2025',
      status: 'Pending'
    }
  ];

  const [showEscrow, setShowEscrow] = useState(false);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {!showEscrow ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setShowEscrow(true)}
                className="bg-[#521282] hover:bg-[#521282]/90 text-white px-6 py-2 rounded-lg"
              >
                Escrow Management
              </Button>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                View all transactions
              </Link>
            </div>
          </div>

          {/* Stats and TRC Distribution Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            {/* Left Side - Statistics Cards (3 columns, 2 rows) */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-2 h-full">  {/* Added specific gap-x-2 and gap-y-2 */}
                {/* Row 1 */}
                <DashboardStats
                  title="Total Wallet Balance"
                  value={walletStats.totalBalance}
                  subtitle="↗ +6% ↘ -3%"
                  icon={<Wallet className="w-4 h-4 text-green-600" />}
                />

                <DashboardStats
                  title="Total Rent Savings"
                  value={walletStats.totalSavings}
                  subtitle="From 400 active tenants"
                  icon={<PiggyBank className="w-4 h-4 text-blue-600" />}
                />

                <DashboardStats
                  title="Total TRC Circulating"
                  value={walletStats.totalTRC}
                  subtitle="600,000 worth earned via tasks"
                  icon={<Coins className="w-4 h-4 text-green-600" />}
                />

                {/* Row 2 */}
                <DashboardStats
                  title="Escrow Transactions"
                  value={walletStats.escrowTransactions}
                  subtitle="Pending landlord approval"
                  icon={<CreditCard className="w-4 h-4 text-green-600" />}
                />

                <DashboardStats
                  title="Auto-Save Enabled"
                  value={walletStats.autoSaveEnabled}
                  subtitle="₦1.5M saved automatically"
                  icon={<Users className="w-4 h-4 text-blue-600" />}
                />

                <DashboardStats
                  title="TRC Redeemed to Wallet"
                  value={walletStats.trcRedeemed}
                  subtitle="From 80,000 TRC earned"
                  icon={<BarChart3 className="w-4 h-4 text-green-600" />}
                />
              </div>
            </div>

            {/* Right Side - TRC Distribution Chart */}
            <div className="lg:col-span-1">
              <Card className="bg-white border-0 shadow-sm h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">TRC Earning Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={trcChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={77}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {trcChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{(totalTRC / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-gray-500">Total TRC</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {trcChartData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Admin Finance Console */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Admin Finance Console</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Input
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg w-64"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    Filter by
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-left font-medium text-gray-600">User</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Type</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Category</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Date</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Amount</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Note</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Status</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={transaction.avatar} />
                              <AvatarFallback>{transaction.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{transaction.user}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{transaction.category}</TableCell>
                        <TableCell className="text-gray-600">{transaction.date}</TableCell>
                        <TableCell className="font-medium" style={{ color: '#3DC5A1' }}>{transaction.amount}</TableCell>
                        <TableCell className="text-gray-600">{transaction.note}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`${
                              transaction.status === 'Pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Escrow Management Panel */
        <div>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setShowEscrow(false)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-gray-600 text-sm">View and accept rent payments made to escrow</p>
              <h1 className="text-2xl font-bold">Escrow Management Panel</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-6 border-b">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`pb-3 px-1 border-b-2 font-medium ${
                activeTab === 'pending' 
                  ? 'border-[#521282] text-[#521282]' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              Pending Approvals
            </button>
            <button 
              onClick={() => setActiveTab('processed')}
              className={`pb-3 px-1 border-b-2 font-medium ${
                activeTab === 'processed' 
                  ? 'border-[#521282] text-[#521282]' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              Processed Payments
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              Filter by
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Escrow Table */}
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-left font-medium text-gray-600">Tenant Name</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Property</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Amount</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Payment</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Date</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Status</TableHead>
                      <TableHead className="text-left font-medium text-gray-600">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {escrowData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={item.avatar} />
                              <AvatarFallback>{item.tenant.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{item.tenant}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs">
                          {item.property}
                        </TableCell>
                        <TableCell className="font-medium" style={{ color: '#3DC5A1' }}>{item.amount}</TableCell>
                        <TableCell className="text-gray-600">{item.payment}</TableCell>
                        <TableCell className="text-gray-600">{item.date}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-[#521282] border-[#521282] hover:bg-[#521282] hover:text-white"
                          >
                            Action ▶
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing 1 to 6 of 6 results
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}