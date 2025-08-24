"use client";
import Image from "next/image";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usersAPI } from "../../../../../../utils/api/users";
import AccountInformation from "./accountInfo/page";
import PrivacySharing from "./privacySharing/page";
import LoginDetails from "./loginDetails/page";
import Security from "./security/page";
import Notification from "./notification/page";
import GlobalPreference from "./globalPreference/page";

export default function ProfileManager() {
  const params = useParams();
  const router = useRouter();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showLoginDetails, setShowLoginDetails] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showGlobalPreference, setShowGlobalPreference] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await usersAPI.getUser(params.id);
        console.log("API Response:", response); // Add this to debug
        if (response) {
          setCustomerData(response);
          console.log("Customer Data Set:", response); // Add this to debug
        } else {
          console.error("No data in response");
          setError("No data in API response");
        }
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-8">
        {/* Skeleton for profile settings */}
        <div className="flex flex-col space-y-6">
          {/* Skeleton for header */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Skeleton for grid items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-xl animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!customerData) {
    return <div className="p-8 text-center">No customer data found</div>;
  }

  // Use customer data or fallback to defaults
  const customerName =
    customerData?.full_name || customerData?.username || "Customer Name";
  const customerEmail = customerData?.email || "customer@example.com";
  const customerAvatar = customerData?.profile_image || "/images/Avatar.png";

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!customerData?.full_name) return "CN";

    const nameParts = customerData.full_name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${
        nameParts[nameParts.length - 1][0]
      }`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  const handleAccountInfo = () => {
    setShowAccountInfo(true);
  };
  if (showAccountInfo) {
    return (
      <AccountInformation
        onBack={() => setShowAccountInfo(false)}
        customerData={customerData}
      />
    );
  }
  const handlePrivacySharing = () => {
    setShowPrivacy(true);
  };
  if (showPrivacy) {
    return (
      <PrivacySharing
        onBack={() => setShowPrivacy(false)}
        customerData={customerData}
      />
    );
  }

  const handleLoginDetails = () => {
    setShowLoginDetails(true);
  };
  if (showLoginDetails) {
    return (
      <LoginDetails
        onBack={() => setShowLoginDetails(false)}
        customerData={customerData}
      />
    );
  }

  const handleSecurity = () => {
    setShowSecurity(true);
  };
  if (showSecurity) {
    return (
      <Security
        onBack={() => setShowSecurity(false)}
        customerData={customerData}
      />
    );
  }

  const handleNotification = () => {
    setShowNotification(true);
  };
  if (showNotification) {
    return (
      <Notification
        onBack={() => setShowNotification(false)}
        customerData={customerData}
      />
    );
  }

  const handleGlobalPreference = () => {
    setShowGlobalPreference(true);
  };
  if (showGlobalPreference) {
    return (
      <GlobalPreference
        onBack={() => setShowGlobalPreference(false)}
        customerData={customerData}
      />
    );
  }

  return (
    <main className="md:p-6">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => router.push("/dashboard/customers")}
          className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </button>
      </div>

      {/* Page Title */}
      <div className="md:block mb-8">
        <h1 className="text-xl font-medium md:hidden block">
          Profile Settings
        </h1>
      </div>
      <div className=" mx-auto py-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative w-24 h-24 mb-4">
            {customerData?.profile_image ? (
              <Image
                src={customerAvatar}
                alt="Profile"
                layout="fill"
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
                {getInitials()}
              </div>
            )}
            <div className="absolute bottom-3 right-0 bg-gray-200 p-1 rounded-full shadow cursor-pointer">
              <Image
                src="/icons/UserDashboard/edit.svg"
                alt="edit"
                width={24}
                height={24}
              />
            </div>
          </div>
          <h2 className="text-2xl font-semibold">{customerName}</h2>
          <p className="text-gray-500 text-sm">{customerEmail}</p>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 hidden md:grid">
          <button
            onClick={handleAccountInfo}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-2 rounded-lg mb-2">
                <Image
                  src="/icons/UserDashboard/user.svg"
                  alt="Account information"
                  width={24}
                  height={24}
                />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base">Account information</h3>
                <p className="text-gray-500 text-sm">
                  Profile photo, name & language
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleNotification}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl bg-gray-100 p-2 rounded-lg mb-2">
                <Image
                  src="/icons/UserDashboard/notification.svg"
                  alt="Notifications"
                  width={24}
                  height={24}
                />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base">Notifications</h3>
                <p className="text-gray-500 text-sm">
                  Set your email notifications
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleLoginDetails}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl bg-gray-100 p-2 rounded-lg mb-2">
                <Image
                  src="/icons/UserDashboard/password.svg"
                  alt="Login details"
                  width={24}
                  height={24}
                />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base">Login details</h3>
                <p className="text-gray-500 text-sm">
                  Password & security questions
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleSecurity}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl bg-gray-100 p-2 rounded-lg mb-2">
                <Image
                  src="/icons/UserDashboard/security.svg"
                  alt="Security"
                  width={24}
                  height={24}
                />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base">Security</h3>
                <p className="text-gray-500 text-sm">
                  Your last activity and credentials
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handlePrivacySharing}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl bg-gray-100 p-2 rounded-lg mb-2">
                <Image
                  src="/icons/UserDashboard/privacy.svg"
                  alt="Privacy Sharing"
                  width={24}
                  height={24}
                />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base">Privacy Sharing</h3>
                <p className="text-gray-500 text-sm">
                  Connected apps and services
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleGlobalPreference}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 p-2 rounded-lg mb-2">
                <Image
                  src="/icons/UserDashboard/preference.svg"
                  alt="Global preference"
                  width={24}
                  height={24}
                />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base">Global preference</h3>
                <p className="text-gray-500 text-sm">
                  Time zone, currency, and language.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          <div
            onClick={handleAccountInfo}
            className="flex items-center justify-between bg-white p-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                <Image
                  src="/icons/UserDashboard/user.svg"
                  alt="Account information"
                  width={24}
                  height={24}
                />
              </span>
              <span className="font-bold text-base">Account information</span>
            </div>
            <ChevronRight className="text-gray-500" />
          </div>

          <div
            onClick={handlePrivacySharing}
            className="flex items-center justify-between bg-white p-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                <Image
                  src="/icons/UserDashboard/privacy.svg"
                  alt="Privacy Sharing"
                  width={24}
                  height={24}
                />
              </span>
              <span className="font-bold text-base">Privacy Sharing</span>
            </div>
            <ChevronRight className="text-gray-500" />
          </div>

          <div
            onClick={handleLoginDetails}
            className="flex items-center justify-between bg-white p-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                <Image
                  src="/icons/UserDashboard/password.svg"
                  alt="Login details"
                  width={24}
                  height={24}
                />
              </span>
              <span className="font-bold text-base">Login details</span>
            </div>
            <ChevronRight className="text-gray-500" />
          </div>

          <div
            onClick={handleSecurity}
            className="flex items-center justify-between bg-white p-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                <Image
                  src="/icons/UserDashboard/security.svg"
                  alt="Security"
                  width={24}
                  height={24}
                />
              </span>
              <span className="font-bold text-base">Security</span>
            </div>
            <ChevronRight className="text-gray-500" />
          </div>

          <div
            onClick={handleNotification}
            className="flex items-center justify-between bg-white p-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                <Image
                  src="/icons/UserDashboard/notification.svg"
                  alt="Notifications"
                  width={24}
                  height={24}
                />
              </span>
              <span className="font-bold text-base">Notifications</span>
            </div>
            <ChevronRight className="text-gray-500" />
          </div>

          <div
            onClick={handleGlobalPreference}
            className="flex items-center justify-between bg-white p-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                <Image
                  src="/icons/UserDashboard/preference.svg"
                  alt="Global preference"
                  width={24}
                  height={24}
                />
              </span>
              <span className="font-bold text-base">Global preference</span>
            </div>
            <ChevronRight className="text-gray-500" />
          </div>
        </div>
      </div>
    </main>
  );
}
