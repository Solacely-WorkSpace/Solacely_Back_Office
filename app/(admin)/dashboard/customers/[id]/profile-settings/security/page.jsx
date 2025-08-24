"use client"
import React, { useState } from 'react';
import Image from 'next/image'
import { useRouter } from "next/navigation";

export default function SecurityPage() {
  const router = useRouter();
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Mac OS Safari',
      location: 'Abuja',
      lastActive: '20 Oct 2022 at 04:32AM',
      isCurrent: true
    },
    {
      id: 2,
      name: 'iOS 13.0 Safari',
      location: 'Lagos',
      lastActive: '20 Oct 2022 at 04:32AM',
      isCurrent: false
    },
    {
      id: 3,
      name: 'Windows 10 Chrome',
      location: 'Lagos',
      lastActive: '20 Oct 2022 at 04:32AM',
      isCurrent: false
    }
  ]);

  const handleRemoveDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  return (
    <div className="w-full h-full max-w-full overflow-x-hidden px-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 w-full">
        {/* Back button with left arrow in a box */}
        <button 
          onClick={() => router.push(`.`)}
          className="bg-gray-100 rounded-md p-2 flex items-center justify-center h-10 w-10"
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
          <h1 className="text-sm md:text-sm font-semibold mb-1">Security</h1>
          <p className="text-xs text-gray-500">Your last activity and credentials</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Device List */}
        <div className="w-full md:w-2/3">
          {devices.map(device => (
            <div key={device.id} className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-md">
                  {device.name.toLowerCase().includes('mac') || device.name.toLowerCase().includes('ios') ? (
                    <Image src="/icons/UserDashboard/laptop.svg" width={24} height={24} alt="Device" />
                  ) : device.name.toLowerCase().includes('ios') ? (
                    <Image src="/icons/UserDashboard/smartphone.svg" width={24} height={24} alt="Device" />
                  ) : (
                    <Image src="/icons/UserDashboard/monitor.svg" width={24} height={24} alt="Device" />
                  )}
                </div>
                <div>
                  <p className="text-sm">{device.location} · {device.lastActive}</p>
                  <p className="text-sm font-medium">{device.name}</p>
                </div>
              </div>
              {device.isCurrent ? (
                <span className="text-xs text-green-500 bg-green-50 px-3 py-1 rounded-full">Current session</span>
              ) : (
                <button 
                  onClick={() => handleRemoveDevice(device.id)}
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <span className="ml-1">Remove device</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Right Column - Security Credentials */}
        <div className="w-full md:w-1/3 md:ml-auto md:max-w-xs bg-white p-4 rounded-lg">
          <h2 className="text-base font-medium mb-3">Security credentials</h2>
          <p className="text-sm text-gray-500 mb-4">
            There are many things that are important to catalog design. Your images must be sharp and appealing.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex space-x-4">
        <button 
          className="px-5 py-3 bg-[#3DC5A1] hover:bg-[#3DC5A1]/80 text-white rounded-md transition-colors"
        >
          Update Settings
        </button>
        <button 
          className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}