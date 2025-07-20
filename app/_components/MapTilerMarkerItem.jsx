"use client"
import React, { useEffect, useState } from 'react'
import * as maptilersdk from '@maptiler/sdk'
import MarkerListingItem from './MarkerListingItem'
import ReactDOM from 'react-dom'

function MapTilerMarkerItem({map, item}) {
  const [marker, setMarker] = useState(null)
  const [popup, setPopup] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  
  useEffect(() => {
    if (map && item.coordinates) {
      // Create marker element
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.backgroundImage = 'url(/pin.png)'
      el.style.width = '60px'
      el.style.height = '60px'
      el.style.backgroundSize = 'cover'
      el.style.cursor = 'pointer'
      
      // Create marker
      const newMarker = new maptilersdk.Marker({element: el})
        .setLngLat([item.coordinates.lng, item.coordinates.lat])
        .addTo(map)
      
      // Create popup but don't add to map yet
      const popupNode = document.createElement('div')
      popupNode.className = 'custom-popup'
      
      const newPopup = new maptilersdk.Popup({ offset: 25 })
        .setLngLat([item.coordinates.lng, item.coordinates.lat])
        .setDOMContent(popupNode)
      
      // Render MarkerListingItem into the popup
      const renderPopupContent = () => {
        if (showPopup) {
          ReactDOM.render(
            <MarkerListingItem 
              item={item} 
              closeHandler={() => setShowPopup(false)}
            />,
            popupNode
          )
          newPopup.addTo(map)
        } else {
          newPopup.remove()
        }
      }
      
      // Add click event to marker
      el.addEventListener('click', () => {
        setShowPopup(true)
      })
      
      setMarker(newMarker)
      setPopup(newPopup)
      
      return () => {
        if (newMarker) newMarker.remove()
        if (newPopup) newPopup.remove()
        if (popupNode) ReactDOM.unmountComponentAtNode(popupNode)
      }
    }
  }, [map, item])
  
  useEffect(() => {
    if (popup && marker) {
      if (showPopup) {
        popup.addTo(map)
      } else {
        popup.remove()
      }
    }
  }, [showPopup, popup, marker, map])
  
  return null
}

export default MapTilerMarkerItem