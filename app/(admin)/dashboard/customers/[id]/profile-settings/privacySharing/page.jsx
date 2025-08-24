"use client"
import React, { useState } from 'react';
import Image from 'next/image'
import { useRouter } from "next/navigation";

export default function PrivacySharingPage() {
  const router = useRouter();
  const [socialAccounts, setSocialAccounts] = useState({
    facebook: true,
    twitter: false
  });
  
  return (
    <div className="w-full h-full max-w-full overflow-x-hidden">
      <div className="flex items-center gap-2 mb-6 px-2 w-full">
        {/* Back button with left arrow in a box */}
        <button 
          onClick={() => router.push(`.`)} 
          className="bg-gray-100 rounded-md p-2 flex items-center justify-center h-10 w-10 mr-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-sm md:text-sm font-semibold mb-1">Privacy</h1>
          <p className="text-xs text-gray-500">Connected apps and services</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row relative w-full">
        {/* Form Section */}
        <div className="w-full md:w-1/3 md:flex-none px-2 md:ml-0">
          <div className="space-y-8">
            {/* Connected Social Accounts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Image src="/icons/UserDashboard/facebook.svg" width={24} height={24} alt="Facebook" />
                  <span className="text-sm">Facebook</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Connected</span>
                  <button 
                    onClick={() => {}}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Image src="/icons/UserDashboard/twitter.svg" width={24} height={24} alt="Twitter" />
                  <span className="text-sm">Twitter</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Not connected</span>
                  <button 
                    onClick={() => {}}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex space-x-3 w-full">
              <button 
                className="px-5 py-3 bg-[#3DC5A1] hover:bg-[#3DC5A1]/80 text-white rounded-md transition-colors flex-1 md:flex-initial"
              >
                Update Settings
              </button>
              <button 
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex-1 md:flex-initial"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Setup profiles section - on the right side */}
        <div className="md:w-80 lg:absolute lg:right-10">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4 p-3 bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-sm font-medium mb-2">Setup profiles</h3>
            <p className="text-gray-400 text-xs">
              The following ads on creating a direct mail advertising campaign have been direct-tested and will bring you higher returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}