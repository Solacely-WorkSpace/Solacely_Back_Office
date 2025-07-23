"use client";
import React, { useState } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { 
  ChevronDown,
  ChevronRight,
  X,
  Bell,
  LogOut,
  User,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Import proper icons and logo
import { LogoName } from '@/assets/images';
import { 
  Dashboard, DashboardSelected,
  Wallet, WalletSelected,
  Setting, SettingSelected,
  Logo,
  Logout as LogoutIcon
} from '@/assets/icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const spaceItems = [
  { name: 'Apartment', href: '/dashboard/spaces/apartment' },
  { name: 'Coliving', href: '/dashboard/spaces/coliving' },
  { name: 'Real Estate', href: '/dashboard/spaces/realestate' },
  { name: 'Hotel', href: '/dashboard/spaces/hotel' },
];

const sidebarItems = [
  { 
    name: 'Customers', 
    href: '/dashboard/users', 
    icon: '/icons/UserDashboard/user.svg',
    selectedIcon: '/icons/UserDashboard/user.svg'
  },
  { 
    name: 'Partners', 
    href: '/dashboard/partners', 
    icon: '/icons/UserDashboard/connect.svg',
    selectedIcon: '/icons/UserDashboard/connect.svg'
  },
  { 
    name: 'Wallet', 
    href: '/dashboard/wallet', 
    icon: Wallet,
    selectedIcon: WalletSelected
  },
  { 
    name: 'Comments', 
    href: '/dashboard/comments', 
    icon: '/icons/UserDashboard/notification.svg',
    selectedIcon: '/icons/UserDashboard/notification.svg'
  },
  { 
    name: 'Account', 
    href: '/dashboard/account', 
    icon: Setting,
    selectedIcon: SettingSelected
  },
  { 
    name: 'User Mgt', 
    href: '/dashboard/logs', 
    icon: '/icons/UserDashboard/security.svg',
    selectedIcon: '/icons/UserDashboard/security.svg'
  },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [spacesOpen, setSpacesOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const isSpaceActive = spaceItems.some(item => pathname === item.href);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={Logo}
              alt="Solacely Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <Image
              src={LogoName}
              alt="Solacely"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6 px-3 space-y-1">
          {/* Dashboard Item */}
          <Link
            href="/dashboard"
            className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
              pathname === '/dashboard'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Image
              src={pathname === '/dashboard' ? DashboardSelected : Dashboard}
              alt="Dashboard"
              width={20}
              height={20}
              className="mr-3 w-5 h-5"
            />
            Dashboard
          </Link>

          {/* Spaces Dropdown */}
          <Collapsible open={spacesOpen} onOpenChange={setSpacesOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={`flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isSpaceActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <Image
                    src="/icons/UserDashboard/home.png"
                    alt="Spaces"
                    width={20}
                    height={20}
                    className="mr-3 w-5 h-5"
                  />
                  Spaces
                </div>
                {spacesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-6 mt-1 space-y-1">
              {spaceItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Other Sidebar Items */}
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const iconSrc = isActive ? item.selectedIcon : item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Image
                  src={iconSrc}
                  alt={item.name}
                  width={20}
                  height={20}
                  className="mr-3 w-5 h-5"
                />
                {item.name}
              </Link>
            );
          })}
          
          {/* Sign Out Button */}
          <SignOutButton>
            <button className="flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <Image
                src={LogoutIcon}
                alt="Sign Out"
                width={20}
                height={20}
                className="mr-3 w-5 h-5"
              />
              Sign Out
            </button>
          </SignOutButton>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              {/* Updated Welcome Message Format */}
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900">
                  Hi {user?.firstName || 'Admin'}
                </h2>
                <span className="text-sm text-gray-500">Welcome back</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>{user?.firstName?.charAt(0) || 'A'}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/account" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center">
                      <Image
                        src="/icons/UserDashboard/home.png"
                        alt="Home"
                        width={16}
                        height={16}
                        className="mr-2 w-4 h-4"
                      />
                      <span>Home</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    <SignOutButton>
                      <div className="flex items-center w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </div>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}