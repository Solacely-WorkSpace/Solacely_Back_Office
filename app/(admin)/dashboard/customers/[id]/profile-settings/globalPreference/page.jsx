"use client"
import React, { useState } from 'react';
import Image from 'next/image'
import { useRouter } from "next/navigation";

export default function GlobalPreferences() {
  const router = useRouter();
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('Nigerian Naira');
  const [timeZone, setTimeZone] = useState('(GMT+01:00) West African Time');
  const [country, setCountry] = useState('Nigeria');

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
          <h1 className="text-sm md:text-sm font-semibold mb-1">Global preferences</h1>
          <p className="text-xs text-gray-500">Add a payment history and method</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row relative w-full">
        {/* Form Section */}
        <div className="w-full md:w-1/3 md:flex-none px-2 md:ml-0">
         
          <div className="space-y-6">
            {/* Preferred Language */}
            <div className="md:w-80 space-y-2 w-full">
              <label htmlFor="language" className="block text-sm text-gray-500">
                Preferred language
              </label>
              <select
                id="language"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-complementary font-medium px-2 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>

            {/* Preferred Currency */}
            <div className="md:w-80 w-full">
              <label className="block text-sm text-gray-500">
                Preferred currency
              </label>
              <div className="flex items-center text-sm justify-between w-full py-2 border-b font-medium border-gray-300">
                <span className="text-sm">{currency}</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <div className="flex items-center">
                    <Image src="/icons/UserDashboard/edit.svg" width={24} height={24} alt="Edit" />
                    <span className="ml-1 text-sm">Edit</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Time Zone */}
            <div className="md:w-80 space-y-2 w-full">
              <label className="block text-sm text-gray-500">
                Time zone
              </label>
              <div className="flex items-center text-sm justify-between w-full py-2 border-b font-medium border-gray-300">
                <span className="text-sm">{timeZone}</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <div className="flex items-center gap-2">
                    <Image src="/icons/UserDashboard/edit.svg" width={24} height={24} alt="Edit" />
                    <span className="ml-1 text-sm">Edit</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Primary Country */}
            <div className="space-y-2 md:w-80 w-full">
              <label className="block text-sm text-gray-500">
                Primary country
              </label>
              <div className="flex items-center text-sm justify-between w-full py-2 border-b font-medium border-gray-300">
                <span className="text-sm">{country}</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <div className="flex items-center gap-2">
                    <Image src="/icons/UserDashboard/edit.svg" width={24} height={24} alt="Edit" />
                    <span className="ml-1 text-sm">Edit</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex space-x-3 w-full">
              <button 
                className="px-5 py-3 bg-complementary hover:bg-complementary/80 text-white rounded-md transition-colors flex-1 md:flex-initial"
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

        {/* Info Section - Only visible on desktop */}
        <div className="hidden md:block md:w-80 lg:absolute lg:right-10">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4 p-3 bg-gray-200 rounded-lg w-10 h-10">
              <Image src="/icons/UserDashboard/preference.svg" className='w-5 h-5' alt="Notifications" width={24} height={24} />
            </div>
            <h3 className="text-sm font-medium mb-2">Your global preferences</h3>
            <p className="text-gray-400 text-xs">
            How you view prices is updated when you change your currency. In your options for payments and payouts, you can modify how you receive funds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}