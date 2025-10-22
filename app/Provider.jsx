"use client"
import React from 'react'
import { LoadScript } from '@react-google-maps/api'

function Provider({ children }) {
  // Ensure Google Maps API key is available
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || '';

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={['places']}
    >
      {children}
    </LoadScript>
  );
}

export default Provider;