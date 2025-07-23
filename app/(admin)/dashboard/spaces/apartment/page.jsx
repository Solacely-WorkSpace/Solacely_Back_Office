"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

function ApartmentPage() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchApartments();
    // Set up real-time subscription
    const subscription = supabase
      .channel('apartments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'listing' },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchApartments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [filterType, filterStatus, filterLocation, sortBy, sortOrder]);

  const fetchApartments = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from("listing")
        .select(`*, listingimages(url, listing_id)`);
    
    // Apply simple filters like the recent listings component
    if (filterStatus === "active") {
      query = query.eq("active", true);
    } else if (filterStatus === "inactive") {
      query = query.eq("active", false);
    }

    if (filterType && filterType !== "all") {
      query = query.eq("type", filterType);
    }

    if (filterLocation && filterLocation !== "all") {
      query = query.ilike("address", `%${filterLocation}%`);
    }

    const { data, error } = await query.order(sortBy, {
      ascending: sortOrder === "asc",
    });

    if (error) {
      console.error('Error fetching apartments:', error);
      setLoading(false);
      return;
    }

    if (data) {
      let filteredData = data;
      
      // Apply search filter
      if (searchTerm) {
        filteredData = data.filter(
          (apartment) =>
            apartment.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apartment.price?.toString().includes(searchTerm) ||
            (apartment.propertyType && apartment.propertyType.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      console.log('Fetched listings:', filteredData); // Debug log
      setApartments(filteredData);
    }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
    
    setLoading(false);
  };

  const handleSearch = () => {
    fetchApartments();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (active) => {
    return active ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Closed</Badge>
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Apartment</h1>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/api/placeholder/24/24" />
              <AvatarFallback className="text-xs">AK</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">Alexia K.</span>
          </div>
        </div>
        <Button className="bg-[#521282] hover:bg-[#521282]/90 text-white">
          <span className="mr-2">+</span>
          Add new
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for Apartment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
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
                        <div className="relative h-10 w-10 rounded-md overflow-hidden">
                          <Image
                            src={apartment?.listingimages?.[0]?.url || "/images/apartment-placeholder.jpg"}
                            alt={apartment.address}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {apartment.propertyType || 'Property'} - {apartment.bedroom || 0} Bedroom
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
                        {apartment.address.split(',').slice(-2).join(',').trim()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
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
                      <Badge variant="outline" className="text-xs">
                        {apartment.propertyType || 'Property'}
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