"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Calendar, User, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';

function CommentDetailPage({ params }) {
  const [reply, setReply] = useState('');
  const router = useRouter();
  
  // Sample comment data
  const comment = {
    id: params.id,
    content: 'I had excellent service from Green Reality. Thank you very much for your very pro-active help and support in achieving our purchase our apartment. Best regard and hope to work with you again very soon.',
    date: '29 Jan 2022, 08:00 AM',
    recipient: 'Benjamin Onyebuchi',
    email: 'benbyxhub@gmail.com',
    inResponseTo: 'Home in Coral Gables',
    propertyType: 'Apartment Building'
  };

  const handleBack = () => {
    router.back();
  };

  const handleUpdate = () => {
    // Handle reply update
    console.log('Reply updated:', reply);
  };

  const handleTrash = () => {
    // Handle delete comment
    console.log('Comment deleted');
  };

  const handleApprove = () => {
    // Handle approve comment
    console.log('Comment approved');
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="p-2 hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">Comment</h1>
      </div>
      
      {/* Comment Content Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Content Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">CONTENT</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {comment.content}
            </p>
          </div>
          
          {/* Reply Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">REPLY</h3>
            <Textarea 
              placeholder="Enter response"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="min-h-[100px] text-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleUpdate}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 text-sm"
              >
                Update
              </Button>
            </div>
          </div>
          
          {/* Comment Details */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Date */}
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Date</span>
                <span className="text-sm font-medium text-gray-900">{comment.date}</span>
              </div>
            </div>
            
            {/* Recipient */}
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Recipient</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{comment.recipient}</span>
                  <span className="text-xs text-gray-500">{comment.email}</span>
                </div>
              </div>
            </div>
            
            {/* In Response To */}
            <div className="flex items-center space-x-3">
              <Building className="w-4 h-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wide">In response to</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{comment.inResponseTo}</span>
                  <span className="text-xs text-gray-500">{comment.propertyType}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 pt-6">
            <Button 
              variant="outline"
              onClick={handleTrash}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-8 py-2"
            >
              Trash
            </Button>
            <Button 
              onClick={handleApprove}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2"
            >
              Approve
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CommentDetailPage;