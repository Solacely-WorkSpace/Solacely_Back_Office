"use client";
import React, { useEffect, useState } from 'react';
import { listingsAPI } from '@/utils/api/listings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function ApartmentPage() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchApartments();
  }, [filterType, filterStatus, filterLocation, sortBy, sortOrder]);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {};
      
      // Add type filter
      if (filterType !== 'all') {
        params.type = filterType;
      }
      
      // Add status filter
      if (filterStatus === 'active') {
        params.active = true;
      } else if (filterStatus === 'inactive') {
        params.active = false;
      }
      
      // Add location filter (will be handled by backend)
      if (filterLocation !== 'all') {
        params.location = filterLocation;
      }
      
      // Add sorting
      params.ordering = sortOrder === 'asc' ? sortBy : `-${sortBy}`;
      
      // Fetch data using the API
      const response = await listingsAPI.getListings(params);
      const data = response.results || response;
      setApartments(data || []);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      toast.error('Failed to fetch apartments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm) {
      fetchApartments();
      return;
    }

    const filteredApartments = apartments.filter(
      (apartment) =>
        apartment.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apartment.price?.toString().includes(searchTerm)
    );

    setApartments(filteredApartments);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Updated to format price in Naira
  const formatPrice = (price) => {
    if (!price) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price).replace('NGN', '₦');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Updated status badges with complementary colors
  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 font-medium">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 font-medium">
        Inactive
      </Badge>
    );
  };

  // Helper function to get proper image URL
  const getImageUrl = (apartment) => {
    if (apartment?.listingimages && apartment.listingimages.length > 0) {
      const firstImage = apartment.listingimages[0];
      
      // Check for original_image_url first
      if (firstImage.original_image_url) {
        return firstImage.original_image_url;
      }
      
      // Check for url field
      if (firstImage.url) {
        // If it's already a full URL, use it
        if (firstImage.url.startsWith('http')) {
          return firstImage.url;
        }
        // If it's a Cloudinary path, construct the full URL
        return `https://res.cloudinary.com/${firstImage.url}`;
      }
      
      // Check for image field
      if (firstImage.image) {
        if (firstImage.image.startsWith('http')) {
          return firstImage.image;
        }
        return `https://res.cloudinary.com/${firstImage.image}`;
      }
    }
    
    // Fallback to placeholder
    return "/images/apartment-placeholder.jpg";
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Apartment Listings</h1>
        <Button asChild>
          <Link href="/dashboard/add-new-listing">Add new</Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by address or price"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Rent">For Rent</SelectItem>
                  <SelectItem value="Sell">For Sale</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">For rent</SelectItem>
                  <SelectItem value="inactive">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Lagos">Lagos</SelectItem>
                  <SelectItem value="Abuja">Abuja</SelectItem>
                  <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                </SelectContent>
              </Select>

              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [column, order] = value.split('-');
                setSortBy(column);
                setSortOrder(order);
              }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at-desc">Past 30 Days</SelectItem>
                  <SelectItem value="created_at-asc">Oldest First</SelectItem>
                  <SelectItem value="price-desc">Price High to Low</SelectItem>
                  <SelectItem value="price-asc">Price Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-[50px] text-center">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('address')}
                >
                  <div className="flex items-center gap-2">
                    Title/Property ID
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('address')}
                >
                  <div className="flex items-center gap-2">
                    Location
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))
              ) : apartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No apartments found
                  </TableCell>
                </TableRow>
              ) : (
                apartments.map((apartment) => (
                  <TableRow key={apartment.id} className="hover:bg-gray-50">
                    <TableCell className="text-center">
                      <input type="checkbox" className="rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={getImageUrl(apartment)}
                            alt={apartment.address || 'Property'}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.target.src = "/images/apartment-placeholder.jpg";
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {apartment.title || `${apartment.propertyType || apartment.building_type || 'Property'} - ${apartment.bedroom || apartment.number_of_bedrooms || 0} Bedroom`}
                          </div>
                          <div className="text-xs text-gray-500">
                            RH-{apartment.id.toString().padStart(4, '0')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(apartment.created_at)}
                      </div>
                      <div className="text-xs text-gray-500">
                        at {new Date(apartment.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {apartment.location || (apartment.address ? apartment.address.split(',').slice(-2).join(',').trim() : 'No address')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold" style={{ color: '#3DC5A1' }}>
                        {formatPrice(apartment.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {apartment.type === 'Rent' ? 'Monthly' : 'Total'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(apartment.active)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"
                      >
                        {apartment.propertyType || apartment.building_type || 'Property'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/view-listing/${apartment.id}`}>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/edit-listing/${apartment.id}`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApartmentPage;
