"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Image } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function AddNewAgent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    whatsapp: '',
    email: '',
    location: '',
    workAddress: '',
    agency: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add API call here
      toast.success('Agent added successfully!');
    } catch (error) {
      toast.error('Failed to add agent');
    }
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/partners">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Agent</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/partners">Cancel</Link>
          </Button>
          <Button 
            className="bg-[#521282] hover:bg-[#521282]/90 text-white"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-[#521282] rounded"></div>
            <CardTitle className="text-[#521282] font-medium">Basic Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                FIRST NAME
              </Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                LAST NAME
              </Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                PHONE NUMBER
              </Label>
              <Input
                id="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                WHATSAPP
              </Label>
              <Input
                id="whatsapp"
                placeholder="Enter whatsapp number"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
          </div>

          {/* Email and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                EMAIL
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                LOCATION
              </Label>
              <Select onValueChange={(value) => handleInputChange('location', value)}>
                <SelectTrigger className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Lagos, Nigeria</SelectItem>
                  <SelectItem value="abuja">Abuja, Nigeria</SelectItem>
                  <SelectItem value="port-harcourt">Port Harcourt, Nigeria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Work Address and Agency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="workAddress" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                WORK ADDRESS
              </Label>
              <Input
                id="workAddress"
                placeholder="Enter property address"
                value={formData.workAddress}
                onChange={(e) => handleInputChange('workAddress', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                AGENCY
              </Label>
              <Select onValueChange={(value) => handleInputChange('agency', value)}>
                <SelectTrigger className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]">
                  <SelectValue placeholder="Select agency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agency1">Agency 1</SelectItem>
                  <SelectItem value="agency2">Agency 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Upload Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Image */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                UPLOAD IMAGE
              </Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-[#521282] transition-colors">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Drop your image here, or browse</p>
                    <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, and JPEG</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Work Document */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                UPLOAD WORK DOCUMENT
              </Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-[#521282] transition-colors">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Drop your document here, or browse</p>
                    <p className="text-xs text-gray-500 mt-1">Supports PDF and JPG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewAgent;