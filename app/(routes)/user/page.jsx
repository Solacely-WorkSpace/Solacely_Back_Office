"use client"
import { UserButton, UserProfile } from '@clerk/nextjs'
import { Building2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import UserListing from './_components/UserListing'

export const dynamic = 'force-dynamic';

function User() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Show a loading state until client-side code runs
  if (!isClient) {
    return <div className='my-6 md:px-10 lg:px-32 w-full'>
      <h2 className='font-bold text-2xl py-3'>Profile</h2>
      <div>Loading profile...</div>
    </div>
  }
  
  return (
    <div className='my-6 md:px-10 lg:px-32 w-full'>
      <h2 className='font-bold text-2xl py-3'>Profile</h2>
      <UserProfile>
        <UserButton.UserProfilePage
          label='My Listing'
          labelIcon={<Building2 className='h-5 w-5' />}
          url="my-listing"
        >
          <UserListing/>
        </UserButton.UserProfilePage>
      </UserProfile>
    </div>
  )
}

export default User