"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, CheckCircle, XCircle } from 'lucide-react';
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

  // Add state for tracking verification actions
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

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
      partner.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      partner.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      partner.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      partner.location_region?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: 'Agent', label: 'Agent', count: partners.filter(p => p.business_type === 'individual').length },
    { id: 'Agency', label: 'Agency', count: partners.filter(p => p.business_type === 'agency').length },
    { id: 'Landlords', label: 'Landlords', count: partners.filter(p => p.business_type === 'developer' || p.business_type === 'other').length },
    { id: 'Verification', label: 'Verification', count: partners.filter(p => p.status === 'pending').length, badge: true }
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
        <Skeleton className="h-8 w-16 rounded" />
      </td>
    </tr>
  );
  
  // Add verification handler
  const handleVerifyPartner = async (partnerId) => {
    setIsVerifying(true);
    setSelectedPartnerId(partnerId);
    try {
      await adminAPI.verifyPartner(partnerId);
      toast.success('Partner verified successfully');
      // Refresh the partners list
      const response = await adminAPI.getPartners();
      setPartners(response.data || []);
    } catch (error) {
      console.error('Error verifying partner:', error);
      toast.error(error.message || 'Failed to verify partner');
    } finally {
      setIsVerifying(false);
      setSelectedPartnerId(null);
    }
  };
  
  // Add rejection handler
  const handleRejectPartner = async (partnerId) => {
    setIsRejecting(true);
    try {
      await adminAPI.rejectPartner(partnerId, rejectionReason);
      toast.success('Partner rejected successfully');
      setShowRejectionModal(false);
      setRejectionReason('');
      // Refresh the partners list
      const response = await adminAPI.getPartners();
      setPartners(response.data || []);
    } catch (error) {
      console.error('Error rejecting partner:', error);
      toast.error(error.message || 'Failed to reject partner');
    } finally {
      setIsRejecting(false);
      setSelectedPartnerId(null);
    }
  };
  
  // Add function to open rejection modal
  const openRejectionModal = (partnerId) => {
    setSelectedPartnerId(partnerId);
    setShowRejectionModal(true);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
      </div>

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
          {activeTab !== 'Verification' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="text-left p-4 font-medium text-gray-700">Full Name</th>
                    <th className="text-left p-4 font-medium text-gray-700">Email</th>
                    <th className="text-left p-4 font-medium text-gray-700">Phone number</th>
                    <th className="text-left p-4 font-medium text-gray-700">Location</th>
                    <th className="text-left p-4 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!isDataLoaded ? (
                    // Show skeleton rows while loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonRow key={index} />
                    ))
                  ) : filteredPartners.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        No {activeTab.toLowerCase()} found
                      </td>
                    </tr>
                  ) : (
                    filteredPartners.map((partner) => (
                      <tr key={partner.id} className="border-b hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                {partner.partner_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{partner.partner_name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{partner.email}</td>
                        <td className="p-4 text-gray-600">{partner.phone_number}</td>
                        <td className="p-4 text-gray-600">{partner.location_region}</td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-[#521282] border-[#521282] hover:bg-[#521282] hover:text-white"
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-[#521282] border-[#521282] hover:bg-[#521282] hover:text-white"
                              asChild
                            >
                              <Link href={`/dashboard/partners/edit/${partner.id}`}>Edit</Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Full Name</th>
                    <th className="text-left p-4 font-medium text-gray-700">Email</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!isDataLoaded ? (
                    // Show skeleton rows while loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonRow key={index} />
                    ))
                  ) : partners.filter(p => p.status === 'pending').length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        No pending partners found
                      </td>
                    </tr>
                  ) : (
                    partners.filter(p => p.status === 'pending').map((partner) => (
                      <tr key={partner.id} className="border-b hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                {partner.partner_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium text-gray-900 block">{partner.partner_name}</span>
                              <Badge className={`${partner.status === 'pending' ? 'bg-yellow-500' : partner.status === 'verified' ? 'bg-green-500' : 'bg-red-500'} text-white text-xs mt-1`}>
                                {partner.status === 'pending' ? 'Pending' : partner.status === 'verified' ? 'Verified' : 'Rejected'}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{partner.email}</td>
                        <td className="p-4">
                          <Badge className={`${partner.status === 'pending' ? 'bg-yellow-500' : partner.status === 'verified' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            {partner.status === 'pending' ? 'Pending' : partner.status === 'verified' ? 'Verified' : 'Rejected'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                              onClick={() => handleVerifyPartner(partner.id)}
                              disabled={isVerifying && selectedPartnerId === partner.id}
                            >
                              {isVerifying && selectedPartnerId === partner.id ? (
                                <span className="flex items-center">Verifying...</span>
                              ) : (
                                <span className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                </span>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                              onClick={() => openRejectionModal(partner.id)}
                              disabled={isRejecting && selectedPartnerId === partner.id}
                            >
                              {isRejecting && selectedPartnerId === partner.id ? (
                                <span className="flex items-center">Rejecting...</span>
                              ) : (
                                <span className="flex items-center">
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </span>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Reject Partner</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this partner:</p>
            <textarea 
              className="w-full border rounded-md p-2 mb-4"
              rows="4"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedPartnerId(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleRejectPartner(selectedPartnerId)}
                disabled={!rejectionReason.trim() || isRejecting}
              >
                {isRejecting ? 'Rejecting...' : 'Reject Partner'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartnersManagement;