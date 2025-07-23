"use client";
import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useClerk } from '@clerk/nextjs';

// Import assets
import { LogoName } from '@/assets/images';
import { 
  Dashboard, DashboardSelected,
  Heart as HeartIcon, HeartSelected,
  Wallet, WalletSelected,
  Setting, SettingSelected,
  Logo,
  Logout
} from '@/assets/icons';

function Sidebar({ sidebarOpen, setSidebarOpen, activeView, setActiveView }) {
  const { signOut } = useClerk();
  const pathname = usePathname();

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      key: "dashboard",
      icon: Dashboard,
      selectedIcon: DashboardSelected
    },
    {
      name: "Wishlist",
      key: "wishlist",
      icon: HeartIcon,
      selectedIcon: HeartSelected
    },
    {
      name: "Wallet",
      key: "wallet",
      icon: Wallet,
      selectedIcon: WalletSelected
    },
    {
      name: "Profile Settings",
      key: "settings",
      icon: Setting,
      selectedIcon: SettingSelected
    }
  ];

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  const handleViewChange = (viewKey) => {
    setActiveView(viewKey);
    handleLinkClick();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col bg-white border-r border-gray-200 w-[250px] fixed h-full">
        <div className="p-6 mt-5 flex justify-start items-center">
          <div className="flex items-center gap-3">
            <Image
              src={Logo}
              alt="logo"
              width={40}
              height={40}
              className="w-8 h-8"
            />
            <Image
              src={LogoName}
              alt="logo"
              width={120}
              height={30}
              className="h-7 w-auto"
            />
          </div>
        </div>

        <nav className="mt-8 flex-1 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleViewChange(item.key)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-md transition-colors ${
                    activeView === item.key ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Image
                    src={activeView === item.key ? item.selectedIcon : item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
            
            {/* Sign Out Button */}
            <li>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-md transition-colors text-red-600 hover:bg-red-50"
              >
                <Image
                  src={Logout}
                  alt="Logout"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-3">
            <Image
              src={Logo}
              alt="logo"
              width={40}
              height={40}
              className="w-8 h-8"
            />
            <Image
              src={LogoName}
              alt="logo"
              width={120}
              height={30}
              className="h-6 w-auto"
            />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleViewChange(item.key)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-md transition-colors ${
                    activeView === item.key ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Image
                    src={activeView === item.key ? item.selectedIcon : item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
            
            {/* Sign Out Button */}
            <li>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-md transition-colors text-red-600 hover:bg-red-50"
              >
                <Image
                  src={Logout}
                  alt="Logout"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;