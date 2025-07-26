"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';

const Nav = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Left-paw.png"
              alt="Solacely"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-gray-900">Solacely</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition duration-200">
              Home
            </Link>
            <Link href="/rent" className="text-gray-700 hover:text-purple-600 transition duration-200">
              Browse Properties
            </Link>
            {isAuthenticated && (
              <Link href="/add-new-listing" className="text-gray-700 hover:text-purple-600 transition duration-200">
                List Property
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition duration-200"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.first_name || 'User'}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/user"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {(user?.is_staff || user?.is_superuser) && (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 transition duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/rent"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Properties
              </Link>
              {isAuthenticated && (
                <Link
                  href="/add-new-listing"
                  className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  List Property
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link
                    href="/user"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {(user?.is_staff || user?.is_superuser) && (
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;