"use client"
import React, { useState } from 'react';
import Image from 'next/image'
import { useRouter } from "next/navigation";

export default function LoginDetailsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <h1 className="text-sm md:text-sm font-semibold mb-1">Login details</h1>
          <p className="text-xs text-gray-500">Update your password</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row relative w-full">
        {/* Form Section */}
        <div className="w-full md:w-1/3 md:flex-none px-2 md:ml-0">
          <div className="space-y-6">
            {/* Current Password */}
            <div className="md:w-80 space-y-2 w-full">
              <label htmlFor="currentPassword" className="block text-sm text-gray-500">
                Current password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-complementary font-medium px-2 text-sm"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Image 
                    src={showCurrentPassword ? "/icons/UserDashboard/eye-off.svg" : "/icons/UserDashboard/eye.svg"} 
                    width={20} 
                    height={20} 
                    alt={showCurrentPassword ? "Hide password" : "Show password"} 
                  />
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="md:w-80 space-y-2 w-full">
              <label htmlFor="newPassword" className="block text-sm text-gray-500">
                New password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-complementary font-medium px-2 text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <Image 
                    src={showNewPassword ? "/icons/UserDashboard/eye-off.svg" : "/icons/UserDashboard/eye.svg"} 
                    width={20} 
                    height={20} 
                    alt={showNewPassword ? "Hide password" : "Show password"} 
                  />
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="md:w-80 space-y-2 w-full">
              <label htmlFor="confirmPassword" className="block text-sm text-gray-500">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-complementary font-medium px-2 text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Image 
                    src={showConfirmPassword ? "/icons/UserDashboard/eye-off.svg" : "/icons/UserDashboard/eye.svg"} 
                    width={20} 
                    height={20} 
                    alt={showConfirmPassword ? "Hide password" : "Show password"} 
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex space-x-3 w-full">
              <button 
                className="px-5 py-3 bg-complementary hover:bg-complementary/80 text-white rounded-md transition-colors flex-1 md:flex-initial"
              >
                Update Password
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
              <Image src="/icons/UserDashboard/lock.svg" className='w-5 h-5' alt="Login Details" width={24} height={24} />
            </div>
            <h3 className="text-sm font-medium mb-2">Password tips</h3>
            <p className="text-gray-400 text-xs">
              For a strong password, use at least 8 characters, a mix of uppercase and lowercase letters, numbers, and special characters. Avoid using personal information or common words.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}