"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Mic, X, Play, Pause, ArrowLeft, Volume2, Clock, MapPin, AlertTriangle, Heart, BarChart4 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { VoicePin } from "@/types/data-types"

interface VoicesProps {
  voicePins: VoicePin[]
  setSidebarOpen: (open: boolean) => void
  sidebarOpen: boolean
  sidebarPosition: "left" | "right"
  selectedPin: VoicePin | null
  setSelectedPin: (pin: VoicePin | null) => void
}

export default function Voices({
  voicePins,
  setSidebarOpen,
  sidebarOpen,
  sidebarPosition,
  selectedPin,
  setSelectedPin,
}: VoicesProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  const categories = ["Urgent Help", "Emotional Testimony", "Pet Missing", "Needs Shelter"]

  // Function to handle audio playback using our backend TTS API
  const togglePlayback = async (transcript: string) => {
    try {
      if (isPlaying) {
        // If already playing, just stop
        setIsPlaying(false);
        return;
      }
      
      setIsPlaying(true);
      
      // Call our backend TTS API
      const response = await fetch('http://localhost:4000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript })
      });
      
      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }
      
      // Convert response to audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and play audio
      const audio = new Audio(audioUrl);
      
      // Set up event listeners
      audio.onended = () => {
        setIsPlaying(false);
        // Clean up the URL object to prevent memory leaks
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        console.error('Audio playback error');
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      // Play the audio
      audio.play().catch(error => {
        console.error('Failed to play audio:', error);
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      });
      
      // Safety timeout in case onended doesn't fire
      setTimeout(() => {
        if (isPlaying) {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        }
      }, 30000); // 30 second safety timeout
    } catch (error) {
      console.error('Error playing voice:', error);
      setIsPlaying(false);
    }
  }

  // Get color for category (copied from voices-map.tsx)
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

  // Get icon for category (copied from voices-map.tsx)
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

  // Add this function to toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Count voices by category
  const countByCategory = (category: string) => {
    return voicePins.filter((pin) => pin.category === category).length
  }

  // Add these helper functions inside the component, before the return statement
  const getMockLocation = (pin: VoicePin) => {
    // Mock locations based on coordinates
    if (pin.lat > 37 && pin.lat < 38 && pin.lng < -122) {
      return "Near San Francisco, CA"
    } else if (pin.lat > 34 && pin.lat < 35 && pin.lng < -118) {
      return "Near Los Angeles, CA"
    } else if (pin.lat > 38 && pin.lat < 39 && pin.lng < -121) {
      return "Near Sacramento, CA"
    } else if (pin.lat > 37 && pin.lat < 38 && pin.lng < -121) {
      return "Near San Jose, CA"
    } else if (pin.lat > 32 && pin.lat < 33 && pin.lng < -117) {
      return "Near San Diego, CA"
    } else {
      return "Northern California"
    }
  }

  const getEmotionForVoice = (pin: VoicePin) => {
    // Mock emotions based on content
    if (pin.transcript.toLowerCase().includes("help") || pin.transcript.toLowerCase().includes("trapped")) {
      return "😨 Fear"
    } else if (pin.transcript.toLowerCase().includes("lost") || pin.transcript.toLowerCase().includes("gone")) {
      return "😢 Sadness"
    } else if (pin.transcript.toLowerCase().includes("amazing") || pin.transcript.toLowerCase().includes("helping")) {
      return "❤️ Solidarity"
    } else if (pin.transcript.toLowerCase().includes("need") || pin.transcript.toLowerCase().includes("shelter")) {
      return "😟 Concern"
    } else if (
      pin.transcript.toLowerCase().includes("missing") ||
      pin.transcript.toLowerCase().includes("dog") ||
      pin.transcript.toLowerCase().includes("cat")
    ) {
      return "🔍 Searching"
    } else {
      return "🗣️ Testimony"
    }
  }

  const getSentimentForVoice = (pin: VoicePin) => {
    // Mock sentiment scores based on content
    if (pin.category === "Urgent Help") {
      return "-0.82 (Negative)"
    } else if (pin.category === "Emotional Testimony") {
      if (pin.transcript.toLowerCase().includes("amazing") || pin.transcript.toLowerCase().includes("helping")) {
        return "+0.73 (Positive)"
      } else {
        return "-0.65 (Negative)"
      }
    } else if (pin.category === "Pet Missing") {
      return "-0.45 (Negative)"
    } else if (pin.category === "Needs Shelter") {
      return "-0.58 (Negative)"
    } else {
      return "0.0 (Neutral)"
    }
  }

  const getHumanizedCaller = (pin: VoicePin) => {
    // Mock humanized caller descriptions
    const id = Number.parseInt(pin.id.replace("voice", ""))

    if (id % 4 === 0) {
      return "Anonymous Caller from Central Valley"
    } else if (id % 4 === 1) {
      return "Elderly Resident, Northern CA"
    } else if (id % 4 === 2) {
      return "Family Member, Evacuation Zone"
    } else {
      return "Community Volunteer"
    }
  }

  const getCallerMetadata = (pin: VoicePin) => {
    // Mock caller metadata
    const id = Number.parseInt(pin.id.replace("voice", ""))

    if (id % 3 === 0) {
      return "Verified location • First report"
    } else if (id % 3 === 1) {
      return "Multiple reports • Priority call"
    } else {
      return "Follow-up report • Verified"
    }
  }

  const getAudioDuration = (pin: VoicePin) => {
    // Mock audio durations
    const id = Number.parseInt(pin.id.replace("voice", ""))
    return 15 + (id % 30) // Between 15 and 44 seconds
  }

  const getTagsForVoice = (pin: VoicePin) => {
    // Generate 2-4 tags based on voice content
    const tags = []

    // Always add category as first tag
    if (pin.category === "Urgent Help") {
      tags.push({ label: "Urgent", icon: "🟥", color: "#ef4444" })
    } else if (pin.category === "Emotional Testimony") {
      tags.push({ label: "Emotional", icon: "🟪", color: "#8b5cf6" })
    } else if (pin.category === "Pet Missing") {
      tags.push({ label: "Missing Pet", icon: "🟨", color: "#f59e0b" })
    } else if (pin.category === "Needs Shelter") {
      tags.push({ label: "Needs Shelter", icon: "🟦", color: "#3b82f6" })
    }

    // Add wildfire tag for most
    tags.push({ label: "Wildfire", icon: "🔥", color: "#dc2626" })

    // Add content-specific tags
    if (pin.transcript.toLowerCase().includes("water") || pin.transcript.toLowerCase().includes("trapped")) {
      tags.push({ label: "Rescue Needed", icon: "🚨", color: "#b91c1c" })
    }

    if (
      pin.transcript.toLowerCase().includes("amazing") ||
      pin.transcript.toLowerCase().includes("helping") ||
      pin.transcript.toLowerCase().includes("community")
    ) {
      tags.push({ label: "Community Story", icon: "👥", color: "#059669" })
    }

    if (pin.transcript.toLowerCase().includes("elderly") || pin.transcript.toLowerCase().includes("neighbor")) {
      tags.push({ label: "Vulnerable Person", icon: "👴", color: "#9333ea" })
    }

    if (
      pin.transcript.toLowerCase().includes("dog") ||
      pin.transcript.toLowerCase().includes("cat") ||
      pin.transcript.toLowerCase().includes("pet")
    ) {
      tags.push({ label: "Animal", icon: "🐾", color: "#d97706" })
    }

    if (pin.transcript.toLowerCase().includes("family") || pin.transcript.toLowerCase().includes("children")) {
      tags.push({ label: "Family", icon: "👪", color: "#2563eb" })
    }

    // Limit to 4 tags maximum
    return tags.slice(0, 4)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center md:hidden">
        <h2 className="font-semibold text-white">Community Voices</h2>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-gray-400">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="p-4 space-y-4 overflow-auto">
        {selectedPin ? (
          // Voice detail view when a pin is selected
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Voice Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPin(null)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Enhanced Voice Details Card */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700 shadow-lg">
              {/* Header Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-10 rounded-full"
                    style={{ backgroundColor: getColorForCategory(selectedPin.category) }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-white">
                        {getCategoryIcon(selectedPin.category)} {selectedPin.category}
                      </span>
                      {/* Urgency Badge */}
                      <Badge
                        className={`ml-auto ${
                          selectedPin.category === "Urgent Help"
                            ? "bg-red-600 text-white"
                            : selectedPin.category === "Needs Shelter"
                              ? "bg-orange-600 text-white"
                              : "bg-gray-600 text-gray-200"
                        }`}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Urgency:{" "}
                        {selectedPin.category === "Urgent Help"
                          ? "HIGH"
                          : selectedPin.category === "Needs Shelter"
                            ? "MEDIUM"
                            : "LOW"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{selectedPin.timestamp}</span>
                      <span className="mx-1">|</span>
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{getMockLocation(selectedPin)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcript Section */}
              <div className="mt-4 p-4 bg-gray-900/50 rounded-md border border-gray-700">
                <div className="text-gray-200 text-base leading-relaxed">"{selectedPin.transcript}"</div>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center text-sm">
                    <Heart className="h-4 w-4 mr-1 text-pink-400" />
                    <span className="text-gray-300">Emotion: {getEmotionForVoice(selectedPin)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <BarChart4 className="h-4 w-4 mr-1 text-blue-400" />
                    <span className="text-gray-300">Sentiment: {getSentimentForVoice(selectedPin)}</span>
                  </div>
                </div>
              </div>

              {/* Caller Details */}
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                  👤
                </div>
                <div className="ml-3">
                  <div className="text-gray-200 font-medium">{getHumanizedCaller(selectedPin)}</div>
                  <div className="text-sm text-gray-400">{getCallerMetadata(selectedPin)}</div>
                </div>
              </div>

              {/* Enhanced Audio Player */}
              <div className="mt-4 p-3 bg-gray-800 rounded-md border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 h-8 w-8 p-0 rounded-full"
                      onClick={() => selectedPin && togglePlayback(selectedPin.transcript)}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <div className="ml-3">
                      <Volume2 className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Waveform Animation (simplified) */}
                  <div className="flex-1 mx-4 h-6 flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-full bg-blue-500 transition-all duration-300 ${isPlaying ? "animate-pulse" : ""}`}
                        style={{ width: isPlaying ? "60%" : "0%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">0:{getAudioDuration(selectedPin)} sec</div>
                </div>
              </div>

              {/* Tag Bubble Row */}
              <div className="mt-4 flex flex-wrap gap-2">
                {getTagsForVoice(selectedPin).map((tag, index) => (
                  <Badge key={index} className="px-3 py-1 text-xs font-medium" style={{ backgroundColor: tag.color }}>
                    {tag.icon} {tag.label}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPin(null)}
              className="w-full border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Voice Filters
            </Button>
          </div>
        ) : (
          // Original filter view when no pin is selected
          <>
            {/* Callout */}
            <div className="bg-gray-800 border-l-4 border-blue-500 p-4 rounded-r-md">
              <p className="text-gray-200 italic">
                "Disasters aren't just numbers. Listen to the people affected — in their own voices."
              </p>
            </div>

            {/* Filters */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Filter Voices</CardTitle>
                <CardDescription className="text-gray-400">
                  Select categories to filter community voices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200"
                      >
                        {category}
                      </label>
                    </div>
                    <span className="text-sm text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">
                      {countByCategory(category)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Voice Button */}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Mic className="h-4 w-4 mr-2" />
              Submit Your Voice
            </Button>

            {/* Voice Statistics */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Voice Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Voices:</span>
                    <span className="text-white font-medium">{voicePins.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Urgent Help:</span>
                    <span className="text-white font-medium">
                      {voicePins.filter((pin) => pin.category === "Urgent Help").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Needs Shelter:</span>
                    <span className="text-white font-medium">
                      {voicePins.filter((pin) => pin.category === "Needs Shelter").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last 24 hours:</span>
                    <span className="text-white font-medium">{voicePins.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {voicePins.slice(0, 3).map((pin) => (
                    <div
                      key={pin.id}
                      className="border-l-2 pl-3 py-1"
                      style={{ borderColor: getColorForCategory(pin.category) }}
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-200">{pin.category}</span>
                        <span className="text-xs text-gray-400">{pin.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1 line-clamp-2">{pin.transcript}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
