"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Plus, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';
import { toast } from 'sonner';

function AddCoWorkingSpace() {
  const [activeTab, setActiveTab] = useState('basic');
  const [spaces, setSpaces] = useState([
    {
      id: 1,
      isOpen: true,
      propertyTitle: '',
      rentPrice: '',
      period: 'monthly',
      spaceDetails: ['', '', '', '', '', '']
    }
  ]);
  
  const [formData, setFormData] = useState({
    // Basic Information
    propertyTitle: '',
    buildingType: '',
    propertyAvailability: '',
    agent: '',
    propertyAddress: '',
    spaceType: '',
    details: '',
    areaSize: '',
    airConditioner: '',
    desks: '',
    garage: '',
    
    // Payment Breakdown
    lightFee: '',
    securityFee: '',
    estateDue: '',
    binContribution: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpaceChange = (spaceId, field, value) => {
    setSpaces(prev => prev.map(space => 
      space.id === spaceId ? { ...space, [field]: value } : space
    ));
  };

  const handleSpaceDetailChange = (spaceId, index, value) => {
    setSpaces(prev => prev.map(space => 
      space.id === spaceId 
        ? { 
            ...space, 
            spaceDetails: space.spaceDetails.map((detail, i) => 
              i === index ? value : detail
            )
          }
        : space
    ));
  };

  const addSpace = () => {
    const newSpace = {
      id: spaces.length + 1,
      isOpen: false,
      propertyTitle: '',
      rentPrice: '',
      period: 'monthly',
      spaceDetails: ['', '', '', '', '', '']
    };
    setSpaces(prev => [...prev, newSpace]);
  };

  const toggleSpace = (spaceId) => {
    setSpaces(prev => prev.map(space => 
      space.id === spaceId ? { ...space, isOpen: !space.isOpen } : space
    ));
  };

  const resetSpaceDetails = (spaceId) => {
    setSpaces(prev => prev.map(space => 
      space.id === spaceId 
        ? { ...space, spaceDetails: ['', '', '', '', '', ''] }
        : space
    ));
  };

  const handleSubmit = async () => {
    try {
      // Add your API call here to save the co-working space
      const payload = {
        ...formData,
        spaces: spaces,
        property_type: 'Co-working Space'
      };
      console.log('Submitting:', payload);
      toast.success('Co-working space created successfully!');
    } catch (error) {
      toast.error('Failed to create co-working space');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'payment', label: 'Payment Breakdown' },
    { id: 'spaces', label: 'Spaces' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/spaces/co-working-space">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add Co-working Space</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="text-[#521282] border-purple-200 hover:bg-purple-50">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-[#521282] hover:bg-[#521282]/90">
            Save
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-[#521282]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'basic' && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="propertyTitle" className="text-sm font-medium text-gray-700 uppercase tracking-wide">PROPERTY TITLE</Label>
                  <Input
                    id="propertyTitle"
                    placeholder="Enter property title"
                    value={formData.propertyTitle}
                    onChange={(e) => handleInputChange('propertyTitle', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="buildingType" className="text-sm font-medium text-gray-700 uppercase tracking-wide">BUILDING TYPE</Label>
                  <Select onValueChange={(value) => handleInputChange('buildingType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Enter building type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office-building">Office Building</SelectItem>
                      <SelectItem value="co-working-space">Co-working Space</SelectItem>
                      <SelectItem value="business-center">Business Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="propertyAvailability" className="text-sm font-medium text-gray-700 uppercase tracking-wide">PROPERTY AVAILABILITY</Label>
                  <Select onValueChange={(value) => handleInputChange('propertyAvailability', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="agent" className="text-sm font-medium text-gray-700 uppercase tracking-wide">AGENT</Label>
                  <Select onValueChange={(value) => handleInputChange('agent', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent1">Agent 1</SelectItem>
                      <SelectItem value="agent2">Agent 2</SelectItem>
                      <SelectItem value="agent3">Agent 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="propertyAddress" className="text-sm font-medium text-gray-700 uppercase tracking-wide">PROPERTY ADDRESS</Label>
                <Input
                  id="propertyAddress"
                  placeholder="Enter property address"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="spaceType" className="text-sm font-medium text-gray-700 uppercase tracking-wide">SPACE TYPE</Label>
                <Select onValueChange={(value) => handleInputChange('spaceType', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select spaces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot-desk">Hot Desk</SelectItem>
                    <SelectItem value="dedicated-desk">Dedicated Desk</SelectItem>
                    <SelectItem value="private-office">Private Office</SelectItem>
                    <SelectItem value="meeting-room">Meeting Room</SelectItem>
                    <SelectItem value="event-space">Event Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="details" className="text-sm font-medium text-gray-700 uppercase tracking-wide">DETAILS</Label>
                <Textarea
                  id="details"
                  placeholder="Enter property details"
                  value={formData.details}
                  onChange={(e) => handleInputChange('details', e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Image Upload Sections */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">Upload VR Video</p>
                  <p className="text-gray-400 text-sm mt-1">Supports VR format</p>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">Upload Video</p>
                  <p className="text-gray-400 text-sm mt-1">Supports Mp4 format</p>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="areaSize" className="text-sm font-medium text-gray-700 uppercase tracking-wide">AREA SIZE (IN SQ FT)</Label>
                  <Input
                    id="areaSize"
                    placeholder="Enter size"
                    value={formData.areaSize}
                    onChange={(e) => handleInputChange('areaSize', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="airConditioner" className="text-sm font-medium text-gray-700 uppercase tracking-wide">AIR CONDITIONER</Label>
                  <Input
                    id="airConditioner"
                    placeholder="Enter number of bedroom"
                    value={formData.airConditioner}
                    onChange={(e) => handleInputChange('airConditioner', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="desks" className="text-sm font-medium text-gray-700 uppercase tracking-wide">DESKS</Label>
                  <Input
                    id="desks"
                    placeholder="Enter number of bathroom"
                    value={formData.desks}
                    onChange={(e) => handleInputChange('desks', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="garage" className="text-sm font-medium text-gray-700 uppercase tracking-wide">GARAGE</Label>
                  <Input
                    id="garage"
                    placeholder="Enter number of parking space"
                    value={formData.garage}
                    onChange={(e) => handleInputChange('garage', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Space Details */}
              <div>
                <Label className="text-sm font-medium text-gray-700 uppercase tracking-wide">SPACE DETAILS (ADDITIONAL DETAILS)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input placeholder="Enter detail" className="text-sm" />
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-3 text-[#521282] border-purple-200 hover:bg-purple-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add more
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payment' && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="lightFee" className="text-sm font-medium text-gray-700 uppercase tracking-wide">LIGHT FEE</Label>
                  <Input
                    id="lightFee"
                    placeholder="Enter property title"
                    value={formData.lightFee}
                    onChange={(e) => handleInputChange('lightFee', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="securityFee" className="text-sm font-medium text-gray-700 uppercase tracking-wide">SECURITY FEE</Label>
                  <Input
                    id="securityFee"
                    placeholder="Enter price"
                    value={formData.securityFee}
                    onChange={(e) => handleInputChange('securityFee', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="estateDue" className="text-sm font-medium text-gray-700 uppercase tracking-wide">ESTATE DUE</Label>
                  <Input
                    id="estateDue"
                    placeholder="Enter price"
                    value={formData.estateDue}
                    onChange={(e) => handleInputChange('estateDue', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="binContribution" className="text-sm font-medium text-gray-700 uppercase tracking-wide">BIN CONTRIBUTION</Label>
                  <Input
                    id="binContribution"
                    placeholder="Enter price"
                    value={formData.binContribution}
                    onChange={(e) => handleInputChange('binContribution', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button variant="outline" className="text-[#521282] border-purple-200 hover:bg-purple-50">
                <Plus className="h-4 w-4 mr-2" />
                Add more
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'spaces' && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {spaces.map((space, index) => (
                <Collapsible key={space.id} open={space.isOpen} onOpenChange={() => toggleSpace(space.id)}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium text-gray-900">Space {space.id}</span>
                    {space.isOpen ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 uppercase tracking-wide">PROPERTY TITLE</Label>
                        <Input
                          placeholder="Enter property title"
                          value={space.propertyTitle}
                          onChange={(e) => handleSpaceChange(space.id, 'propertyTitle', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 uppercase tracking-wide">RENT PRICE (ONLY DIGITS)</Label>
                        <Input
                          placeholder="Enter price"
                          value={space.rentPrice}
                          onChange={(e) => handleSpaceChange(space.id, 'rentPrice', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 uppercase tracking-wide">PERIOD</Label>
                      <Select value={space.period} onValueChange={(value) => handleSpaceChange(space.id, 'period', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Video Upload Sections */}
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">Upload Video</p>
                        <p className="text-gray-400 text-sm mt-1">Supports Mp4 format</p>
                      </div>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">Upload VR Video</p>
                        <p className="text-gray-400 text-sm mt-1">Supports VR format</p>
                      </div>
                    </div>

                    {/* Space Details */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 uppercase tracking-wide">SPACE DETAILS (ADDITIONAL DETAILS)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        {space.spaceDetails.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center gap-2">
                            <Input 
                              placeholder="Enter detail" 
                              className="text-sm" 
                              value={detail}
                              onChange={(e) => handleSpaceDetailChange(space.id, detailIndex, e.target.value)}
                            />
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 text-[#521282] border-purple-200 hover:bg-purple-50"
                        onClick={() => resetSpaceDetails(space.id)}
                      >
                        Reset
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}

              {/* Add more spaces */}
              <div className="space-y-4">
                {spaces.length < 3 && (
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-900">Space {spaces.length + 1}</span>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </CollapsibleTrigger>
                  </Collapsible>
                )}
                
                {spaces.length < 3 && (
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-900">Space {spaces.length + 2}</span>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </CollapsibleTrigger>
                  </Collapsible>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AddCoWorkingSpace;