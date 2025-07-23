"use client";
import React from 'react';
import Image from 'next/image';
import { VerifiedIcon, homeIcon, locationIcon, contractIcon, walletIcon } from '@/assets/icons';

function RentalInfoCard({ hasRentedApartment, rentedApartment }) {
  return (
    <div className="bg-purple-50 rounded-lg overflow-hidden mb-8">
      <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between relative">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-gray-600">Rental Information</h2>
            <span>
              <Image 
                src={VerifiedIcon} 
                alt="Verified" 
                width={20}
                height={20}
              />
            </span>
          </div>

          {!hasRentedApartment && (
            <p className="text-base text-gray-500 py-6">
              You have not rented any apartment yet. Explore to find our listings<br />
              to find an Apartment you may like
            </p>
          )}
          
          {/* Rental Details */}
          {hasRentedApartment && (
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Apartment Name */}
                <div className="rounded-md flex items-start gap-3">
                  <div className="bg-primary text-white p-2 rounded-md">
                    <Image 
                      src={homeIcon} 
                      alt="Home" 
                      width={16}
                      height={16}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{rentedApartment.title}</p>
                    <p className="text-gray-400 text-sm">{rentedApartment.type}</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="rounded-md flex items-start gap-3">
                  <div className="bg-primary text-white p-2 px-3 rounded-md">
                    <Image 
                      src={locationIcon} 
                      alt="Location" 
                      width={16}
                      height={16}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{rentedApartment.location}</p>
                    <p className="text-gray-400 text-sm">Location</p>
                  </div>
                </div>
                
                {/* Monthly Rent */}
                <div className="rounded-md flex items-start gap-3">
                  <div className="bg-primary text-white p-2 rounded-md">
                    <Image 
                      src={walletIcon} 
                      alt="Monthly Rent" 
                      width={16}
                      height={16}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{rentedApartment.rent}</p>
                    <p className="text-gray-400 text-sm">{rentedApartment.rentLabel}</p>
                  </div>
                </div>
                
                {/* Contract */}
                <div className="rounded-md flex items-start gap-3">
                  <div className="bg-primary text-white p-2 rounded-md">
                    <Image 
                      src={contractIcon} 
                      alt="Contract" 
                      width={16}
                      height={16}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{rentedApartment.contractType}</p>
                    <p className="text-gray-400 text-sm">{rentedApartment.contractLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="absolute top-0 right-0 hidden md:block h-full">
          <Image
            src="/images/UserDashboard/houseillustration.png"
            alt="House illustration"
            width={200}
            height={150}
            className="h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default RentalInfoCard;