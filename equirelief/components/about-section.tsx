"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AboutSectionProps {
  onClose: () => void
}

export function AboutSection({ onClose }: AboutSectionProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-gray-800 border-gray-700 text-gray-200">
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-white">About EquiRelief</CardTitle>
          <CardDescription className="text-gray-400">Equity-focused wildfire recovery planning tool</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            EquiRelief is an equity-first wildfire recovery dashboard designed for California. It overlays fire zones
            with demographic vulnerability—like renters, elderly, LEP, and income—to help state agencies prioritize
            recovery where it's needed most.
          </p>

          <p className="text-gray-300">This project was built to ensure disaster recovery isn't just fast—but fair.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-700 p-4 rounded-md">
              <h3 className="font-bold text-lg mb-2 text-white">Key Features</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                <li>Interactive map of fire perimeters and vulnerable communities</li>
                <li>Equity scoring based on demographic vulnerability factors</li>
                <li>Customizable weighting system for different vulnerability factors</li>
                <li>AI-style recommendations for targeted recovery efforts</li>
                <li>Exportable recovery plans for field implementation</li>
                <li>Case studies demonstrating the importance of equity in recovery</li>
                <li>Community voices map with first-hand accounts</li>
              </ul>
            </div>

            <div className="bg-gray-700 p-4 rounded-md">
              <h3 className="font-bold text-lg mb-2 text-white">Data Sources</h3>
              <p className="text-sm mb-2 text-gray-300">
                EquiRelief combines multiple data sources to create a comprehensive view of vulnerability:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                <li>Census demographic data (income, age, language, housing)</li>
                <li>CalFire historical fire perimeter data</li>
                <li>FEMA disaster recovery timelines</li>
                <li>California Office of Emergency Services (Cal OES) resources</li>
                <li>Local vulnerability assessments</li>
                <li>Community voice recordings and testimonials</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-900/30 p-4 rounded-md mt-4 border border-blue-800">
            <h3 className="font-bold text-lg mb-2 text-white">How to Use EquiRelief</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-300">
              <li>
                <span className="font-medium text-gray-200">Explore the Map:</span> View fire perimeters and ZIP code
                regions colored by equity score.
              </li>
              <li>
                <span className="font-medium text-gray-200">Adjust Filters:</span> Use demographic filters to focus on
                specific vulnerability factors.
              </li>
              <li>
                <span className="font-medium text-gray-200">Customize Weights:</span> Adjust the importance of different
                factors based on your agency's priorities.
              </li>
              <li>
                <span className="font-medium text-gray-200">Select ZIP Codes:</span> Click on regions to see detailed
                recommendations.
              </li>
              <li>
                <span className="font-medium text-gray-200">Export Recovery Plan:</span> Download a CSV with prioritized
                ZIP codes and recommendations.
              </li>
              <li>
                <span className="font-medium text-gray-200">Listen to Voices:</span> Hear first-hand accounts from
                community members affected by wildfires.
              </li>
            </ol>
          </div>

          <div className="border-t border-gray-700 pt-4 mt-6">
            <p className="text-center text-sm text-gray-400">
              EquiRelief v2.0 | Developed for California Wildfire Recovery Planning
              <br />© 2023 EquiRelief Team | Contact: info@equirelief.org
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
