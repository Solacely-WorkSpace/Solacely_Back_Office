"use client";
import React from 'react';
import { LoadScript } from '@react-google-maps/api';

export default function Provider({ children }) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || '';

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['places']}>
      {children}
    </LoadScript>
  );
}