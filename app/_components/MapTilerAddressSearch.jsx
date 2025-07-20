"use client"
import React, { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { GeocodingControl } from "@maptiler/geocoding-control/react"
import "@maptiler/geocoding-control/style.css"

function MapTilerAddressSearch({selectedAddress, setCoordinates}) {
  const [apiKey, setApiKey] = useState('')
  
  useEffect(() => {
    setApiKey(process.env.NEXT_PUBLIC_MAPTILER_API_KEY)
  }, [])
  
  const handleGeocodingResult = (result) => {
    if (result && result.features && result.features.length > 0) {
      const feature = result.features[0]
      const [lng, lat] = feature.center
      
      // Create a place object similar to Google Places format
      const place = {
        label: feature.place_name,
        value: {
          structured_formatting: {
            main_text: feature.text,
            secondary_text: feature.place_name.replace(feature.text + ', ', '')
          }
        }
      }
      
      selectedAddress(place)
      setCoordinates({lat, lng})
    }
  }
  
  return (
    <div className='flex items-center w-full'>
      <MapPin className='h-10 w-10 p-2 rounded-l-lg text-primary bg-purple-200'/>
      <div className='w-full'>
        <GeocodingControl 
          apiKey={apiKey}
          placeholder="Search Property Address"
          showResultsWhileTyping={true}
          onSelect={handleGeocodingResult}
        />
      </div>
    </div>
  )
}

export default MapTilerAddressSearch