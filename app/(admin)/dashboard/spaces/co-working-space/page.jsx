"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, ArrowUpDown, MoreHorizontal, Plus, Building2 } from 'lucide-react';
import { listingsAPI } from '@/utils/api/listings';

function CoWorkingSpacePage() {
  const [coWorkingSpaces, setCoWorkingSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchCoWorkingSpaces();
  }, [searchTerm, statusFilter, locationFilter, sortBy, sortOrder]);

  const fetchCoWorkingSpaces = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        location: locationFilter !== 'all' ? locationFilter : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        property_type: 'Co-working Space'
      };
      
      const response = await listingsAPI.getListings(params);
      setCoWorkingSpaces(response.data || []);
    } catch (error) {
      console.error('Error fetching co-working spaces:', error);
      setCoWorkingSpaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium">
          Active
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-gray-50 text-gray-600 border-gray-200 font-medium">
          Inactive
        </Badge>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Co-working Spaces</h1>
              <p className="text-gray-600 mt-1">Manage your co-working space listings</p>
            </div>
          </div>
          <Link href="/dashboard/spaces/co-working-space/add">
            <Button className="bg-[#521282] hover:bg-[#521282]/90 text-white shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New Space
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="border-gray-200/60 shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search spaces..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Lagos">Lagos</SelectItem>
                    <SelectItem value="Abuja">Abuja</SelectItem>
                    <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [column, order] = value.split('-');
                  setSortBy(column);
                  setSortOrder(order);
                }}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="created_at-asc">Oldest First</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-gray-200/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50/50">
                  <TableHead className="w-[60px] text-center py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100/50 transition-colors py-4 px-6"
                    onClick={() => handleSort('address')}
                  >
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      Space Details
                      <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100/50 transition-colors py-4 px-6"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      Date Added
                      <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100/50 transition-colors py-4 px-6"
                    onClick={() => handleSort('address')}
                  >
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      Location
                      <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100/50 transition-colors py-4 px-6"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      Pricing
                      <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="py-4 px-6 font-semibold text-gray-900">Type</TableHead>
                  <TableHead className="w-[80px] py-4 px-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Enhanced Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="border-b border-gray-100">
                      <TableCell className="py-6 text-center">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="space-y-2">
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : coWorkingSpaces.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <Building2 className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-900">No co-working spaces found</p>
                          <p className="text-gray-500">Try adjusting your search criteria or add a new space</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  coWorkingSpaces.map((space) => (
                    <TableRow key={space.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <TableCell className="text-center py-6">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={space?.listingimages?.[0]?.original_image_url || 
                                   (space?.listingimages?.[0]?.url && 
                                   space?.listingimages?.[0]?.url.startsWith('http') ? 
                                   space?.listingimages?.[0]?.url : 
                                   `https://res.cloudinary.com/${space?.listingimages?.[0]?.url}`) || 
                                  "/images/coworking-placeholder.jpg"}
                              alt={space.address || 'Co-working space'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 text-sm truncate">
                              {space.propertyType || 'Co-working Space'}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {space.capacity ? `${space.capacity} Capacity` : 'Capacity N/A'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 font-mono">
                              ID: CW-{space.id.toString().padStart(4, '0')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(space.created_at)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(space.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="text-sm text-gray-900 max-w-[200px] truncate">
                          {space.address ? space.address.split(',').slice(-2).join(',').trim() : 'No address'}
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">
                            {formatPrice(space.price)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {space.type === 'Rent' ? 'per month' : 'total price'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        {getStatusBadge(space.active)}
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <Badge variant="outline" className="text-xs font-medium border-purple-200 text-purple-700 bg-purple-50">
                          {space.propertyType || 'Co-working'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6 px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/view-listing/${space.id}`} className="cursor-pointer">
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/edit-listing/${space.id}`} className="cursor-pointer">
                                Edit Space
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 cursor-pointer">
                              Delete Space
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CoWorkingSpacePage;