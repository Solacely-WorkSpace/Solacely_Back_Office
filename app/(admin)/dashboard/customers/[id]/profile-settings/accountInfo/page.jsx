"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountInformation({ customerData, onBack }) {
  const router = useRouter();
  // Initialize state with customerData or fallback values
  const [legalName, setLegalName] = useState(
    customerData?.full_name || "Not provided"
  );
  const [gender, setGender] = useState("Not specified");
  const [dob, setDob] = useState("Not provided");
  const [email, setEmail] = useState(customerData?.email || "Not provided");
  const [phone, setPhone] = useState(
    customerData?.phone_number || "Not provided"
  );
  const [address, setAddress] = useState(
    customerData?.location || "Not provided"
  );

  // Update state when customerData changes
  useEffect(() => {
    if (customerData) {
      setLegalName(
        customerData.full_name || customerData.username || "Not provided"
      );
      setEmail(customerData.email || "Not provided");
      setPhone(customerData.phone_number || "Not provided");
      setAddress(customerData.location || "Not provided");
    }
  }, [customerData]);

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 md:p-6">
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div>
          <h1 className="text-base font-semibold text-gray-800">
            Account Information
          </h1>
          <p className="text-gray-500 text-xs">
            Profile photo, name & language
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:gap-8 w-full relative">
        {/* Fields - Make left part narrower */}
        <div className="w-full md:w-1/3 lg:w-1/3">
          {/* Legal Name */}
          <div className="mb-4 w-full border-b border-gray-200 md:border md:border-gray-200 md:rounded-lg md:p-4">
            <label className="text-sm text-gray-500">Legal name</label>
            <div className="flex justify-between items-center mt-1">
              <span className="font-medium text-sm">{legalName}</span>
              <button className="text-red-600 px-3 py-2 text-xs">
                <div className="flex gap-2">
                  <Image
                    src="/icons/UserDashboard/save.svg"
                    className="w-3 h-3"
                    alt="Save"
                    width={24}
                    height={24}
                  />
                  Save
                </div>
              </button>
            </div>
          </div>

          {/* Gender */}
          <div className="mb-4 w-full border-b border-gray-200">
            <label className="text-sm text-gray-500">Gender</label>
            <div className="flex justify-between items-center mt-1">
              <span className="font-medium text-sm">{gender}</span>
              <button className="text-gray-500 text-sm">
                <div className="flex gap-2 text-sm text-gray-500">
                  <Image
                    src="/icons/edit.svg"
                    className="w-3 h-3"
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                  Edit
                </div>
              </button>
            </div>
          </div>

          {/* Date of birth */}
          <div className="mb-4 w-full border-b border-gray-200">
            <label className="text-sm text-gray-500">Date of birth</label>
            <div className="flex justify-between items-center mt-1">
              <span className="font-medium text-sm">{dob}</span>
              <button className="text-gray-500 text-sm">
                <div className="flex gap-2 text-sm text-gray-500">
                  <Image
                    src="/icons/edit.svg"
                    className="w-3 h-3"
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                  Edit
                </div>
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="mb-4 w-full border-b border-gray-200">
            <label className="text-sm text-gray-500">Email address</label>
            <div className="flex justify-between items-center mt-1">
              <span className="font-medium text-sm">{email}</span>
              <button className="text-gray-500 text-sm">
                <div className="flex gap-2 text-sm text-gray-500">
                  <Image
                    src="/icons/edit.svg"
                    className="w-3 h-3"
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                  Edit
                </div>
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4 w-full border-b border-gray-200">
            <label className="text-sm text-gray-500">Phone number</label>
            <div className="flex justify-between items-center mt-1">
              <span className="font-medium text-sm">{phone}</span>
              <button className="text-gray-500 text-sm">
                <div className="flex gap-2 text-sm text-gray-500">
                  <Image
                    src="/icons/edit.svg"
                    className="w-3 h-3"
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                  Edit
                </div>
              </button>
            </div>
          </div>

          {/* Whatsapp */}
          <div className="mb-4 w-full border-b border-gray-200">
            <label className="text-sm text-gray-500">Whatsapp number</label>
            <div className="flex justify-between items-center mt-1">
              <span className="font-medium text-sm">{phone}</span>
              <button className="text-gray-500 text-sm">
                <div className="flex gap-2 text-sm text-gray-500">
                  <Image
                    src="/icons/edit.svg"
                    className="w-3 h-3"
                    alt="Edit"
                    width={24}
                    height={24}
                  />
                  Edit
                </div>
              </button>
            </div>
          </div>

          {/* Address */}
          <div className="mb-4 w-full border-b border-gray-200">
            <label className="text-sm text-gray-500">Address</label>
            <div className="flex justify-between items-center mt-1">
              <span className="font-medium text-sm">{address}</span>
              <button className="text-gray-500 text-sm">
                <div className="flex gap-2 text-sm text-gray-500">
                  <p className="text-black bg-gray-200 px-2 py-1 rounded-full w-4 h-4 flex items-center justify-center">
                    +
                  </p>
                  Add
                </div>
              </button>
            </div>
          </div>

          {/* Update and Cancel Buttons - Change Update button to green */}
          <div className="flex space-x-4 mt-8">
            <button className="bg-[#3DC5A1] text-white px-6 py-2 rounded-md flex-1 md:flex-initial">
              Update Settings
            </button>
            <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md flex-1 md:flex-initial">
              Cancel
            </button>
          </div>
          {/* Remove mobile Deactivate Button as it will be on the right side */}
          <div className="mt-8 md:hidden">
            {/* Removed deactivate button from here */}
          </div>
        </div>
        
        {/* Right Section (Info Card and Deactivate Button) */}
        <div className="md:flex-1 md:flex md:flex-col md:justify-between">
          {/* Make the general information card more compact and positioned to the right */}
          <div className="md:ml-auto md:max-w-xs bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-3 p-2 bg-gray-200 rounded-lg w-8 h-8">
              <Image
                src="/icons/UserDashboard/user.svg"
                alt="Account information"
                className="w-4 h-4"
                width={24}
                height={24}
              />
            </div>
            <h3 className="font-medium text-sm mb-1">
              General information
            </h3>
            <p className="text-xs text-gray-400">
              Everybody that has ever been to a meeting, can recall the all
              familiar passing of the business cards.
            </p>
          </div>

          {/* Deactivate Button - Moved to right side */}
          <div className="mt-6 flex justify-end">
            <button className="border border-gray-300 font-bold px-4 py-2 rounded-md text-gray-400 flex items-center gap-2">
              <Image
                src="/icons/trash.svg"
                alt="Deactivate Account"
                className="w-6 h-4"
                width={24}
                height={24}
              />
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
