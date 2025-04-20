"use client"

import { useEffect } from 'react'

// This component only renders on the client side
export default function MapContainer() {
  useEffect(() => {
    // Dynamically import Leaflet CSS
    require('leaflet/dist/leaflet.css')
  }, [])
  
  return null
}
