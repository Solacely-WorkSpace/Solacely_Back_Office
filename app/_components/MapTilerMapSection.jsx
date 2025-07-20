"use client"
import React, { useEffect, useState } from 'react'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'
import MapTilerMarkerItem from './MapTilerMarkerItem'

function MapTilerMapSection({coordinates, listing}) {
  const [map, setMap] = useState(null)
  const [center, setCenter] = useState({
    lat: 40.730610,
    lng: -73.935242
  })
  
  // Initialize MapTiler configuration
  useEffect(() => {
    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY
  }, [])
  
  // Update center when coordinates change
  useEffect(() => {
    if (coordinates) {
      setCenter(coordinates)
    }
  }, [coordinates])
  
  // Initialize map
  useEffect(() => {
    if (!map) {
      const mapInstance = new maptilersdk.Map({
        container: 'map-container',
        style: maptilersdk.MapStyle.STREETS,
        center: [center.lng, center.lat],
        zoom: 10
      })
      
      setMap(mapInstance)
    }
    
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [])
  
  // Update map when center changes
  useEffect(() => {
    if (map) {
      map.setCenter([center.lng, center.lat])
      map.setZoom(10)
    }
  }, [map, center])
  
  return (
    <div>
      <div 
        id="map-container" 
        style={{
          width: '100%',
          height: '80vh',
          borderRadius: 10
        }}
      >
        {map && listing.map((item, index) => (
          <MapTilerMarkerItem
            key={index}
            map={map}
            item={item}
          />
        ))}
      </div>
    </div>
  )
}

export default MapTilerMapSection