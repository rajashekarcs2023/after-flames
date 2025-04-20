"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { VoicePin } from '@/types/data-types'

interface DynamicMapProps {
  voicePins: VoicePin[]
  selectedCategories: string[]
  setSelectedPin: (pin: VoicePin | null) => void
  setSidebarOpen: (open: boolean) => void
}

export default function DynamicMap({
  voicePins,
  selectedCategories,
  setSelectedPin,
  setSidebarOpen
}: DynamicMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // California bounds
    const californiaBounds = L.latLngBounds(
      L.latLng(32.5, -124.4), // Southwest corner
      L.latLng(42.0, -114.1)  // Northeast corner
    )

    // Create map with light theme
    const map = L.map(mapContainerRef.current, {
      center: [37.2, -119.5], // Center of California
      zoom: 6,
      maxBounds: californiaBounds.pad(0.1), // Restrict panning to California
      minZoom: 5,
      maxZoom: 12,
    })

    // Add light-themed tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    markersLayerRef.current = L.layerGroup().addTo(map)

    // Fit map to California bounds
    map.fitBounds(californiaBounds)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Get color for category
  const getColorForCategory = (category: string): string => {
    switch (category) {
      case "Urgent Help":
        return "#ef4444" // red-500
      case "Emotional Testimony":
        return "#8b5cf6" // purple-500
      case "Pet Missing":
        return "#f59e0b" // amber-500
      case "Needs Shelter":
        return "#3b82f6" // blue-500
      default:
        return "#6b7280" // gray-500
    }
  }

  // Get icon for category
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case "Urgent Help":
        return "🆘"
      case "Emotional Testimony":
        return "💬"
      case "Pet Missing":
        return "🐾"
      case "Needs Shelter":
        return "🏠"
      default:
        return "📍"
    }
  }

  // Update markers when voice pins or filters change
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return

    // Clear existing markers
    markersLayerRef.current.clearLayers()

    // Filter pins by selected categories
    const filteredPins =
      selectedCategories.length > 0 
        ? voicePins.filter((pin) => selectedCategories.includes(pin.category)) 
        : voicePins

    // Add markers for each pin
    filteredPins.forEach((pin) => {
      // Create custom icon based on category
      const iconColor = getColorForCategory(pin.category)
      const icon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: ${iconColor};" class="marker-pin">
                <span class="flex items-center justify-center h-full text-white">🔊</span>
               </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
      })

      // Create marker
      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(markersLayerRef.current!)

      // Add click handler
      marker.on("click", () => {
        // Set the selected pin in the parent component
        setSelectedPin(pin)

        // Ensure the sidebar is open
        setSidebarOpen(true)

        // Remove any open popups
        mapRef.current?.closePopup()
      })

      // Add popup with basic info
      const popupContent = `
        <div class="p-2">
          <div class="font-bold">${getCategoryIcon(pin.category)} ${pin.category}</div>
          <div class="text-sm text-gray-400">${pin.timestamp}</div>
        </div>
      `
      marker.bindPopup(popupContent)
    })
  }, [voicePins, selectedCategories, setSelectedPin, setSidebarOpen])

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg overflow-hidden"
    />
  )
}
