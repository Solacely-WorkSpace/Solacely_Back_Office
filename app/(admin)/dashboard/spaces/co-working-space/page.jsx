"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { Search, ArrowUpDown, MoreHorizontal, Plus } from 'lucide-react';
import { listingsAPI } from '@/utils/api/listings';

function CoWorkingSpacePage() {
  const [coWorkingSpaces, setCoWorkingSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchCoWorkingSpaces();
  }, [searchTerm, statusFilter, locationFilter, dateFilter, sortBy, sortOrder]);

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

  return (
    <div className="flex-1 p-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Co-working Space</h1>
        <Button className="bg-[#521282] hover:bg-[#521282]/90 text-white h-12 px-6 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add workspace
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search for co-working space..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg w-full"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 min-w-fit">Location</span>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-32 h-10 border-gray-200">
              <SelectValue placeholder="Lagos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Lagos">Lagos</SelectItem>
              <SelectItem value="Abuja">Abuja</SelectItem>
              <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 min-w-fit">Date</span>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40 h-10 border-gray-200">
              <SelectValue placeholder="Past 30 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7">Past 7 Days</SelectItem>
              <SelectItem value="30">Past 30 Days</SelectItem>
              <SelectItem value="90">Past 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 min-w-fit">Status</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-10 border-gray-200">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/50">
              <TableHead 
                className="cursor-pointer hover:bg-gray-100/50 transition-colors py-4 px-6 text-left"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  Date
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100/50 transition-colors py-4 px-6 text-left"
                onClick={() => handleSort('propertyType')}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  Title/Workspace Types
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100/50 transition-colors py-4 px-6 text-left"
                onClick={() => handleSort('address')}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  Location
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100/50 transition-colors py-4 px-6 text-left"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  Membership Plans
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100/50 transition-colors py-4 px-6 text-left"
                onClick={() => handleSort('capacity')}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  Maximum Capacity
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                </div>
              </TableHead>
              <TableHead className="py-4 px-6 font-semibold text-gray-900 text-left">Status</TableHead>
              <TableHead className="w-[80px] py-4 px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index} className="border-b border-gray-100">
                  <TableCell className="py-6 px-6">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : coWorkingSpaces.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-lg font-medium text-gray-900">No co-working spaces found</p>
                    <p className="text-gray-500">Try adjusting your search criteria or add a new space</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Sample data row to match the design
              <TableRow className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <TableCell className="py-6 px-6 align-top">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      Jan 29, 2022
                    </div>
                    <div className="text-xs text-gray-500">
                      at 08:00 PM
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-6 px-6 align-top">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src="/images/coworking-placeholder.jpg"
                        alt="989 workspace"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-gray-900 text-sm">
                        989 workspace
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-6 px-6 align-top">
                  <div className="text-sm text-gray-900">
                    Lagos
                  </div>
                </TableCell>
                <TableCell className="py-6 px-6 align-top">
                  <div className="text-sm text-gray-900">
                    3
                  </div>
                </TableCell>
                <TableCell className="py-6 px-6 align-top">
                  <div className="text-sm font-medium text-gray-900">
                    50
                  </div>
                </TableCell>
                <TableCell className="py-6 px-6 align-top">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium">
                    Open
                  </Badge>
                </TableCell>
                <TableCell className="py-6 px-6 align-top">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Edit Space
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete Space
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CoWorkingSpacePage;