"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Layers, Info } from "lucide-react"
import type { VoicePin } from "@/types/data-types"

interface VoicesMapProps {
  voicePins: VoicePin[]
  selectedCategories: string[]
  setSidebarOpen: (open: boolean) => void
  sidebarOpen: boolean
  sidebarPosition: "left" | "right"
  setSidebarPosition: (position: "left" | "right") => void
  selectedPin: VoicePin | null
  setSelectedPin: (pin: VoicePin | null) => void
}

export default function VoicesMap({
  voicePins,
  selectedCategories,
  setSidebarOpen,
  sidebarOpen,
  sidebarPosition,
  setSidebarPosition,
  selectedPin,
  setSelectedPin,
}: VoicesMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  // Remove this line since we're now using the prop from parent
  // const [selectedPin, setSelectedPin] = useState<VoicePin | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLayersPanel, setShowLayersPanel] = useState(false)
  const [showLegendPanel, setShowLegendPanel] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // California bounds
    const californiaBounds = L.latLngBounds(
      L.latLng(32.5, -124.4), // Southwest corner
      L.latLng(42.0, -114.1), // Northeast corner
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

  // Update markers when voice pins or filters change
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return

    // Clear existing markers
    markersLayerRef.current.clearLayers()

    // Filter pins by selected categories
    const filteredPins =
      selectedCategories.length > 0 ? voicePins.filter((pin) => selectedCategories.includes(pin.category)) : voicePins

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

  // Get color for category
  const getColorForCategory = (category: string): string => {
    switch (category) {
      case "Urgent Help":
        return "#ef4444" // Red
      case "Emotional Testimony":
        return "#8b5cf6" // Purple
      case "Pet Missing":
        return "#f59e0b" // Amber
      case "Needs Shelter":
        return "#3b82f6" // Blue
      default:
        return "#6b7280" // Gray
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
        return "📣"
    }
  }

  // Toggle audio playback (mock)
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, you would play/pause the audio here
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Collapsible Layer Controls */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowLayersPanel(!showLayersPanel)}
          className="bg-gray-800/90 text-gray-200 border border-gray-700 shadow-md hover:bg-gray-700 mb-2"
        >
          <Layers className="h-4 w-4 mr-2" />
          <span>Map Layers</span>
          {showLayersPanel ? <ChevronRight className="h-4 w-4 ml-2" /> : <ChevronLeft className="h-4 w-4 ml-2" />}
        </Button>

        {showLayersPanel && (
          <div className="bg-gray-800/90 p-3 rounded-md shadow-md border border-gray-700 mb-2 backdrop-blur-sm">
            <h3 className="text-sm font-semibold mb-2 border-b border-gray-700 pb-1 text-gray-200">Voice Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ef4444" }} />
                <span className="text-sm text-gray-200">Urgent Help</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#8b5cf6" }} />
                <span className="text-sm text-gray-200">Emotional Testimony</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
                <span className="text-sm text-gray-200">Pet Missing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3b82f6" }} />
                <span className="text-sm text-gray-200">Needs Shelter</span>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="default"
          size="sm"
          onClick={() => setShowLegendPanel(!showLegendPanel)}
          className="bg-gray-800/90 text-gray-200 border border-gray-700 shadow-md hover:bg-gray-700"
        >
          <Info className="h-4 w-4 mr-2" />
          <span>Legend</span>
          {showLegendPanel ? <ChevronRight className="h-4 w-4 ml-2" /> : <ChevronLeft className="h-4 w-4 ml-2" />}
        </Button>

        {showLegendPanel && (
          <div className="bg-gray-800/90 p-3 rounded-md shadow-md z-10 mt-2 border border-gray-700 backdrop-blur-sm">
            <h3 className="text-base font-semibold mb-3 border-b border-gray-700 pb-1 text-gray-200">Voice Legend</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-200">Urgency Levels</h4>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-200">Urgent Help - Immediate assistance needed</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-200">Needs Shelter - Housing required</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-200">Other Categories</h4>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  <span className="text-sm text-gray-200">Emotional Testimony - Personal stories</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-4 h-4 rounded-full bg-amber-500" />
                  <span className="text-sm text-gray-200">Pet Missing - Lost animal reports</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
