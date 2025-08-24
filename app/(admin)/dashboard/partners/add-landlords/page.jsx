"use client";
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Image } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { adminAPI } from '@/utils/api/admin';
import { useRouter } from 'next/navigation';

function AddNewLandlord() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    whatsapp: '',
    email: '',
    location: '',
    propertyAddress: '',
    propertyType: '',
    profileImage: null,
    propertyDocument: null
  });
  
  // Refs for file inputs
  const profileImageInputRef = useRef(null);
  const propertyDocumentInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      toast.success(`${field === 'profileImage' ? 'Profile image' : 'Property document'} selected`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.email || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare data for API
      const partnerData = {
        partner_name: `${formData.firstName} ${formData.lastName}`,
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone_number: formData.phoneNumber,
        email: formData.email,
        business_type: 'Landlord',
        location_region: formData.location,
        company_website: null
      };
      
      // Create FormData for file uploads if needed
      const formDataWithFiles = new FormData();
      
      // Add JSON data
      Object.keys(partnerData).forEach(key => {
        formDataWithFiles.append(key, partnerData[key]);
      });
      
      // Add files if they exist
      if (formData.profileImage) {
        formDataWithFiles.append('profile_image', formData.profileImage);
      }
      
      if (formData.propertyDocument) {
        formDataWithFiles.append('work_document', formData.propertyDocument);
      }
      
      // Call API to create partner
      const response = await adminAPI.createPartner(formDataWithFiles);
      
      toast.success('Landlord added successfully!');
      router.push('/dashboard/partners');
    } catch (error) {
      console.error('Error adding landlord:', error);
      toast.error(error.response?.data?.message || 'Failed to add landlord');
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Landlord</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/partners">Cancel</Link>
          </Button>
          <Button 
            className="bg-[#521282] hover:bg-[#521282]/90 text-white"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
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

          {/* Property Address and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="propertyAddress" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                PROPERTY ADDRESS
              </Label>
              <Input
                id="propertyAddress"
                placeholder="Enter property address"
                value={formData.propertyAddress}
                onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                PROPERTY TYPE
              </Label>
              <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                <SelectTrigger className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
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
              <div 
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-[#521282] transition-colors cursor-pointer"
                onClick={() => profileImageInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={profileImageInputRef}
                  className="hidden" 
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => handleFileChange('profileImage', e)}
                />
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.profileImage ? formData.profileImage.name : 'Drop your image here, or browse'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, and JPEG</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Property Document */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                UPLOAD PROPERTY DOCUMENT
              </Label>
              <div 
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-[#521282] transition-colors cursor-pointer"
                onClick={() => propertyDocumentInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={propertyDocumentInputRef}
                  className="hidden" 
                  accept="application/pdf,image/jpeg,image/jpg"
                  onChange={(e) => handleFileChange('propertyDocument', e)}
                />
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.propertyDocument ? formData.propertyDocument.name : 'Drop your document here, or browse'}
                    </p>
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

export default AddNewLandlord;