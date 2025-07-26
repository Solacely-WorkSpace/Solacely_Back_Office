"use client"
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import AiPopuop from "../components/AiPopuop";
import { HeroIllustration, MetaImage } from '@/assets/images'

const Hero = () => {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState('/user');

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user is admin based on user role from Django backend
      const userIsAdmin = user.is_staff || user.is_superuser || user.role === 'admin';
      setIsAdmin(userIsAdmin);
      setDashboardUrl(userIsAdmin ? '/dashboard' : '/user');
    }
  }, [isAuthenticated, user]);

  return (
    <div className="flex items-center flex-col justify-center px-6 md:px-10 lg:px-32 h-[600px] bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Find Your Perfect <span className="text-purple-600">Home</span> with Solacely
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover amazing rental properties, connect with trusted landlords, and find your ideal living space with our AI-powered recommendations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <>
              <Link href={dashboardUrl}>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 shadow-lg">
                  Go to Dashboard
                </button>
              </Link>
              <Link href="/add-new-listing">
                <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition duration-200">
                  List Your Property
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-up">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 shadow-lg">
                  Get Started
                </button>
              </Link>
              <Link href="/rent">
                <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition duration-200">
                  Browse Properties
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-12">
        <Image
          src={HeroIllustration}
          alt="Hero Illustration"
          width={500}
          height={300}
          className="mx-auto"
        />
      </div>
      
      <AiPopuop />
    </div>
  );
};

export default Hero;