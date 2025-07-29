"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Star, 
  Reply, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Flag
} from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data for comments
  const dummyComments = [
    {
      id: 1,
      user: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        avatar: '/images/UserDashboard/user1.jpg'
      },
      property: {
        title: 'Luxury Apartment in Victoria Island',
        id: 'PROP001'
      },
      rating: 5,
      comment: 'Amazing property with great amenities. The location is perfect and the management is very responsive.',
      status: 'approved',
      createdAt: '2024-01-15T10:30:00Z',
      replies: 2
    },
    {
      id: 2,
      user: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        avatar: '/images/UserDashboard/user2.jpg'
      },
      property: {
        title: 'Modern Co-working Space in Lekki',
        id: 'PROP002'
      },
      rating: 4,
      comment: 'Great workspace with excellent facilities. Could use better parking options.',
      status: 'pending',
      createdAt: '2024-01-14T15:45:00Z',
      replies: 0
    },
    {
      id: 3,
      user: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        avatar: '/images/UserDashboard/user3.jpg'
      },
      property: {
        title: 'Studio Apartment in Ikeja',
        id: 'PROP003'
      },
      rating: 3,
      comment: 'Decent place but needs some maintenance. The rent is reasonable for the area.',
      status: 'flagged',
      createdAt: '2024-01-13T09:20:00Z',
      replies: 1
    },
    {
      id: 4,
      user: {
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        avatar: '/images/UserDashboard/user4.jpg'
      },
      property: {
        title: 'Executive Office Space in VI',
        id: 'PROP004'
      },
      rating: 5,
      comment: 'Exceptional service and beautiful office space. Highly recommend for businesses.',
      status: 'approved',
      createdAt: '2024-01-12T14:10:00Z',
      replies: 3
    },
    {
      id: 5,
      user: {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        avatar: '/images/UserDashboard/user5.jpg'
      },
      property: {
        title: 'Shared Apartment in Surulere',
        id: 'PROP005'
      },
      rating: 2,
      comment: 'Not satisfied with the condition of the property. Several issues need to be addressed.',
      status: 'pending',
      createdAt: '2024-01-11T11:30:00Z',
      replies: 0
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComments(dummyComments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      flagged: { color: 'bg-red-100 text-red-800', label: 'Flagged' },
      rejected: { color: 'bg-gray-100 text-gray-800', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={`${config.color} border-0 px-2 py-1 text-xs font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`h-3.5 w-3.5 ${
              index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || comment.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComments = filteredComments.slice(startIndex, startIndex + itemsPerPage);

  const commentStats = {
    total: comments.length,
    approved: comments.filter(c => c.status === 'approved').length,
    pending: comments.filter(c => c.status === 'pending').length,
    flagged: comments.filter(c => c.status === 'flagged').length,
    averageRating: comments.length > 0 ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1) : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Comments & Reviews</h1>
                <p className="text-gray-600 mt-1">Manage user feedback and property reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Total Comments</p>
                  <p className="text-2xl font-bold text-gray-900">{commentStats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold" style={{ color: '#3DC5A1' }}>{commentStats.approved}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#3DC5A1', opacity: 0.1 }}>
                  <Eye className="h-5 w-5" style={{ color: '#3DC5A1' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{commentStats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Filter className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Flagged</p>
                  <p className="text-2xl font-bold text-red-600">{commentStats.flagged}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Flag className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{commentStats.averageRating}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search comments, users, or properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-10">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-10">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Comments & Reviews</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">User</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Property</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Rating</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Comment</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Replies</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedComments.map((comment, index) => (
                    <TableRow key={comment.id} className={`border-gray-200 hover:bg-gray-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={comment.user.avatar} />
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-medium">
                              {comment.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                            <p className="text-xs text-gray-500">{comment.user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={comment.property.title}>
                            {comment.property.title}
                          </p>
                          <p className="text-xs text-gray-500">ID: {comment.property.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {getRatingStars(comment.rating)}
                          <span className="text-sm text-gray-600 font-medium">({comment.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <p className="text-sm text-gray-900 max-w-[250px] line-clamp-2 leading-relaxed" title={comment.comment}>
                          {comment.comment}
                        </p>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {getStatusBadge(comment.status)}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <p className="text-sm text-gray-600">{formatDate(comment.createdAt)}</p>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-1.5">
                          <Reply className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 font-medium">{comment.replies}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Reply className="mr-2 h-4 w-4" />
                              Reply
                            </DropdownMenuItem>
                            {comment.status === 'pending' && (
                              <DropdownMenuItem className="cursor-pointer">
                                <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                                Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="cursor-pointer">
                              <Flag className="mr-2 h-4 w-4" />
                              Flag
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/30">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredComments.length)}</span> of{' '}
                  <span className="font-medium">{filteredComments.length}</span> comments
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-9 px-3"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-9 px-3"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}