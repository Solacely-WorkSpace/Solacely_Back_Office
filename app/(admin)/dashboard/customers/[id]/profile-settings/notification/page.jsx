"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function NotificationPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    messages: {
      email: true,
      mobile: false,
      browser: false
    },
    promotions: {
      email: true,
      mobile: false,
      browser: false
    },
    reminders: {
      email: true,
      mobile: false,
      browser: false
    }
  });

  const handleToggle = (category, type) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
  };

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
          <h1 className="text-sm md:text-sm font-semibold mb-1">Notifications</h1>
          <p className="text-xs text-gray-500">Set your email notifications</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row relative w-full">
        {/* Form Section */}
        <div className="w-full md:w-1/3 md:flex-none px-2 md:ml-0">
          <div className="space-y-8">
            {/* Messages Section */}
            <div>
              <h2 className="text-sm font-semibold mb-4">Messages</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm">Recevice notifications via email</span>
                    <button 
                      onClick={() => handleToggle('messages', 'email')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${notifications.messages.email ? 'bg-[#3DC5A1] justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm"></span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Mobile phone</p>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm">Recevice notifications via mobile phone</span>
                    <button 
                      onClick={() => handleToggle('messages', 'mobile')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${notifications.messages.mobile ? 'bg-[#3DC5A1] justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm"></span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Browser notifications</p>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm">Recevice notifications from your browser</span>
                    <button 
                      onClick={() => handleToggle('messages', 'browser')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${notifications.messages.browser ? 'bg-[#3DC5A1] justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotions Section */}
            <div>
              <h2 className="text-sm font-semibold mb-4">Promotions</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm">Recevice notifications via email</span>
                    <button 
                      onClick={() => handleToggle('promotions', 'email')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${notifications.promotions.email ? 'bg-[#3DC5A1] justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm"></span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Mobile phone</p>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm">Recevice notifications via mobile phone</span>
                    <button 
                      onClick={() => handleToggle('promotions', 'mobile')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${notifications.promotions.mobile ? 'bg-[#3DC5A1] justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm"></span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Browser notifications</p>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm">Recevice notifications from your browser</span>
                    <button 
                      onClick={() => handleToggle('promotions', 'browser')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${notifications.promotions.browser ? 'bg-[#3DC5A1] justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reminders Section */}
            <div>
              <h2 className="text-sm font-semibold mb-4">Reminders</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm">Recevice notifications via email</span>
                    <button 
                      onClick={() => handleToggle('reminders', 'email')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${notifications.reminders.email ? 'bg-[#3DC5A1] justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm"></span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Mobile phone</p>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm">Recevice notifications via mobile phone</span>
                    <button 
                      onClick={() => handleToggle('reminders', 'mobile')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${notifications.reminders.mobile ? 'bg-[#3DC5A1] justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm"></span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Browser notifications</p>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm">Recevice notifications from your browser</span>
                    <button 
                      onClick={() => handleToggle('reminders', 'browser')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${notifications.reminders.browser ? 'bg-[#3DC5A1] justify-end' : 'bg-gray-300 justify-start'}`}
                    >
                      <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm"></span>
                    </button>
                  </div>
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

        {/* Updates and alerts section - Right side */}
        <div className="md:w-80 lg:absolute lg:right-10">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4 p-3 bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 className="text-sm font-medium mb-2">Updates and alerts</h3>
            <p className="text-gray-400 text-xs">
              Advertising is telling the world how great you are, while publicity is having others tell the world how great you are.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}