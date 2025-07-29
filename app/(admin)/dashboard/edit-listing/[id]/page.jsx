"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Trash } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { listingsAPI } from '@/utils/api/listings';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function EditListing({ params }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    building_type: '',
    status: 'available',
    description: '',
    area: '',
    number_of_bedrooms: '',
    number_of_bathrooms: '',
    garage: '',
    price: '',
    listing_type: 'sale',
  });

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const data = await listingsAPI.getListing(id);
      setListing(data);
      setFormData({
        title: data.title || '',
        address: data.address || '',
        building_type: data.building_type || '',
        status: data.status || 'available',
        description: data.description || '',
        area: data.area || '',
        number_of_bedrooms: data.number_of_bedrooms || '',
        number_of_bathrooms: data.number_of_bathrooms || '',
        garage: data.garage || '',
        price: data.price || '',
        listing_type: data.listing_type || 'sale',
      });
      
      // Fetch existing images
      try {
        const images = await listingsAPI.getListingImages(id);
        setExistingImages(images);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Failed to load listing');
      router.push('/dashboard/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (imageId) => {
    try {
      await listingsAPI.deleteListingImage(id, imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // Validate required fields
      if (!formData.title || !formData.address || !formData.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Update the listing
      const listingData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        number_of_bedrooms: parseInt(formData.number_of_bedrooms) || 0,
        number_of_bathrooms: parseInt(formData.number_of_bathrooms) || 0,
        area: parseFloat(formData.area) || 0,
      };

      await listingsAPI.updateListing(id, listingData);
      
      // Upload new images if any
      if (newImages.length > 0) {
        for (const image of newImages) {
          const imageData = { image };
          await listingsAPI.uploadListingImages(id, imageData);
        }
      }

      toast.success('Listing updated successfully!');
      router.push('/dashboard/listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

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
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                placeholder="Enter property title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="building_type">Building Type</Label>
              <Select value={formData.building_type} onValueChange={(value) => handleInputChange('building_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select building type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="listing_type">Listing Type</Label>
              <Select value={formData.listing_type} onValueChange={(value) => handleInputChange('listing_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Property Address *</Label>
            <Input
              id="address"
              placeholder="Enter property address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter property description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                placeholder="Enter area"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="number_of_bedrooms">Bedrooms</Label>
              <Input
                id="number_of_bedrooms"
                type="number"
                placeholder="Number of bedrooms"
                value={formData.number_of_bedrooms}
                onChange={(e) => handleInputChange('number_of_bedrooms', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="number_of_bathrooms">Bathrooms</Label>
              <Input
                id="number_of_bathrooms"
                type="number"
                placeholder="Number of bathrooms"
                value={formData.number_of_bathrooms}
                onChange={(e) => handleInputChange('number_of_bathrooms', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Section */}
      <Card>
        <CardHeader>
          <CardTitle>Property Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative">
                      <Image
                        src={image.original_image_url || image.image || '/images/apartment-placeholder.jpg'}
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
            
            {/* Upload New Images */}
            <div>
              <h3 className="text-lg font-medium mb-4">Add New Images</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Upload Additional Images</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="new-image-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="new-image-upload" className="cursor-pointer">
                    Choose Images
                  </label>
                </Button>
              </div>
              
              {/* New Image Preview */}
              {newImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {newImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeNewImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditListing;