"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChevronDown,
  ChevronRight,
  X,
  Bell,
  LogOut,
  User,
  Menu,
  Home,
  Building2,
  CreditCard,
  UserCheck,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  Logo, UserMgt,
  Logout as LogoutIcon
} from '@/assets/icons';
import { adminAPI } from '@/utils/api/admin';

const spaceItems = [
  { name: 'Apartment', href: '/dashboard/spaces/apartment' },
  { name: "Co-working Space", href: "/dashboard/spaces/co-working-space" },
  { name: 'Real Estate', href: '/dashboard/spaces/realestate', comingSoon: true },
  { name: 'Hotel', href: '/dashboard/spaces/hotel', comingSoon: true },
];

const sidebarItems = [
  { 
    name: 'Customers', 
    href: '/dashboard/customers', // Changed from '/dashboard/users' to '/dashboard/customers'
    icon: '/icons/3 User.svg',
    selectedIcon: '/icons/3 User.svg', // Changed from '/icons/User.svg' to match the unselected icon
  },
  { 
    name: 'Partners', 
    href: '/dashboard/partners', 
    icon: '/icons/Iconly.svg',
    selectedIcon: '/icons/Iconly.svg' // Changed from '/icons/UserDashboard/connect.svg' to match the unselected icon
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
    icon: '/icons/Chat.svg',
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
    href: '/dashboard/users', // Changed this to point to users page for user management
    icon: UserMgt,
    selectedIcon: UserMgt // Changed from '/icons/UserDashboard/security.svg' to match the unselected icon
  },
];

const normalizeActivities = (payload) => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

const formatRelativeTime = (value) => {
  if (!value) {
    return '';
  }

  const target = new Date(value);

  if (Number.isNaN(target.getTime())) {
    return '';
  }

  if (typeof Intl === 'undefined' || typeof Intl.RelativeTimeFormat === 'undefined') {
    return target.toLocaleString();
  }

  const now = new Date();
  const diffSeconds = Math.round((target.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const divisions = [
    { amount: 60, unit: 'second' },
    { amount: 60, unit: 'minute' },
    { amount: 24, unit: 'hour' },
    { amount: 7, unit: 'day' },
    { amount: 4.34524, unit: 'week' },
    { amount: 12, unit: 'month' },
  ];

  let duration = diffSeconds;
  let unit = 'second';

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      break;
    }

    duration /= division.amount;
    unit = division.unit;
  }

  const formatted = rtf.format(Math.round(duration), unit);

  if (formatted === 'in 0 seconds' || formatted === '0 seconds ago') {
    return 'just now';
  }

  return formatted;
};

const getNotificationPresentation = (action = '') => {
  const normalized = action.toLowerCase();

  if (normalized.includes('listing')) {
    return { icon: Building2, color: 'text-blue-600' };
  }

  if (normalized.includes('payment') || normalized.includes('wallet') || normalized.includes('transaction')) {
    return { icon: CreditCard, color: 'text-green-600' };
  }

  if (normalized.includes('verify') || normalized.includes('profile') || normalized.includes('user')) {
    return { icon: UserCheck, color: 'text-purple-600' };
  }

  if (normalized.includes('approved') || normalized.includes('approval')) {
    return { icon: CheckCircle, color: 'text-green-600' };
  }

  return { icon: AlertCircle, color: 'text-gray-500' };
};

const mapActivityToNotification = (activity) => {
  const { icon, color } = getNotificationPresentation(activity?.action || '');
  const message =
    activity?.meta?.description ||
    activity?.meta?.detail ||
    activity?.meta?.message ||
    activity?.user_email ||
    'No additional context provided.';

  return {
    id: activity?.id ?? `${activity?.action}-${activity?.timestamp}`,
    title: activity?.action || 'Activity',
    message,
    time: formatRelativeTime(activity?.timestamp),
    exactTime: activity?.timestamp ? new Date(activity.timestamp).toLocaleString() : '',
    read: Boolean(activity?.read || activity?.is_read),
    icon,
    color,
  };
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [spacesOpen, setSpacesOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);

  const isSpaceActive = spaceItems.some(item => pathname === item.href);

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      setNotificationsLoading(true);
      setNotificationsError(null);

      try {
        const response = await adminAPI.getUserActivities({ limit: 10 });
        const activities = normalizeActivities(response).map(mapActivityToNotification);

        if (isMounted) {
          setNotifications(activities);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        if (isMounted) {
          setNotifications([]);
          setNotificationsError('Unable to load notifications right now.');
        }
      } finally {
        if (isMounted) {
          setNotificationsLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter(notification => !notification.read).length,
    [notifications]
  );

  // Close spaces dropdown when navigating to other pages
  const handleNavClick = () => {
    setSpacesOpen(false);
    setActiveItem(null);
  };

  // Handle spaces click
  const handleSpacesClick = () => {
    setActiveItem('spaces');
    setSpacesOpen(!spacesOpen);
  };

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 bg-white">
          <Link href="/" className="flex items-center ">
            <Image
              src={Logo}
              alt="Solacely Logo"
              width={32}
              height={32}
              className="w-30"
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
            onClick={handleNavClick}
            className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
              pathname === '/dashboard' && activeItem !== 'spaces'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
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
                onClick={handleSpacesClick}
                className={`flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  spacesOpen || isSpaceActive || activeItem === 'spaces'
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <Image
                    src="/icons/Iconly-2.svg"
                    alt="Spaces"
                    width={20}
                    height={20}
                    className="mr-3 w-6 h-6"
                  />
                  Spaces
                </div>
                {spacesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <Image
                    src="/Iconly.png"
                    alt="Expand"
                    width={16}
                    height={16}
                    className="h-4 w-4 transition-transform duration-200"
                  />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-6 mt-1 space-y-1">
              {spaceItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  {item.comingSoon ? (
                    <div className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg text-gray-400 cursor-not-allowed">
                      <span>{item.name}</span>
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full text-white" 
                        style={{ backgroundColor: '#3DC5A1' }}
                      >
                       Soon
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors w-full ${
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-gray-400 hover:text-primary'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Other Sidebar Items */}
          {sidebarItems.map((item) => {
            // Check if we're in a profile settings page and this is the Customers item
            const isProfileSettings = pathname.includes('/dashboard/customers/') && pathname.includes('/profile-settings');
            const isCustomersItem = item.name === 'Customers';
            const isActive = (pathname === item.href && activeItem !== 'spaces') || 
                          (isProfileSettings && isCustomersItem);
            const iconSrc = isActive ? item.selectedIcon : item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center px-3 py-5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Image
                  src={iconSrc}
                  alt={item.name}
                  width={20}
                  height={20}
                  className={`mr-3 w-5 h-5 transition-all duration-200 ${
                    isActive ? 'brightness-0 invert' : ''
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className=" ">
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
                  Hi {user?.full_name?.split(' ')[0] || 'Admin'}
                </h2>
                <span className="text-sm text-gray-500">Welcome back</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative hover:bg-gray-50">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs text-gray-500">{unreadCount} unread</span>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-y-auto">
                    {notificationsLoading ? (
                      <div className="space-y-3 p-4">
                        {[0, 1, 2].map((item) => (
                          <div
                            key={`notifications-skeleton-${item}`}
                            className="h-16 rounded-lg bg-gray-100 animate-pulse"
                          />
                        ))}
                      </div>
                    ) : notificationsError ? (
                      <div className="p-4 text-center text-sm text-red-600">
                        {notificationsError}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const IconComponent = notification.icon;

                        return (
                          <DropdownMenuItem
                            key={notification.id}
                            className={`p-3 cursor-pointer hover:bg-gray-50 ${
                              !notification.read
                                ? 'bg-blue-50 border-l-2 border-l-blue-500'
                                : ''
                            }`}
                          >
                            <div className="flex w-full items-start space-x-3">
                              <div
                                className={`p-2 rounded-full bg-gray-100 ${notification.color}`}
                              >
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p
                                    className={`text-sm font-medium text-gray-900 ${
                                      !notification.read ? 'font-semibold' : ''
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                                  )}
                                </div>
                                <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                  {notification.time || notification.exactTime}
                                </p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        );
                      })
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-3 text-center text-sm text-gray-600 hover:bg-gray-50">
                    <div className="w-full text-center">
                      View all notifications
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>{user?.full_name?.charAt(0) || 'A'}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.full_name?.split(' ').map((name, index, arr) => 
                          index === 0 ? name : (index === arr.length - 1 ? ` ${name.charAt(0)}` : '')
                        ).join('') || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
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
                    <button 
                      onClick={logout} 
                      className="flex items-center w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
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