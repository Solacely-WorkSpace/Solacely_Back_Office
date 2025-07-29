"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-12">
        <div className="flex items-center space-x-3">
          <Image 
            src="/icons/Frame 33340.svg" 
            alt="Solacely Logo" 
            width={40} 
            height={40}
            className="w-100 h-100"
          />
       
        </div>
      </div>

      {/* 404 Illustration */}
      <div className="mb-12 relative">
        <Image 
          src="/icons/Illustration 1.png" 
          alt="404 Illustration" 
          width={500} 
          height={400}
          className="w-full max-w-md md:max-w-lg h-auto"
          priority
        />
      </div>

      {/* Content */}
      <div className="text-center mb-8 max-w-md">
        <h2 className="text-3xl md:text-4xl font-bold text-txt mb-4">
          Whoops! You got lost?
        </h2>
        <p className="text-gray-500 mb-2 text-base">
          The page you are looking for isn't here :(
        </p>
        <p className="text-gray-500 text-base">
          We suggest you return home.
        </p>
      </div>

      {/* Back to Home Button */}
      <Link href="/">
        <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium text-base">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}