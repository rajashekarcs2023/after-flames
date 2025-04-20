"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { EquityData, FirePerimeter } from "@/types/data-types"
import type { GeoJSON } from "geojson"
import { Button } from "@/components/ui/button"
import { Clock, Eye, EyeOff, RefreshCw, Layers, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"

interface MapViewProps {
  equityData: EquityData[]
  firePerimeters: FirePerimeter[]
  selectedZip: string | null
  setSelectedZip: (zip: string | null) => void
  useCalculatedScores?: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarOpen: boolean
  sidebarPosition: "left" | "right"
  setSidebarPosition: (position: "left" | "right") => void
}

export default function MapView({
  equityData,
  firePerimeters,
  selectedZip,
  setSelectedZip,
  useCalculatedScores = false,
  setSidebarOpen,
  sidebarOpen,
  sidebarPosition,
  setSidebarPosition,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const zipLayerRef = useRef<L.GeoJSON | null>(null)
  const fireLayerRef = useRef<L.GeoJSON | null>(null)
  const [year, setYear] = useState(2023)
  const [showLayers, setShowLayers] = useState({
    equity: true,
    fires: true,
  })
  const [showTimelineControls, setShowTimelineControls] = useState(false)
  const [mapView, setMapView] = useState("equity") // Fixed to equity view only
  const [isLoading, setIsLoading] = useState(false)
  const [showLayersPanel, setShowLayersPanel] = useState(false)
  const [showLegendPanel, setShowLegendPanel] = useState(false)

  // Reset to equity view on component mount
  useEffect(() => {
    setMapView("equity")
  }, [])

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

    // Fit map to California bounds
    map.fitBounds(californiaBounds)

    // Add light-themed tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Add/update ZIP code layers
  useEffect(() => {
    if (!mapRef.current) return

    setIsLoading(true)
    console.log("Equity layer visibility:", showLayers.equity)

    // Remove existing layer if it exists
    if (zipLayerRef.current) {
      mapRef.current.removeLayer(zipLayerRef.current)
      zipLayerRef.current = null
    }

    // If layer should be hidden, return early
    if (!showLayers.equity) {
      setIsLoading(false)
      return
    }

    // Create GeoJSON features from equity data
    const features = equityData.map((item) => ({
      type: "Feature",
      properties: {
        zip: item.zip,
        renter_pct: item.renter_pct,
        elderly_pct: item.elderly_pct,
        LEP_pct: item.LEP_pct,
        income: item.income,
        equity_score:
          useCalculatedScores && item.calculated_equity_score ? item.calculated_equity_score : item.equity_score,
        isSelected: item.zip === selectedZip,
        // Mock data for other views
        fire_severity: Math.random() * 100,
        population_density: Math.floor(Math.random() * 10000) + 1000,
      },
      geometry: item.geometry,
    }))

    // Create and add new layer
    const zipLayer = L.geoJSON({ type: "FeatureCollection", features } as GeoJSON.FeatureCollection, {
      style: (feature) => {
        const props = feature?.properties
        const isSelected = props?.isSelected || false

        // Different coloring based on the selected view
        let fillColor = "#22c55e" // Default green

        if (mapView === "equity") {
          // Equity score view - green to red gradient
          const score = props?.equity_score || 0
          const hue = (100 - score) * 1.2 // 120 (green) to 0 (red)
          fillColor = `hsl(${hue}, 75%, 50%)`
        } else if (mapView === "fire") {
          // Fire severity view - blue to red gradient
          const severity = props?.fire_severity || 0
          const hue = (100 - severity) * 2.4 // 240 (blue) to 0 (red)
          fillColor = `hsl(${hue}, 75%, 50%)`
        } else if (mapView === "population") {
          // Population density view - yellow to purple gradient
          const density = props?.population_density || 0
          const normalizedDensity = Math.min(100, (density / 10000) * 100)
          const hue = 60 - normalizedDensity * 0.6 // 60 (yellow) to 300 (purple)
          fillColor = `hsl(${hue}, 75%, 50%)`
        }

        return {
          fillColor,
          weight: isSelected ? 3 : 1,
          opacity: 0.8,
          color: isSelected ? "#3b82f6" : "#e5e7eb",
          fillOpacity: isSelected ? 0.8 : 0.6,
        }
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties

        // Create popup content based on the view
        let popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-lg">ZIP: ${props.zip}</h3>
            <div class="grid grid-cols-2 gap-1 mt-2">
        `

        // Add view-specific content
        if (mapView === "equity") {
          popupContent += `
              <div>Renters:</div>
              <div class="text-right">${props.renter_pct}%</div>
              <div>Elderly:</div>
              <div class="text-right">${props.elderly_pct}%</div>
              <div>Limited English:</div>
              <div class="text-right">${props.LEP_pct}%</div>
              <div>Median Income:</div>
              <div class="text-right">${props.income.toLocaleString()}</div>
              <div class="font-bold">Equity Score:</div>
              <div class="text-right font-bold">${props.equity_score.toFixed(1)}</div>
          `
        } else if (mapView === "fire") {
          popupContent += `
              <div>Fire Severity:</div>
              <div class="text-right">${props.fire_severity.toFixed(1)}</div>
              <div>Risk Level:</div>
              <div class="text-right">${props.fire_severity > 75 ? "High" : props.fire_severity > 50 ? "Medium" : "Low"}</div>
          `
        } else if (mapView === "population") {
          popupContent += `
              <div>Population Density:</div>
              <div class="text-right">${props.population_density.toLocaleString()} per sq mi</div>
          `
        }

        popupContent += `
            </div>
          </div>
        `

        layer.bindPopup(popupContent)

        // Add hover effect and click handler
        layer.on({
          mouseover: (e) => {
            const l = e.target
            if (!props.isSelected) {
              l.setStyle({
                weight: 2,
                fillOpacity: 0.7,
              })
            }
            l.bringToFront()
          },
          mouseout: (e) => {
            if (!props.isSelected) {
              zipLayer.resetStyle(e.target)
            }
          },
          click: (e) => {
            // Ensure the layer is properly selected
            if (zipLayerRef.current) {
              zipLayerRef.current.eachLayer((layer) => {
                zipLayer.resetStyle(layer)
              })

              // Highlight the clicked layer
              const layer = e.target
              layer.setStyle({
                weight: 3,
                color: "#3b82f6",
                fillOpacity: 0.8,
              })
            }

            // Set the selected ZIP and ensure sidebar is open
            setSelectedZip(props.zip)
            setSidebarOpen(true)

            // Log for debugging
            console.log("ZIP clicked:", props.zip)
          },
        })
      },
    }).addTo(mapRef.current)

    zipLayerRef.current = zipLayer
    setIsLoading(false)
  }, [equityData, selectedZip, setSelectedZip, useCalculatedScores, showLayers.equity, setSidebarOpen, mapView])

  // Add/update fire perimeter layers with animation capability
  useEffect(() => {
    if (!mapRef.current) return

    setIsLoading(true)
    console.log("Fire layer visibility:", showLayers.fires)

    // Remove existing layer if it exists
    if (fireLayerRef.current) {
      mapRef.current.removeLayer(fireLayerRef.current)
      fireLayerRef.current = null
    }

    // If layer should be hidden, return early
    if (!showLayers.fires) {
      setIsLoading(false)
      return
    }

    // Sort fire perimeters by year
    const sortedPerimeters = [...firePerimeters].sort((a, b) => a.properties.year - b.properties.year)

    // Create and add new layer
    const fireLayer = L.geoJSON(
      { type: "FeatureCollection", features: sortedPerimeters } as GeoJSON.FeatureCollection,
      {
        style: (feature) => {
          const featureYear = feature?.properties?.year || 0

          return {
            fillColor: "#FF4500",
            weight: 2,
            opacity: featureYear <= year ? 0.7 : 0,
            color: "#FF0000",
            fillOpacity: featureYear <= year ? 0.3 : 0,
          }
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties
          const popupContent = `
            <div class="p-2">
              <h3 class="font-bold">${props.name}</h3>
              <p>Year: ${props.year}</p>
              <p>Acres: ${props.acres.toLocaleString()}</p>
            </div>
          `
          layer.bindPopup(popupContent)
        },
      },
    ).addTo(mapRef.current)

    fireLayerRef.current = fireLayer
    setIsLoading(false)
  }, [firePerimeters, year, showLayers.fires])

  // Handle timeline slider for fire progression
  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number.parseInt(e.target.value))
  }

  // Get legend title and gradient based on current view
  const getLegendInfo = () => {
    switch (mapView) {
      case "equity":
        return {
          title: "Equity Score",
          gradient: "from-green-500 to-red-500",
          labels: ["Low", "High"],
        }
      case "fire":
        return {
          title: "Fire Severity",
          gradient: "from-blue-500 to-red-500",
          labels: ["Low", "High"],
        }
      case "population":
        return {
          title: "Population Density",
          gradient: "from-yellow-400 to-purple-600",
          labels: ["Low", "High"],
        }
    }
  }

  const legendInfo = getLegendInfo()

  return (
    <TooltipProvider>
      <div className="relative h-full">
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-gray-800 p-3 rounded-full shadow-lg">
              <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
          </div>
        )}

        {/* Collapsible Layer controls */}
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
              <h3 className="text-sm font-semibold mb-2 border-b border-gray-700 pb-1 text-gray-200">Map Layers</h3>
              <div className="flex flex-col gap-3">
                <Button
                  variant={showLayers.equity ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center justify-between gap-2 w-full ${
                    showLayers.equity
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-gray-600 text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setShowLayers({ ...showLayers, equity: !showLayers.equity })}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-red-500 rounded-sm" />
                    <span>Equity Scores</span>
                  </div>
                  {showLayers.equity ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>

                <Button
                  variant={showLayers.fires ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center justify-between gap-2 w-full ${
                    showLayers.fires
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-gray-600 text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setShowLayers({ ...showLayers, fires: !showLayers.fires })}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 opacity-60 rounded-sm" />
                    <span>Fire Perimeters</span>
                  </div>
                  {showLayers.fires ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>

                <Button
                  variant={showTimelineControls ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center justify-between gap-2 w-full ${
                    showTimelineControls
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-gray-600 text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setShowTimelineControls(!showTimelineControls)}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Timeline</span>
                  </div>
                </Button>

                <div className="border-t border-gray-700 pt-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.setView([37.8, -119.4], 6)
                      }
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span>Reset View</span>
                  </Button>
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
        </div>

        {/* Improved Legend - Collapsible */}
        {showLegendPanel && (
          <div className="absolute bottom-4 right-4 bg-gray-800/90 p-4 rounded-md shadow-md z-10 max-w-xs border border-gray-700 backdrop-blur-sm">
            <h3 className="text-base font-semibold mb-3 border-b border-gray-700 pb-1 text-gray-200">Map Legend</h3>

            {showLayers.equity && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 text-gray-200">Equity Score</h4>
                <div className="flex items-center mb-1">
                  <div className="w-full h-6 bg-gradient-to-r from-green-500 to-red-500 rounded" />
                </div>
                <div className="flex justify-between text-xs">
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-gray-200">Low Risk</span>
                    <span className="text-green-400">&lt; 70</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-gray-200">Medium</span>
                    <span className="text-yellow-400">70-85</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-gray-200">High Risk</span>
                    <span className="text-red-400">&gt; 85</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Higher scores indicate communities with greater recovery challenges
                </p>
              </div>
            )}

            {showLayers.fires && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-200">Fire Perimeters</h4>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 opacity-30 border border-red-600 rounded" />
                  <div className="text-xs text-gray-300">
                    <div>Historical fire boundaries</div>
                    <div className="text-gray-400">Use timeline to view by year</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fire Timeline Slider - Now in a collapsible panel */}
        {showTimelineControls && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-gray-800/90 p-3 rounded-md shadow-md z-10 w-64 border border-gray-700 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-200">Fire Progression</h3>
              <span className="text-sm font-medium text-gray-200">{year}</span>
            </div>
            <input
              type="range"
              min="2018"
              max="2023"
              step="1"
              value={year}
              onChange={handleTimelineChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-1 text-gray-400">
              <span>2018</span>
              <span>2020</span>
              <span>2023</span>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
