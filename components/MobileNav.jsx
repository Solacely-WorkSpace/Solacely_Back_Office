"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import { HamburgerSVG } from "@/assets/SVGAssets";
import { ChevronDown } from "lucide-react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState('/rent');

  // Check if user is admin and set appropriate dashboard URL
  useEffect(() => {
    if (isSignedIn && user) {
      const userMetadata = user.publicMetadata;
      const adminStatus = userMetadata.role === 'admin';
      setIsAdmin(adminStatus);
      setDashboardUrl(adminStatus ? '/dashboard' : '/rent');
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      // Delay removing from DOM until animation completes
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 1500); // Match this to the animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Hamburger button */}
      <button 
        onClick={toggleMenu} 
        className="bg-transparent cursor-pointer md:hidden shadow-none px-0"
        aria-label="Toggle mobile menu"
      >
        <HamburgerSVG />
      </button>

      {/* Overlay menu */}
      {isRendered && (
        <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-1500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 transition-opacity duration-1500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={toggleMenu}
          />
          
          {/* Menu panel */}
          <div className={`relative w-1/2 max-w-xs bg-white h-fit overflow-y-auto rounded-l-xl shadow-sm transform transition-transform duration-1500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Close button */}
            <button 
              onClick={toggleMenu}
              className="absolute top-4 right-4 p-2"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Menu items */}
            <div className="pt-16 px-6 pb-8">
              <ul className="flex flex-col space-y-4">
                <li className="py-1">
                  <div className="flex flex-col">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-primary hover:text-white transition-colors"
                    >
                      <span>Spaces</span>
                      <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                      <div className="mt-2 w-full bg-white rounded-lg shadow-sm py-1 border border-gray-100">
                        <Link
                          href="#"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Apartment
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Co-living
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Pair with Me
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Real Estate
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
                <li className="py-1">
                  <Link href="#" className="block text-sm font-medium rounded-md p-2 hover:bg-primary hover:text-white transition-colors">Become a Partner</Link>
                </li>
                <li className="py-1">
                  {isSignedIn ? (
                    <Link 
                      href={dashboardUrl} 
                      className="block text-sm font-medium rounded-md p-2 hover:bg-primary hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link 
                      href="/sign-up" 
                      className="block text-sm font-medium rounded-md p-2 hover:bg-primary hover:text-white transition-colors"
                    >
                      Get Started
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
