"use client";
import React, { useState, useEffect } from 'react';
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
import { walletAPI } from '@/utils/api/wallet';
import { toast } from 'react-hot-toast';
import CurrencyConverter from '@/components/CurrencyConverter';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for API data
  const [walletStats, setWalletStats] = useState({
    totalBalance: '₦0',
    totalSavings: '₦0',
    totalTRC: '0 TRC',
    escrowTransactions: '₦0',
    autoSaveEnabled: '0 Tenants',
    trcRedeemed: '₦0'
  });

  const [trcDistribution, setTrcDistribution] = useState({
    surveys: { amount: 0, percentage: 0, color: '#3B82F6' },
    microTasks: { amount: 0, percentage: 0, color: '#F59E0B' },
    referrals: { amount: 0, percentage: 0, color: '#10B981' }
  });

  const [transactions, setTransactions] = useState([]);
  const [escrowData, setEscrowData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchWalletData();
  }, []);

  // Function to fetch wallet data from API
  const fetchWalletData = async () => {
    setLoading(true);
    try {
      // Fetch wallet stats
      const statsResponse = await walletAPI.getWalletStats();
      const stats = statsResponse.data;
      
      setWalletStats({
        totalBalance: `₦${formatNumber(stats.total_wallet_balance)}`,
        totalSavings: `₦${formatNumber(stats.total_rent_savings)}`,
        totalTRC: `${formatNumber(stats.total_trc_circulating)} TRC`,
        escrowTransactions: `₦${formatNumber(stats.escrow_transactions)}`,
        autoSaveEnabled: `${stats.auto_save_enabled_count} Tenants`,
        trcRedeemed: `₦${formatNumber(stats.trc_redeemed)}`
      });
      
      setTrcDistribution({
        surveys: stats.trc_distribution.surveys,
        microTasks: stats.trc_distribution.microTasks,
        referrals: stats.trc_distribution.referrals
      });
      
      // Fetch transactions
      const transactionsResponse = await walletAPI.getAdminTransactions();
      setTransactions(transactionsResponse.data.map(tx => ({
        id: tx.id,
        user: tx.wallet_user,
        avatar: '/images/UserDashboard/avatar.png', // Default avatar
        type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
        category: tx.source,
        date: new Date(tx.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        amount: `₦${formatNumber(tx.amount)}`,
        note: tx.description,
        status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
      })));
      
      // Fetch escrow data
      const escrowResponse = await walletAPI.getEscrowManagement();
      setEscrowData(escrowResponse.data.map(escrow => ({
        id: escrow.id,
        tenant: escrow.tenant,
        avatar: '/images/UserDashboard/avatar.png', // Default avatar
        property: escrow.property,
        amount: `₦${formatNumber(escrow.amount)}`,
        payment: escrow.payment_method,
        date: escrow.date,
        status: escrow.status
      })));
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handler for escrow actions (approve/reject)
  const handleEscrowAction = async (id, action) => {
    try {
      await walletAPI.updateEscrowTransaction(id, action);
      toast.success(`Escrow transaction ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchWalletData(); // Refresh data
    } catch (error) {
      console.error(`Error ${action}ing escrow transaction:`, error);
      toast.error(`Failed to ${action} escrow transaction`);
    }
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

  const [showEscrow, setShowEscrow] = useState(false);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading wallet data...</p>
        </div>
      ) : !showEscrow ? (
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
          
          {/* Currency Converter Card - Added here */}
          <Card className="bg-white border-0 shadow-sm mb-8">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-semibold">Currency Converter</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <CurrencyConverter 
                initialAmount={1000} 
                initialFromCurrency="NGN" 
                initialToCurrency="USD" 
                onConversionComplete={(result) => {
                  console.log('Conversion completed:', result);
                }}
              />
            </CardContent>
          </Card>

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
              onClick={() => {
                setActiveTab('processed');
                walletAPI.getEscrowManagement('successful').then(response => {
                  setEscrowData(response.data.map(escrow => ({
                    id: escrow.id,
                    tenant: escrow.tenant,
                    avatar: '/images/UserDashboard/avatar.png',
                    property: escrow.property,
                    amount: `₦${formatNumber(escrow.amount)}`,
                    payment: escrow.payment_method,
                    date: escrow.date,
                    status: escrow.status
                  })));
                }).catch(error => {
                  console.error('Error fetching processed escrow transactions:', error);
                  toast.error('Failed to fetch processed transactions');
                });
              }}
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
                          <Badge className={`${
                            item.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : item.status === 'successful'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                                onClick={() => handleEscrowAction(item.id, 'approve')}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                                onClick={() => handleEscrowAction(item.id, 'reject')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
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
              Showing 1 to {escrowData.length} of {escrowData.length} results
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