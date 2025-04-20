"use client"

import { useState, useEffect } from "react"
import Dashboard from "@/components/dashboard"
import MapViewDynamic from "@/components/MapViewDynamic"
import Voices from "@/components/voices"
import { CaseStudyPanel } from "@/components/case-study-panel"
import { AboutSection } from "@/components/about-section"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, AlertTriangle, Volume2 } from "lucide-react"
import type { EquityData, FirePerimeter, VoicePin } from "@/types/data-types"
import VoicesMap from "@/components/voices-map"

// Enhanced mock data with additional fields
const equityData: EquityData[] = [
  {
    zip: "95818",
    renter_pct: 54,
    elderly_pct: 22,
    no_vehicle_pct: 11,
    LEP_pct: 19,
    income: 48000,
    disabled_pct: 12,
    shelter_access_score: 3,
    disaster_history: 1,
    equity_score: 86.2,
    recommendation: "Prioritize elderly services and transportation assistance",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-121.5, 38.5],
          [-121.4, 38.5],
          [-121.4, 38.6],
          [-121.5, 38.6],
          [-121.5, 38.5],
        ],
      ],
    },
  },
  {
    zip: "94110",
    renter_pct: 65,
    elderly_pct: 15,
    no_vehicle_pct: 25,
    LEP_pct: 28,
    income: 52000,
    disabled_pct: 10,
    shelter_access_score: 4,
    disaster_history: 1,
    equity_score: 78.5,
    recommendation: "Prioritize renter relief and multilingual support services",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-122.42, 37.75],
          [-122.4, 37.75],
          [-122.4, 37.76],
          [-122.42, 37.76],
          [-122.42, 37.75],
        ],
      ],
    },
  },
  {
    zip: "90011",
    renter_pct: 72,
    elderly_pct: 19,
    no_vehicle_pct: 32,
    LEP_pct: 40,
    income: 36000,
    disabled_pct: 14,
    shelter_access_score: 2,
    disaster_history: 3,
    equity_score: 92.1,
    recommendation: "Deploy bilingual mobile unit, prioritize renters, and open shelters",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-118.25, 34.0],
          [-118.24, 34.0],
          [-118.24, 34.01],
          [-118.25, 34.01],
          [-118.25, 34.0],
        ],
      ],
    },
  },
  {
    zip: "93701",
    renter_pct: 68,
    elderly_pct: 18,
    no_vehicle_pct: 28,
    LEP_pct: 32,
    income: 32000,
    disabled_pct: 15,
    shelter_access_score: 2,
    disaster_history: 2,
    equity_score: 89.7,
    recommendation: "Deploy bilingual support teams and prioritize renter assistance",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-119.8, 36.75],
          [-119.78, 36.75],
          [-119.78, 36.77],
          [-119.8, 36.77],
          [-119.8, 36.75],
        ],
      ],
    },
  },
  {
    zip: "95814",
    renter_pct: 82,
    elderly_pct: 14,
    no_vehicle_pct: 18,
    LEP_pct: 22,
    income: 42000,
    disabled_pct: 11,
    shelter_access_score: 3,
    disaster_history: 1,
    equity_score: 76.3,
    recommendation: "Prioritize renter relief and temporary housing solutions",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-121.51, 38.58],
          [-121.49, 38.58],
          [-121.49, 38.59],
          [-121.51, 38.59],
          [-121.51, 38.58],
        ],
      ],
    },
  },
  {
    zip: "92507",
    renter_pct: 58,
    elderly_pct: 16,
    no_vehicle_pct: 15,
    LEP_pct: 26,
    income: 45000,
    disabled_pct: 9,
    shelter_access_score: 3,
    disaster_history: 1,
    equity_score: 72.8,
    recommendation: "Provide multilingual support and transportation assistance",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-117.35, 33.96],
          [-117.33, 33.96],
          [-117.33, 33.98],
          [-117.35, 33.98],
          [-117.35, 33.96],
        ],
      ],
    },
  },
  {
    zip: "91331",
    renter_pct: 48,
    elderly_pct: 14,
    no_vehicle_pct: 12,
    LEP_pct: 38,
    income: 49000,
    disabled_pct: 10,
    shelter_access_score: 3,
    disaster_history: 1,
    equity_score: 68.5,
    recommendation: "Deploy bilingual support teams and community outreach",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-118.42, 34.25],
          [-118.4, 34.25],
          [-118.4, 34.27],
          [-118.42, 34.27],
          [-118.42, 34.25],
        ],
      ],
    },
  },
  {
    zip: "95660",
    renter_pct: 52,
    elderly_pct: 19,
    no_vehicle_pct: 14,
    LEP_pct: 21,
    income: 46000,
    disabled_pct: 12,
    shelter_access_score: 3,
    disaster_history: 1,
    equity_score: 71.2,
    recommendation: "Prioritize elderly services and transportation assistance",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-121.42, 38.66],
          [-121.4, 38.66],
          [-121.4, 38.68],
          [-121.42, 38.68],
          [-121.42, 38.66],
        ],
      ],
    },
  },
  {
    zip: "94601",
    renter_pct: 70,
    elderly_pct: 16,
    no_vehicle_pct: 30,
    LEP_pct: 42,
    income: 38000,
    disabled_pct: 13,
    shelter_access_score: 2,
    disaster_history: 2,
    equity_score: 88.3,
    recommendation: "Deploy bilingual mobile unit and prioritize renter assistance",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-122.22, 37.78],
          [-122.2, 37.78],
          [-122.2, 37.8],
          [-122.22, 37.8],
          [-122.22, 37.78],
        ],
      ],
    },
  },
  {
    zip: "92020",
    renter_pct: 62,
    elderly_pct: 18,
    no_vehicle_pct: 16,
    LEP_pct: 24,
    income: 44000,
    disabled_pct: 11,
    shelter_access_score: 3,
    disaster_history: 1,
    equity_score: 74.6,
    recommendation: "Prioritize renter relief and elderly services",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-116.98, 32.78],
          [-116.96, 32.78],
          [-116.96, 32.8],
          [-116.98, 32.8],
          [-116.98, 32.78],
        ],
      ],
    },
  },
  {
    zip: "95823",
    renter_pct: 59,
    elderly_pct: 15,
    no_vehicle_pct: 18,
    LEP_pct: 29,
    income: 41000,
    disabled_pct: 12,
    shelter_access_score: 3,
    disaster_history: 1,
    equity_score: 77.9,
    recommendation: "Provide multilingual support and transportation assistance",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-121.45, 38.48],
          [-121.43, 38.48],
          [-121.43, 38.5],
          [-121.45, 38.5],
          [-121.45, 38.48],
        ],
      ],
    },
  },
  {
    zip: "93706",
    renter_pct: 56,
    elderly_pct: 13,
    no_vehicle_pct: 22,
    LEP_pct: 36,
    income: 35000,
    disabled_pct: 14,
    shelter_access_score: 2,
    disaster_history: 2,
    equity_score: 83.7,
    recommendation: "Deploy bilingual support teams and transportation assistance",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-119.84, 36.7],
          [-119.82, 36.7],
          [-119.82, 36.72],
          [-119.84, 36.72],
          [-119.84, 36.7],
        ],
      ],
    },
  },
]

const firePerimeters: FirePerimeter[] = [
  {
    type: "Feature",
    properties: {
      name: "Dixie Fire",
      year: 2021,
      acres: 963309,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-121.5, 40.0],
          [-121.0, 40.0],
          [-121.0, 40.5],
          [-121.5, 40.5],
          [-121.5, 40.0],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      name: "August Complex",
      year: 2020,
      acres: 1032648,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-123.0, 39.5],
          [-122.5, 39.5],
          [-122.5, 40.0],
          [-123.0, 40.0],
          [-123.0, 39.5],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      name: "Creek Fire",
      year: 2020,
      acres: 379895,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-119.5, 37.0],
          [-119.0, 37.0],
          [-119.0, 37.5],
          [-119.5, 37.5],
          [-119.5, 37.0],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      name: "North Complex",
      year: 2020,
      acres: 318935,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-121.3, 39.6],
          [-120.8, 39.6],
          [-120.8, 40.0],
          [-121.3, 40.0],
          [-121.3, 39.6],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      name: "SCU Lightning Complex",
      year: 2020,
      acres: 396624,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-121.8, 37.2],
          [-121.3, 37.2],
          [-121.3, 37.7],
          [-121.8, 37.7],
          [-121.8, 37.2],
        ],
      ],
    },
  },
]

// Mock voice pins data - embedded directly to avoid fetch errors
const mockVoicePins: VoicePin[] = [
  {
    id: "voice1",
    lat: 37.7749,
    lng: -122.4194,
    category: "Urgent Help",
    transcript: "We're trapped near 12th and Elm. No water. Please help.",
    audioURL: "/mock/voice1.mp3",
    timestamp: "3 hours ago",
  },
  {
    id: "voice2",
    lat: 34.0522,
    lng: -118.2437,
    category: "Emotional Testimony",
    transcript: "I lost everything in the fire. My home of 30 years is gone.",
    audioURL: "/mock/voice2.mp3",
    timestamp: "5 hours ago",
  },
  {
    id: "voice3",
    lat: 38.5816,
    lng: -121.4944,
    category: "Pet Missing",
    transcript: "Our dog Buddy ran away during evacuation. Golden retriever with blue collar.",
    audioURL: "/mock/voice3.mp3",
    timestamp: "1 day ago",
  },
  {
    id: "voice4",
    lat: 36.7783,
    lng: -119.4179,
    category: "Needs Shelter",
    transcript: "Family of four needs shelter tonight. Currently in our car.",
    audioURL: "/mock/voice4.mp3",
    timestamp: "2 hours ago",
  },
  {
    id: "voice5",
    lat: 32.7157,
    lng: -117.1611,
    category: "Urgent Help",
    transcript: "Elderly neighbor needs medical attention. Can't reach emergency services.",
    audioURL: "/mock/voice5.mp3",
    timestamp: "1 hour ago",
  },
  {
    id: "voice6",
    lat: 37.3382,
    lng: -121.8863,
    category: "Emotional Testimony",
    transcript: "The community has been amazing. Strangers helping strangers through this disaster.",
    audioURL: "/mock/voice6.mp3",
    timestamp: "6 hours ago",
  },
  {
    id: "voice7",
    lat: 33.8121,
    lng: -117.919,
    category: "Pet Missing",
    transcript: "Missing cat named Whiskers. Gray tabby last seen near evacuation center.",
    audioURL: "/mock/voice7.mp3",
    timestamp: "8 hours ago",
  },
  {
    id: "voice8",
    lat: 38.2527,
    lng: -122.04,
    category: "Needs Shelter",
    transcript: "Disabled veteran needs accessible shelter. Using wheelchair and oxygen.",
    audioURL: "/mock/voice8.mp3",
    timestamp: "4 hours ago",
  },
]

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    renterPct: 0,
    elderlyPct: 0,
    lepPct: 0,
    maxIncome: 100000,
  })
  const [weights, setWeights] = useState({
    renterWeight: 1,
    elderlyWeight: 1,
    lepWeight: 1,
    incomeWeight: 1,
  })
  const [selectedZip, setSelectedZip] = useState<string | null>(null)
  const [showCaseStudy, setShowCaseStudy] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  // Update the sidebar implementation to be draggable and movable
  const [sidebarWidth, setSidebarWidth] = useState(350) // Default width in pixels
  const [sidebarPosition, setSidebarPosition] = useState<"left" | "right">("left")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [voicePins] = useState<VoicePin[]>(mockVoicePins)
  const [selectedVoicePin, setSelectedVoicePin] = useState<VoicePin | null>(null)

  // Calculate equity scores based on weights
  const dataWithCalculatedScores = equityData.map((item) => {
    const calculatedScore =
      (weights.renterWeight * item.renter_pct) / 25 +
      (weights.elderlyWeight * item.elderly_pct) / 10 +
      (weights.lepWeight * item.LEP_pct) / 15 -
      (weights.incomeWeight * item.income) / 10000

    return {
      ...item,
      calculated_equity_score: Math.round(calculatedScore * 10) / 10,
    }
  })

  const filteredData = dataWithCalculatedScores.filter(
    (item) =>
      item.renter_pct >= filters.renterPct &&
      item.elderly_pct >= filters.elderlyPct &&
      item.LEP_pct >= filters.lepPct &&
      item.income <= filters.maxIncome,
  )

  // Sort by calculated equity score (descending) and take top 10
  const topVulnerableZips = [...filteredData]
    .sort((a, b) => b.calculated_equity_score - a.calculated_equity_score)
    .slice(0, 10)

  // Get selected ZIP data
  const selectedZipData = selectedZip ? (filteredData.find((item) => item.zip === selectedZip) ?? null) : null

  // Generate recommendation based on demographic data
  const generateRecommendation = (data: EquityData) => {
    const recommendations = []

    if (data.LEP_pct > 30) {
      recommendations.push("Deploy bilingual support services")
    }

    if (data.renter_pct > 60) {
      recommendations.push("Prioritize renter aid and temporary housing")
    }

    if (data.elderly_pct > 20) {
      recommendations.push("Establish accessible transportation services")
    }

    if (data.income < 40000) {
      recommendations.push("Provide financial assistance resources")
    }

    if (typeof data.disabled_pct === "number" && data.disabled_pct > 12) {
      recommendations.push("Ensure ADA-compliant recovery facilities")
    }

    if (typeof data.shelter_access_score === "number" && data.shelter_access_score < 3) {
      recommendations.push("Open additional emergency shelters")
    }

    return recommendations.length > 0 ? recommendations.join("; ") : "Standard recovery protocols recommended"
  }

  // Add mouse event handlers for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      let newWidth
      if (sidebarPosition === "left") {
        newWidth = e.clientX
      } else {
        newWidth = window.innerWidth - e.clientX
      }

      // Set min and max width constraints
      newWidth = Math.max(250, Math.min(newWidth, window.innerWidth * 0.7))

      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.classList.remove("dragging")
    }

    if (isDragging) {
      document.body.classList.add("dragging")
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.classList.remove("dragging")
    }
  }, [isDragging, sidebarPosition])

  // Function to toggle sidebar position
  const toggleSidebarPosition = () => {
    setSidebarPosition(sidebarPosition === "left" ? "right" : "left")
  }

  // Function to handle double-click on the drag handle
  const handleDragHandleDoubleClick = () => {
    toggleSidebarPosition()
  }

  return (
    <main className="flex flex-col h-screen bg-gray-900 text-white">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-2xl font-semibold text-gray-300">Loading EquiRelief data...</div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center">
              <div>
                <h1 className="text-xl font-bold text-white">EquiRelief</h1>
                <p className="text-xs text-gray-400">Equity-focused wildfire recovery planning tool</p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
              <TabsList className="bg-gray-700">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="voices"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                >
                  <Volume2 className="h-4 w-4 mr-1" />
                  Voices
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCaseStudy(true)}
                className="flex items-center gap-1 border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Why Equity Matters</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAbout(true)}
                className="flex items-center gap-1 border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200"
              >
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </Button>
            </div>
          </header>

          {/* Mobile Tabs */}
          <div className="md:hidden border-b border-gray-700 bg-gray-800">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-gray-800">
                <TabsTrigger
                  value="dashboard"
                  className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="voices"
                  className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                >
                  <Volume2 className="h-4 w-4 mr-1" />
                  Voices
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden relative">
            {activeTab === "dashboard" ? (
              <>
                {/* Flexible sidebar with drag handle */}
                <div
                  className={`relative h-full transition-all duration-200 ${
                    sidebarPosition === "left" ? "order-1" : "order-2"
                  } ${sidebarOpen ? "" : "w-0 overflow-hidden"}`}
                  style={{ width: sidebarOpen ? `${sidebarWidth}px` : 0 }}
                >
                  {sidebarOpen && (
                    <div className="h-full bg-gray-800 shadow-md overflow-auto border-r border-gray-700">
                      <Dashboard
                        equityData={filteredData}
                        topVulnerableZips={topVulnerableZips}
                        filters={filters}
                        setFilters={setFilters}
                        weights={weights}
                        setWeights={setWeights}
                        selectedZip={selectedZip}
                        setSelectedZip={setSelectedZip}
                        selectedZipData={selectedZipData}
                        generateRecommendation={generateRecommendation}
                        setShowCaseStudy={setShowCaseStudy}
                        setShowAbout={setShowAbout}
                        setSidebarOpen={setSidebarOpen}
                      />
                    </div>
                  )}

                  {/* Enhanced drag handle with double-click to toggle position */}
                  {sidebarOpen && (
                    <div
                      className={`absolute top-0 ${sidebarPosition === "left" ? "right-0" : "left-0"} w-4 h-full cursor-ew-resize z-20 flex items-center justify-center`}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                      }}
                      onDoubleClick={handleDragHandleDoubleClick}
                      title="Drag to resize | Double-click to switch sides"
                    >
                      <div className="h-24 w-1.5 bg-blue-500 rounded-full opacity-60 hover:opacity-100 transition-opacity"></div>
                    </div>
                  )}
                </div>

                {/* Map */}
                <div className={`flex-1 relative ${sidebarPosition === "left" ? "order-2" : "order-1"}`}>
                  <MapViewDynamic
                    equityData={filteredData}
                    firePerimeters={firePerimeters}
                    selectedZip={selectedZip}
                    setSelectedZip={setSelectedZip}
                    useCalculatedScores={true}
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                    sidebarPosition={sidebarPosition}
                    setSidebarPosition={setSidebarPosition}
                  />
                </div>
              </>
            ) : (
              // Similar structure for Voices tab
              <>
                <div
                  className={`relative h-full transition-all duration-200 ${
                    sidebarPosition === "left" ? "order-1" : "order-2"
                  } ${sidebarOpen ? "" : "w-0 overflow-hidden"}`}
                  style={{ width: sidebarOpen ? `${sidebarWidth}px` : 0 }}
                >
                  {sidebarOpen && (
                    <div className="h-full bg-gray-800 shadow-md overflow-auto border-r border-gray-700">
                      <Voices
                        voicePins={voicePins}
                        setSidebarOpen={setSidebarOpen}
                        sidebarOpen={sidebarOpen}
                        sidebarPosition={sidebarPosition}
                        selectedPin={selectedVoicePin}
                        setSelectedPin={setSelectedVoicePin}
                      />
                    </div>
                  )}

                  {/* Enhanced drag handle with double-click to toggle position */}
                  {sidebarOpen && (
                    <div
                      className={`absolute top-0 ${sidebarPosition === "left" ? "right-0" : "left-0"} w-4 h-full cursor-ew-resize z-20 flex items-center justify-center`}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                      }}
                      onDoubleClick={handleDragHandleDoubleClick}
                      title="Drag to resize | Double-click to switch sides"
                    >
                      <div className="h-24 w-1.5 bg-blue-500 rounded-full opacity-60 hover:opacity-100 transition-opacity"></div>
                    </div>
                  )}
                </div>

                {/* Voices Map */}
                <div className={`flex-1 relative ${sidebarPosition === "left" ? "order-2" : "order-1"}`}>
                  <VoicesMap
                    voicePins={voicePins}
                    selectedCategories={[]}
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                    sidebarPosition={sidebarPosition}
                    setSidebarPosition={setSidebarPosition}
                    selectedPin={selectedVoicePin}
                    setSelectedPin={setSelectedVoicePin}
                  />
                </div>
              </>
            )}
          </div>

          {showCaseStudy && <CaseStudyPanel onClose={() => setShowCaseStudy(false)} />}

          {showAbout && <AboutSection onClose={() => setShowAbout(false)} />}
        </>
      )}
    </main>
  )
}
