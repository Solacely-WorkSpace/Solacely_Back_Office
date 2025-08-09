"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Trash, Plus, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { listingsAPI } from "@/utils/api/listings";
import { usersAPI } from "@/utils/api/users";
import { useRouter } from "next/navigation";
import Image from "next/image";


function EditListing({ params }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [includeRTO, setIncludeRTO] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('livingRoom');
  const [newImages, setNewImages] = useState({
    livingRoom: [],
    bedRoom: [],
    bathRoom: [],
    kitchen: [],
    visitorBathroom: []
  });
  const [existingImages, setExistingImages] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Refs for file inputs
  const vrVideoRef = useRef(null);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  
  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState({
    vrVideo: null,
    video: null,
    images: {
      livingRoom: [],
      bedRoom: [],
      bathRoom: [],
      kitchen: [],
      visitorBathroom: []
    }
  });

  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    location: "",
    building_type: "",
    status: "available",
    agent_email: "",
    description: "",
    area_size_sqm: "",
    number_of_bedrooms: "",
    number_of_bathrooms: "",
    garage: "",
    price: "",
    listing_type: "sale",
    amenities: "",
    repairs: [],
    defects: [],
    latitude: "",
    longitude: "",
    
    // RTO Settings
    rentalPeriod: "",
    optionToBuyPeriod: "",
    buyOptionExpiryDate: "",
    monthlyRent: "",
    rentCredit: "",
    buyPrice: "",
    optionFee: "",
    defaultConditions: "",
    
    // Payment Breakdown
    lightFee: "",
    securityFee: "",
    estateDue: "",
    binContribution: "",
    additionalFees: []
  });

  useEffect(() => {
    fetchListing();
    fetchAgents();
  }, [id]);

  const fetchAgents = async () => {
    try {
      const response = await usersAPI.getUsers();
      const agentsList = response.results?.filter(user => user.is_agent) || [];
      
      if (agentsList.length === 0) {
        const dummyAgents = [
          { id: 'agent1', email: 'akinrodoluseun12@gmail.com', full_name: 'John Doe' },
          { id: 'agent2', email: 'jane.smith@solacely.com', full_name: 'Jane Smith' },
          { id: 'agent3', email: 'michael.brown@solacely.com', full_name: 'Michael Brown' },
          { id: 'agent4', email: 'sarah.wilson@solacely.com', full_name: 'Sarah Wilson' },
          { id: 'agent5', email: 'david.johnson@solacely.com', full_name: 'David Johnson' }
        ];
        setAgents(dummyAgents);
      } else {
        setAgents(agentsList);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      const dummyAgents = [
        { id: 'agent1', email: 'alazarashebir01@gmail.com', full_name: 'John Doe' },
        { id: 'agent2', email: 'jane.smith@solacely.com', full_name: 'Jane Smith' }
      ];
      setAgents(dummyAgents);
    }
  };

  const fetchListing = async () => {
    try {
      const data = await listingsAPI.getListing(id);
      setListing(data);
      setFormData({
        title: data.title || "",
        location: data.location || data.address || "",
        building_type: data.building_type || "",
        status: data.status || "available",
        agent_email: data.agent_email || "",
        description: data.description || "",
        area_size_sqm: data.area_size_sqm || data.area || "",
        number_of_bedrooms: data.number_of_bedrooms || "",
        number_of_bathrooms: data.number_of_bathrooms || "",
        garage: data.garage || "",
        price: data.price || "",
        listing_type: data.listing_type || "sale",
        amenities: data.amenities || "",
        repairs: data.repairs || [],
        defects: data.defects || [],
        latitude: data.latitude || "",
        longitude: data.longitude || "",
        
        // RTO Settings
        rentalPeriod: data.rental_period || "",
        optionToBuyPeriod: data.option_to_buy_period || "",
        buyOptionExpiryDate: data.buy_option_expiry_date || "",
        monthlyRent: data.monthly_rent || "",
        rentCredit: data.rent_credit || "",
        buyPrice: data.buy_price || "",
        optionFee: data.option_fee || "",
        defaultConditions: data.default_conditions || "",
        
        // Payment Breakdown
        lightFee: data.light_fee || "",
        securityFee: data.security_fee || "",
        estateDue: data.estate_due || "",
        binContribution: data.bin_contribution || "",
        additionalFees: data.additional_fees || []
      });

      // Check if RTO is enabled
      setIncludeRTO(data.has_rto || false);

      // Fetch existing images
      try {
        const images = await listingsAPI.getListingImages(id);
        setExistingImages(images);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
      toast.error("Failed to load listing");
      router.push("/dashboard/listings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };



  const addAdditionalFee = () => {
    setFormData(prev => ({
      ...prev,
      additionalFees: [...prev.additionalFees, { name: '', amount: '' }]
    }));
  };

  const handleFileUpload = (type, files, roomType = null) => {
    if (type === 'vrVideo') {
      setUploadedFiles(prev => ({
        ...prev,
        vrVideo: files[0]
      }));
    } else if (type === 'video') {
      setUploadedFiles(prev => ({
        ...prev,
        video: files[0]
      }));
    } else if (type === 'image' && roomType) {
      setNewImages(prev => ({
        ...prev,
        [roomType]: [...prev[roomType], ...files]
      }));
    }
  };

  const removeFile = (type, index, roomType = null) => {
    if (type === 'vrVideo') {
      setUploadedFiles(prev => ({
        ...prev,
        vrVideo: null
      }));
      if (vrVideoRef.current) vrVideoRef.current.value = '';
    } else if (type === 'video') {
      setUploadedFiles(prev => ({
        ...prev,
        video: null
      }));
      if (videoRef.current) videoRef.current.value = '';
    } else if (type === 'image' && roomType) {
      setNewImages(prev => ({
        ...prev,
        [roomType]: prev[roomType].filter((_, i) => i !== index)
      }));
    }
  };

  const deleteExistingImage = async (imageId) => {
    try {
      await listingsAPI.deleteListingImage(id, imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // Validate required fields
      const requiredFields = {
        title: 'Property Title',
        location: 'Property Address',
        building_type: 'Building Type',
        description: 'Details',
        price: 'Price',
        number_of_bedrooms: 'Bedroom',
        number_of_bathrooms: 'Bathroom',
        area_size_sqm: 'Area Size'
      };
      
      const errors = {};
      let hasErrors = false;
      
      Object.entries(requiredFields).forEach(([field, label]) => {
        if (!formData[field]) {
          errors[field] = `${label} is required`;
          hasErrors = true;
        }
      });
      
      // Check description length
      if (formData.description.length < 200) {
        errors.description = 'Description must be at least 200 characters';
        hasErrors = true;
      }
      
      setValidationErrors(errors);
      
      if (hasErrors) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Create FormData for the entire submission
      const formDataToSubmit = new FormData();
      
      // Add all listing data to FormData
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('location', formData.location);
      formDataToSubmit.append('building_type', formData.building_type);
      formDataToSubmit.append('agent_email', formData.agent_email || 'akinrodoluseun12@gmail.com');
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('price', parseFloat(formData.price));
      formDataToSubmit.append('number_of_bedrooms', parseInt(formData.number_of_bedrooms, 10));
      formDataToSubmit.append('number_of_bathrooms', parseInt(formData.number_of_bathrooms, 10));
      formDataToSubmit.append('area_size_sqm', parseFloat(formData.area_size_sqm));
      formDataToSubmit.append('amenities', formData.amenities || 'None provided');
      formDataToSubmit.append('repairs', JSON.stringify(formData.repairs));
      formDataToSubmit.append('defects', JSON.stringify(formData.defects));
      formDataToSubmit.append('status', formData.status);
      formDataToSubmit.append('listing_type', formData.listing_type);
      
      // Add coordinates if available
      if (formData.latitude && formData.longitude) {
        formDataToSubmit.append('latitude', formData.latitude);
        formDataToSubmit.append('longitude', formData.longitude);
      }
      
      // Add RTO settings if enabled
      if (includeRTO) {
        formDataToSubmit.append('has_rto', true);
        formDataToSubmit.append('rental_period', formData.rentalPeriod);
        formDataToSubmit.append('option_to_buy_period', formData.optionToBuyPeriod);
        formDataToSubmit.append('buy_option_expiry_date', formData.buyOptionExpiryDate);
        formDataToSubmit.append('monthly_rent', formData.monthlyRent);
        formDataToSubmit.append('rent_credit', formData.rentCredit);
        formDataToSubmit.append('buy_price', formData.buyPrice);
        formDataToSubmit.append('option_fee', formData.optionFee);
        formDataToSubmit.append('default_conditions', formData.defaultConditions);
      }
      
      // Add payment breakdown
      if (formData.lightFee) formDataToSubmit.append('light_fee', formData.lightFee);
      if (formData.securityFee) formDataToSubmit.append('security_fee', formData.securityFee);
      if (formData.estateDue) formDataToSubmit.append('estate_due', formData.estateDue);
      if (formData.binContribution) formDataToSubmit.append('bin_contribution', formData.binContribution);
      
      if (formData.additionalFees.length > 0) {
        formDataToSubmit.append('additional_fees', JSON.stringify(formData.additionalFees));
      }

      // Update the listing
      await listingsAPI.updateListing(id, formDataToSubmit);

      // Upload new images if any
      const allNewImages = [];
      const allImageTypes = [];
      
      const imageCategories = [
        { files: newImages.livingRoom, type: 'living_room' },
        { files: newImages.bedRoom, type: 'bedroom' },
        { files: newImages.bathRoom, type: 'bathroom' },
        { files: newImages.kitchen, type: 'kitchen' },
        { files: newImages.visitorBathroom, type: 'visitor_bathroom' }
      ];
      
      imageCategories.forEach(category => {
        category.files.forEach(file => {
          allNewImages.push(file);
          allImageTypes.push(category.type);
        });
      });

      if (allNewImages.length > 0) {
        const imageFormData = new FormData();
        allNewImages.forEach(image => {
          imageFormData.append('uploaded_images', image);
        });
        allImageTypes.forEach(type => {
          imageFormData.append('image_types', type);
        });
        
        await listingsAPI.uploadListingImages(id, imageFormData);
      }

      // Upload VR video if available
      if (uploadedFiles.vrVideo) {
        const vrVideoFormData = new FormData();
        vrVideoFormData.append('vr_video', uploadedFiles.vrVideo);
        await listingsAPI.uploadListingVideo(id, vrVideoFormData);
      }
      
      // Upload regular video if available
      if (uploadedFiles.video) {
        const videoFormData = new FormData();
        videoFormData.append('video', uploadedFiles.video);
        await listingsAPI.uploadListingVideo(id, videoFormData);
      }

      toast.success("Listing updated successfully!");
      router.push("/dashboard/listings");
    } catch (error) {
      console.error("Error updating listing:", error);
      
      if (error.response && error.response.data) {
        const serverErrors = error.response.data;
        setValidationErrors(prev => ({
          ...prev,
          ...serverErrors
        }));
        
        if (serverErrors.description) {
          toast.error(`Description: ${serverErrors.description[0]}`);
        }
        if (serverErrors.agent_email) {
          toast.error(`Agent: ${serverErrors.agent_email[0]}`);
        }
      } else {
        toast.error("Failed to update listing: " + (error.message || "Unknown error"));
      }
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'rto', label: 'RTO Settings' },
    { id: 'payment', label: 'Payment Breakdown' }
  ];

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/listings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Listing</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
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
                  <Label htmlFor="title" className={validationErrors.title ? "text-red-500" : ""}>
                    PROPERTY TITLE *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter property title"
                    value={formData.title}
                    onChange={(e) => {
                      handleInputChange('title', e.target.value);
                      if (e.target.value) {
                        setValidationErrors(prev => ({ ...prev, title: undefined }));
                      }
                    }}
                    className={validationErrors.title ? "border-red-500" : ""}
                  />
                  {validationErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="building_type" className={validationErrors.building_type ? "text-red-500" : ""}>
                    BUILDING TYPE *
                  </Label>
                  <Select
                    value={formData.building_type}
                    onValueChange={(value) => {
                      handleInputChange('building_type', value);
                      if (value) {
                        setValidationErrors(prev => ({ ...prev, building_type: undefined }));
                      }
                    }}
                  >
                    <SelectTrigger className={validationErrors.building_type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.building_type && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.building_type}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="status">PROPERTY AVAILABILITY</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="agent_email">AGENT</Label>
                  <Select
                    value={formData.agent_email}
                    onValueChange={(value) => handleInputChange('agent_email', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.email}>
                          {agent.full_name || agent.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="listing_type">LISTING TYPE</Label>
                <Select
                  value={formData.listing_type}
                  onValueChange={(value) => handleInputChange('listing_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className={validationErrors.location ? "text-red-500" : ""}>
                  PROPERTY ADDRESS *
                </Label>
                <Input
                  id="location"
                  placeholder="Enter property address"
                  value={formData.location}
                  onChange={(e) => {
                    handleInputChange('location', e.target.value);
                    if (e.target.value) {
                      setValidationErrors(prev => ({ ...prev, location: undefined }));
                    }
                  }}
                  className={validationErrors.location ? "border-red-500" : ""}
                />
                {validationErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="price" className={validationErrors.price ? "text-red-500" : ""}>
                  PRICE *
                </Label>
                <Input
                  id="price"
                  placeholder="Enter property price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    handleInputChange('price', e.target.value);
                    if (e.target.value) {
                      setValidationErrors(prev => ({ ...prev, price: undefined }));
                    }
                  }}
                  className={validationErrors.price ? "border-red-500" : ""}
                />
                {validationErrors.price && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className={validationErrors.description ? 'text-red-500' : ''}>
                  DETAILS *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter property details"
                  value={formData.description}
                  onChange={(e) => {
                    handleInputChange('description', e.target.value);
                    if (e.target.value && e.target.value.length >= 200) {
                      setValidationErrors(prev => ({ ...prev, description: undefined }));
                    }
                  }}
                  rows={4}
                  className={validationErrors.description ? 'border-red-500' : ''}
                />
                <div className="flex justify-between text-sm mt-1">
                  {validationErrors.description ? (
                    <p className="text-red-500">{validationErrors.description}</p>
                  ) : (
                    <p className="text-gray-500">Minimum 200 characters</p>
                  )}
                  <p className={`${formData.description.length < 200 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.description.length}/200 characters
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="amenities">AMENITIES</Label>
                <Textarea
                  id="amenities"
                  placeholder="Enter property amenities (e.g., WiFi, Pool, Gym)"
                  value={formData.amenities}
                  onChange={(e) => handleInputChange('amenities', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Video Upload Sections */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input 
                    type="file" 
                    ref={vrVideoRef}
                    accept="video/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload('vrVideo', e.target.files)}
                  />
                  {!uploadedFiles.vrVideo ? (
                    <div onClick={() => vrVideoRef.current?.click()} className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">Upload VR Video</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{uploadedFiles.vrVideo.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile('vrVideo')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input 
                    type="file" 
                    ref={videoRef}
                    accept="video/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload('video', e.target.files)}
                  />
                  {!uploadedFiles.video ? (
                    <div onClick={() => videoRef.current?.click()} className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">Upload Video</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{uploadedFiles.video.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile('video')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Room Type Selection */}
              <div>
                <Label>Room Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    variant={selectedRoomType === 'livingRoom' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedRoomType('livingRoom')}
                  >
                    Living Room
                  </Button>
                  <Button 
                    variant={selectedRoomType === 'bedRoom' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedRoomType('bedRoom')}
                  >
                    Bed Room
                  </Button>
                  <Button 
                    variant={selectedRoomType === 'bathRoom' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedRoomType('bathRoom')}
                  >
                    Bath Room
                  </Button>
                  <Button 
                    variant={selectedRoomType === 'kitchen' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedRoomType('kitchen')}
                  >
                    Kitchen
                  </Button>
                  <Button 
                    variant={selectedRoomType === 'visitorBathroom' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedRoomType('visitorBathroom')}
                  >
                    Visitor Bathroom
                  </Button>
                </div>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative">
                        <Image
                          src={
                            image.original_image_url ||
                            image.image ||
                            "/icons/Logo.svg"
                          }
                          alt="Property image"
                          width={200}
                          height={150}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => deleteExistingImage(image.id)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input 
                  type="file" 
                  ref={imageRef}
                  accept="image/*" 
                  multiple
                  className="hidden" 
                  onChange={(e) => handleFileUpload('image', e.target.files, selectedRoomType)}
                />
                <div onClick={() => imageRef.current?.click()} className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Upload Images of the {selectedRoomType === 'livingRoom' ? 'Living Room' : 
                    selectedRoomType === 'bedRoom' ? 'Bed Room' : 
                    selectedRoomType === 'bathRoom' ? 'Bath Room' : 
                    selectedRoomType === 'kitchen' ? 'Kitchen' : 'Visitor Bathroom'}</p>
                </div>
                
                {/* Display new uploaded images */}
                {newImages[selectedRoomType].length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {newImages[selectedRoomType].map((file, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Room image ${index}`} 
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeFile('image', index, selectedRoomType)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="area_size_sqm" className={validationErrors.area_size_sqm ? "text-red-500" : ""}>
                    AREA SIZE (SQ.M) *
                  </Label>
                  <Input
                    id="area_size_sqm"
                    placeholder="Enter area size"
                    type="number"
                    value={formData.area_size_sqm}
                    onChange={(e) => {
                      handleInputChange('area_size_sqm', e.target.value);
                      if (e.target.value) {
                        setValidationErrors(prev => ({ ...prev, area_size_sqm: undefined }));
                      }
                    }}
                    className={validationErrors.area_size_sqm ? "border-red-500" : ""}
                  />
                  {validationErrors.area_size_sqm && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.area_size_sqm}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="number_of_bedrooms" className={validationErrors.number_of_bedrooms ? "text-red-500" : ""}>
                    BEDROOM *
                  </Label>
                  <Input
                    id="number_of_bedrooms"
                    placeholder="Number of bedrooms"
                    type="number"
                    value={formData.number_of_bedrooms}
                    onChange={(e) => {
                      handleInputChange('number_of_bedrooms', e.target.value);
                      if (e.target.value) {
                        setValidationErrors(prev => ({ ...prev, number_of_bedrooms: undefined }));
                      }
                    }}
                    className={validationErrors.number_of_bedrooms ? "border-red-500" : ""}
                  />
                  {validationErrors.number_of_bedrooms && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.number_of_bedrooms}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="number_of_bathrooms" className={validationErrors.number_of_bathrooms ? "text-red-500" : ""}>
                    BATHROOM *
                  </Label>
                  <Input
                    id="number_of_bathrooms"
                    placeholder="Number of bathrooms"
                    type="number"
                    value={formData.number_of_bathrooms}
                    onChange={(e) => {
                      handleInputChange('number_of_bathrooms', e.target.value);
                      if (e.target.value) {
                        setValidationErrors(prev => ({ ...prev, number_of_bathrooms: undefined }));
                      }
                    }}
                    className={validationErrors.number_of_bathrooms ? "border-red-500" : ""}
                  />
                  {validationErrors.number_of_bathrooms && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.number_of_bathrooms}</p>
                  )}
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

              {/* Repairs */}
              <div>
                <Label>REPAIRS</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {formData.repairs.map((repair, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={repair} 
                        onChange={(e) => {
                          const newRepairs = [...formData.repairs];
                          newRepairs[index] = e.target.value;
                          handleInputChange('repairs', newRepairs);
                        }} 
                        className="text-sm" 
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const newRepairs = formData.repairs.filter((_, i) => i !== index);
                          handleInputChange('repairs', newRepairs);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Add repair" 
                      className="text-sm" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          e.preventDefault();
                          handleInputChange('repairs', [...formData.repairs, e.target.value.trim()]);
                          e.target.value = '';
                        }
                      }} 
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling;
                        if (input.value.trim()) {
                          handleInputChange('repairs', [...formData.repairs, input.value.trim()]);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Defects */}
              <div>
                <Label>DEFECTS</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {formData.defects.map((defect, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={defect} 
                        onChange={(e) => {
                          const newDefects = [...formData.defects];
                          newDefects[index] = e.target.value;
                          handleInputChange('defects', newDefects);
                        }} 
                        className="text-sm" 
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const newDefects = formData.defects.filter((_, i) => i !== index);
                          handleInputChange('defects', newDefects);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Add defect" 
                      className="text-sm" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          e.preventDefault();
                          handleInputChange('defects', [...formData.defects, e.target.value.trim()]);
                          e.target.value = '';
                        }
                      }} 
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling;
                        if (input.value.trim()) {
                          handleInputChange('defects', [...formData.defects, input.value.trim()]);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'rto' && (
          <Card>
            <CardHeader>
              <CardTitle>Rent-to-Own Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeRTO"
                  checked={includeRTO}
                  onChange={(e) => setIncludeRTO(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="includeRTO">Enable Rent-to-Own Option</Label>
              </div>

              {includeRTO && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="rentalPeriod">RENTAL PERIOD (MONTHS)</Label>
                      <Input
                        id="rentalPeriod"
                        placeholder="Enter rental period"
                        type="number"
                        value={formData.rentalPeriod}
                        onChange={(e) => handleInputChange('rentalPeriod', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="optionToBuyPeriod">OPTION TO BUY PERIOD (MONTHS)</Label>
                      <Input
                        id="optionToBuyPeriod"
                        placeholder="Enter option to buy period"
                        type="number"
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
                        placeholder="Enter monthly rent"
                        type="number"
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
                        placeholder="Enter rent credit percentage"
                        type="number"
                        value={formData.rentCredit}
                        onChange={(e) => handleInputChange('rentCredit', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="buyPrice">BUY PRICE</Label>
                      <Input
                        id="buyPrice"
                        placeholder="Enter buy price"
                        type="number"
                        value={formData.buyPrice}
                        onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="optionFee">OPTION FEE</Label>
                    <Input
                      id="optionFee"
                      placeholder="Enter option fee"
                      type="number"
                      value={formData.optionFee}
                      onChange={(e) => handleInputChange('optionFee', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultConditions">DEFAULT CONDITIONS</Label>
                    <Textarea
                      id="defaultConditions"
                      placeholder="Enter default conditions"
                      value={formData.defaultConditions}
                      onChange={(e) => handleInputChange('defaultConditions', e.target.value)}
                      rows={4}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="lightFee">LIGHT FEE</Label>
                  <Input
                    id="lightFee"
                    placeholder="Enter light fee"
                    type="number"
                    value={formData.lightFee}
                    onChange={(e) => handleInputChange('lightFee', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="securityFee">SECURITY FEE</Label>
                  <Input
                    id="securityFee"
                    placeholder="Enter security fee"
                    type="number"
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
                    placeholder="Enter estate due"
                    type="number"
                    value={formData.estateDue}
                    onChange={(e) => handleInputChange('estateDue', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="binContribution">BIN CONTRIBUTION</Label>
                  <Input
                    id="binContribution"
                    placeholder="Enter bin contribution"
                    type="number"
                    value={formData.binContribution}
                    onChange={(e) => handleInputChange('binContribution', e.target.value)}
                  />
                </div>
              </div>

              {/* Additional Fees */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>ADDITIONAL FEES</Label>
                  <Button onClick={addAdditionalFee} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fee
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.additionalFees.map((fee, index) => (
                    <div key={index} className="flex gap-4 items-center">
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
                        type="number"
                        value={fee.amount}
                        onChange={(e) => {
                          const newFees = [...formData.additionalFees];
                          newFees[index].amount = e.target.value;
                          handleInputChange('additionalFees', newFees);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFees = formData.additionalFees.filter((_, i) => i !== index);
                          handleInputChange('additionalFees', newFees);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default EditListing;
