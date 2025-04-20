"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLayersPanel, setShowLayersPanel] = useState(false)
  const [showLegendPanel, setShowLegendPanel] = useState(false)
  
  // Import DynamicMap component with SSR disabled
  const DynamicMapWithNoSSR = dynamic(
    () => import('./dynamic-map'),
    { ssr: false }
  )

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
    <div className="relative w-full h-full">
      {/* Map Container - Using dynamic import with no SSR */}
      <DynamicMapWithNoSSR 
        voicePins={voicePins}
        selectedCategories={selectedCategories}
        setSelectedPin={setSelectedPin}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Sidebar Toggle Button */}
      <div
        className={`absolute top-4 ${sidebarPosition === "left" ? "right-4" : "left-4"} z-10`}
        style={{ transition: "all 0.3s ease" }}
      >
        <Button
          variant="default"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gray-800/90 text-gray-200 border border-gray-700 shadow-md hover:bg-gray-700"
        >
          {sidebarOpen ? (
            <>
              <span>Hide Panel</span>
              {sidebarPosition === "left" ? <ChevronLeft className="h-4 w-4 ml-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
            </>
          ) : (
            <>
              <span>Show Panel</span>
              {sidebarPosition === "left" ? <ChevronRight className="h-4 w-4 ml-2" /> : <ChevronLeft className="h-4 w-4 ml-2" />}
            </>
          )}
        </Button>
      </div>

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
