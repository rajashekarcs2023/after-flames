"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

interface DemoWalkthroughProps {
  onHighlightZip: (zip: string | null) => void
  onShowCaseStudy: (show: boolean) => void
  onAdjustWeights: (weights: any) => void
  onComplete: () => void
}

export function DemoWalkthrough({
  onHighlightZip,
  onShowCaseStudy,
  onAdjustWeights,
  onComplete,
}: DemoWalkthroughProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // Reset the demo
  const resetDemo = () => {
    setIsRunning(false)
    setStep(0)
    setProgress(0)
    onHighlightZip(null)
  }

  // Start or pause the demo
  const toggleDemo = () => {
    if (isRunning) {
      setIsRunning(false)
    } else {
      setIsRunning(true)
    }
  }

  // Handle the demo steps
  useEffect(() => {
    if (!isRunning) return

    const totalSteps = 4
    const stepDuration = 5000 // 5 seconds per step
    const updateInterval = 50 // Update progress every 50ms

    // Calculate progress percentage
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (updateInterval / stepDuration) * 100
        return newProgress > 100 ? 100 : newProgress
      })
    }, updateInterval)

    // Handle step transitions
    const stepInterval = setTimeout(() => {
      if (step < totalSteps) {
        setStep((prev) => prev + 1)
        setProgress(0)

        // Execute actions based on current step
        switch (step) {
          case 0:
            // Step 1: Highlight ZIP 90011
            onHighlightZip("90011")
            break
          case 1:
            // Step 2: Adjust equity weight sliders
            onAdjustWeights({
              renterWeight: 2.5,
              elderlyWeight: 1.8,
              lepWeight: 2.2,
              incomeWeight: 1.5,
            })
            break
          case 2:
            // Step 3: Show "Why Equity Matters" modal
            onShowCaseStudy(true)
            break
          case 3:
            // Step 4: Complete demo
            setIsRunning(false)
            onComplete()
            break
        }
      }
    }, stepDuration)

    return () => {
      clearTimeout(stepInterval)
      clearInterval(progressInterval)
    }
  }, [isRunning, step, onHighlightZip, onShowCaseStudy, onAdjustWeights, onComplete])

  return (
    <div className="flex items-center gap-2">
      <Button variant="default" size="sm" onClick={toggleDemo} className="bg-blue-600 hover:bg-blue-700 text-white">
        {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
        {isRunning ? "Pause Demo" : "Run Demo Walkthrough"}
      </Button>
      {isRunning && (
        <>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetDemo}
            className="h-8 w-8 p-0 border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
