"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function AddNewListing() {
  const [activeTab, setActiveTab] = useState('basic');
  const [includeRTO, setIncludeRTO] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    propertyTitle: '',
    propertyAddress: '',
    buildingType: '',
    propertyAvailability: '',
    details: '',
    areaSize: '',
    bedroom: '',
    bathroom: '',
    garage: '',
    
    // RTO Settings
    rentalPeriod: '',
    optionToBuyPeriod: '',
    buyOptionExpiryDate: '',
    monthlyRent: '',
    rentCredit: '',
    buyPrice: '',
    optionFee: '',
    defaultConditions: '',
    
    // Payment Breakdown
    lightFee: '',
    securityFee: '',
    estateDue: '',
    binContribution: '',
    additionalFees: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAdditionalFee = () => {
    setFormData(prev => ({
      ...prev,
      additionalFees: [...prev.additionalFees, { name: '', amount: '' }]
    }));
  };

  const handleSubmit = async () => {
    try {
      // Add your API call here to save the listing
      toast.success('Listing created successfully!');
    } catch (error) {
      toast.error('Failed to create listing');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'rto', label: 'RTO Settings' },
    { id: 'payment', label: 'Payment Breakdown' }
  ];

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/spaces/apartment">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Apartment</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
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
          <Card>
            <CardHeader>
              <CardTitle>Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="propertyTitle">PROPERTY TITLE</Label>
                  <Input
                    id="propertyTitle"
                    placeholder="Enter property title"
                    value={formData.propertyTitle}
                    onChange={(e) => handleInputChange('propertyTitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="buildingType">BUILDING TYPE</Label>
                  <Select onValueChange={(value) => handleInputChange('buildingType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="propertyAvailability">PROPERTY AVAILABILITY</Label>
                  <Select onValueChange={(value) => handleInputChange('propertyAvailability', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="agent">AGENT</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent1">Agent 1</SelectItem>
                      <SelectItem value="agent2">Agent 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="propertyAddress">PROPERTY ADDRESS</Label>
                <Input
                  id="propertyAddress"
                  placeholder="Enter property address"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="details">DETAILS</Label>
                <Textarea
                  id="details"
                  placeholder="Enter property details"
                  value={formData.details}
                  onChange={(e) => handleInputChange('details', e.target.value)}
                  rows={4}
                />
              </div>

              {/* Image Upload Sections */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Upload VR Video</p>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Upload Video</p>
                </div>
              </div>

              {/* Room Type Selection */}
              <div>
                <Label>Room Types</Label>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">Living Room</Button>
                  <Button variant="outline" size="sm">Bed Room</Button>
                  <Button variant="outline" size="sm">Bath Room</Button>
                  <Button variant="outline" size="sm">Kitchen</Button>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Upload Images of the Living Room</p>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="areaSize">AREA SIZE (SQ.FT)</Label>
                  <Input
                    id="areaSize"
                    placeholder="Enter area size"
                    value={formData.areaSize}
                    onChange={(e) => handleInputChange('areaSize', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bedroom">BEDROOM</Label>
                  <Input
                    id="bedroom"
                    placeholder="Number of bedrooms"
                    value={formData.bedroom}
                    onChange={(e) => handleInputChange('bedroom', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="bathroom">BATHROOM</Label>
                  <Input
                    id="bathroom"
                    placeholder="Number of bathrooms"
                    value={formData.bathroom}
                    onChange={(e) => handleInputChange('bathroom', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="garage">GARAGE</Label>
                  <Input
                    id="garage"
                    placeholder="Enter garage details"
                    value={formData.garage}
                    onChange={(e) => handleInputChange('garage', e.target.value)}
                  />
                </div>
              </div>

              {/* Home Details */}
              <div>
                <Label>HOME DETAILS MAINTENANCE DETAILS</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input placeholder="Add detail" className="text-sm" />
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add more
                </Button>
              </div>

              {/* Home Directs */}
              <div>
                <Label>HOME DIRECTS</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input placeholder="Add item" className="text-sm" />
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add more
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'rto' && (
          <Card>
            <CardHeader>
              <CardTitle>Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* RTO Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="includeRTO" className="text-base font-medium">
                  INCLUDE RENT TO OWN MODEL FOR THIS PROPERTY
                </Label>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="includeRTO"
                    checked={includeRTO}
                    onChange={(e) => setIncludeRTO(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setIncludeRTO(!includeRTO)}
                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                      includeRTO ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        includeRTO ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`}
                    />
                  </div>
                </div>
              </div>

              {includeRTO && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="rentalPeriod">RENTAL PERIOD (Months)</Label>
                      <Input
                        id="rentalPeriod"
                        placeholder="E.g 36"
                        value={formData.rentalPeriod}
                        onChange={(e) => handleInputChange('rentalPeriod', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="optionToBuyPeriod">OPTION TO BUY PERIOD (Months)</Label>
                      <Input
                        id="optionToBuyPeriod"
                        placeholder="E.g 36"
                        value={formData.optionToBuyPeriod}
                        onChange={(e) => handleInputChange('optionToBuyPeriod', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="buyOptionExpiryDate">BUY OPTION EXPIRY DATE</Label>
                      <Input
                        id="buyOptionExpiryDate"
                        type="date"
                        value={formData.buyOptionExpiryDate}
                        onChange={(e) => handleInputChange('buyOptionExpiryDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="monthlyRent">MONTHLY RENT</Label>
                      <Input
                        id="monthlyRent"
                        placeholder="Enter price"
                        value={formData.monthlyRent}
                        onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="rentCredit">RENT CREDIT (%)</Label>
                      <Input
                        id="rentCredit"
                        placeholder="Enter value"
                        value={formData.rentCredit}
                        onChange={(e) => handleInputChange('rentCredit', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="buyPrice">BUY PRICE</Label>
                      <Input
                        id="buyPrice"
                        placeholder="Enter price"
                        value={formData.buyPrice}
                        onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="optionFee">OPTION FEE</Label>
                    <Input
                      id="optionFee"
                      placeholder="Enter amount"
                      value={formData.optionFee}
                      onChange={(e) => handleInputChange('optionFee', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultConditions">DEFAULT & TERMINATION CONDITIONS</Label>
                    <Textarea
                      id="defaultConditions"
                      placeholder="Enter conditions"
                      value={formData.defaultConditions}
                      onChange={(e) => handleInputChange('defaultConditions', e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Maintenance & Repairs */}
                  <div>
                    <Label className="text-base font-medium">MAINTENANCE & REPAIRS</Label>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>LandLord</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>Tenant</span>
                      </label>
                    </div>
                  </div>

                  {/* Property Insurance */}
                  <div>
                    <Label className="text-base font-medium">PROPERTY INSURANCE</Label>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>LandLord</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>Tenant</span>
                      </label>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle>Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="lightFee">LIGHT FEE</Label>
                  <Input
                    id="lightFee"
                    placeholder="Enter property title"
                    value={formData.lightFee}
                    onChange={(e) => handleInputChange('lightFee', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="securityFee">SECURITY FEE</Label>
                  <Input
                    id="securityFee"
                    placeholder="Enter price"
                    value={formData.securityFee}
                    onChange={(e) => handleInputChange('securityFee', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="estateDue">ESTATE DUE</Label>
                  <Input
                    id="estateDue"
                    placeholder="Enter price"
                    value={formData.estateDue}
                    onChange={(e) => handleInputChange('estateDue', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="binContribution">BIN CONTRIBUTION</Label>
                  <Input
                    id="binContribution"
                    placeholder="Enter price"
                    value={formData.binContribution}
                    onChange={(e) => handleInputChange('binContribution', e.target.value)}
                  />
                </div>
              </div>

              <Button variant="outline" onClick={addAdditionalFee}>
                <Plus className="h-4 w-4 mr-2" />
                Add more
              </Button>

              {/* Additional Fees */}
              {formData.additionalFees.map((fee, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    placeholder="Fee name"
                    value={fee.name}
                    onChange={(e) => {
                      const newFees = [...formData.additionalFees];
                      newFees[index].name = e.target.value;
                      handleInputChange('additionalFees', newFees);
                    }}
                  />
                  <Input
                    placeholder="Amount"
                    value={fee.amount}
                    onChange={(e) => {
                      const newFees = [...formData.additionalFees];
                      newFees[index].amount = e.target.value;
                      handleInputChange('additionalFees', newFees);
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AddNewListing;