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

function AddNewAgency() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    rcNumber: '',
    email: '',
    phoneNumber: '',
    location: '',
    address: '',
    companyLogo: null,
    companyDocument: null
  });
  
  // Refs for file inputs
  const companyLogoInputRef = useRef(null);
  const companyDocumentInputRef = useRef(null);

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
      toast.success(`${field === 'companyLogo' ? 'Company logo' : 'Company document'} selected`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.companyName || !formData.email || !formData.phoneNumber || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare data for API
      const partnerData = {
        partner_name: formData.companyName,
        full_name: formData.companyName,
        phone_number: formData.phoneNumber,
        email: formData.email,
        business_type: 'Agency',
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
      if (formData.companyLogo) {
        formDataWithFiles.append('profile_image', formData.companyLogo);
      }
      
      if (formData.companyDocument) {
        formDataWithFiles.append('work_document', formData.companyDocument);
      }
      
      // Call API to create partner
      const response = await adminAPI.createPartner(formDataWithFiles);
      
      toast.success('Agency added successfully!');
      router.push('/dashboard/partners');
    } catch (error) {
      console.error('Error adding agency:', error);
      toast.error(error.response?.data?.message || 'Failed to add agency');
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Agency</h1>
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
          {/* Company Name and RC Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                COMPANY NAME
              </Label>
              <Input
                id="companyName"
                placeholder="Enter first name"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rcNumber" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                RC NUMBER
              </Label>
              <Input
                id="rcNumber"
                placeholder="Enter last name"
                value={formData.rcNumber}
                onChange={(e) => handleInputChange('rcNumber', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                EMAIL
              </Label>
              <Input
                id="email"
                placeholder="Enter rc number"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                PHONE NUMBER
              </Label>
              <Input
                id="phoneNumber"
                placeholder="Enter whatsapp number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
            </div>
          </div>

          {/* Location and Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                ADDRESS
              </Label>
              <Input
                id="address"
                placeholder="Enter email"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="h-12 border-gray-200 focus:border-[#521282] focus:ring-[#521282]"
              />
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
                onClick={() => companyLogoInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={companyLogoInputRef}
                  className="hidden" 
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => handleFileChange('companyLogo', e)}
                />
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.companyLogo ? formData.companyLogo.name : 'Drop your image here, or browse'}
                    </p>
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
              <div 
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-[#521282] transition-colors cursor-pointer"
                onClick={() => companyDocumentInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={companyDocumentInputRef}
                  className="hidden" 
                  accept="application/pdf,image/jpeg,image/jpg"
                  onChange={(e) => handleFileChange('companyDocument', e)}
                />
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.companyDocument ? formData.companyDocument.name : 'Drop your document here, or browse'}
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

export default AddNewAgency;