"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

function DashboardHeader({ user, toggleSidebar }) {
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="bg-white shadow-md"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pt-12 md:pt-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Hi {user?.firstName || 'User'},
          </h1>
          <p className="text-gray-600">Welcome back!</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden md:block">{user?.firstName} {user?.lastName}</span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;