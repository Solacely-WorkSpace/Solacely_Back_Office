"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import MarkerItem from './MarkerItem';

const containerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: 10
};

function GoogleMapSection({coordinates, listing}) {
    const [center, setCenter] = useState({
        lat: 40.730610,
        lng: -73.935242
    });
    const [map, setMap] = useState(null);
    
    // Load Google Maps API
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY,
        libraries: ['places']
    });
    
    useEffect(() => {
        coordinates && setCenter(coordinates);
    }, [coordinates]);
     
    useEffect(() => {
        if (map) {
            map.setZoom(10);
        }
    }, [map]);
    
    const onLoad = useCallback(function callback(map) {
        // Set the map bounds and zoom
        if (window.google && window.google.maps) {
            const bounds = new window.google.maps.LatLngBounds(center);
            map.fitBounds(bounds);
        }
        setMap(map);
    }, [center]);
    
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);
    
    // Show loading state while Google Maps API is loading
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-80 bg-gray-100 rounded-lg">
                <div className="text-gray-500">Loading map...</div>
            </div>
        );
    }
    
    return (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                gestureHandling="greedy"
            >
                {listing && listing.map((item, index) => (
                    <MarkerItem
                        key={index}
                        item={item}
                    />
                ))}
            </GoogleMap>
        </div>
    );
}

export default GoogleMapSection