"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CaseStudyPanelProps {
  onClose: () => void
}

export function CaseStudyPanel({ onClose }: CaseStudyPanelProps) {
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
          <CardTitle className="text-white">Why Equity Matters</CardTitle>
          <CardDescription className="text-gray-400">A case study on equitable wildfire recovery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="font-bold text-lg mb-2 text-white">ZIP 90011: A Case Study</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fire Impact:</span>
                    <span className="font-medium text-gray-200">2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Renters:</span>
                    <span className="font-medium text-gray-200">72%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Limited English:</span>
                    <span className="font-medium text-gray-200">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Elderly Living Alone:</span>
                    <span className="font-medium text-gray-200">19%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recovery Time:</span>
                    <span className="font-medium text-gray-200">18 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Equity Score:</span>
                    <span className="font-medium text-red-400">92.1</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-600 p-3 rounded-md flex items-center">
                <p className="text-sm italic text-gray-200">
                  "ZIP 90011 shows how equal fire impact leads to unequal recovery. EquiRelief highlights communities
                  like this so no one is left behind."
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">Recovery Challenges</h3>

            <div className="space-y-3">
              <div className="border-l-4 border-purple-500 pl-3">
                <h4 className="font-semibold text-gray-200">Renter Displacement</h4>
                <p className="text-sm text-gray-400">
                  With 72% renters, many residents lacked insurance and faced permanent displacement when rental
                  properties were damaged. Landlords prioritized rebuilding luxury units, pricing out original
                  residents.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-3">
                <h4 className="font-semibold text-gray-200">Language Barriers</h4>
                <p className="text-sm text-gray-400">
                  40% of residents had limited English proficiency, making it difficult to navigate complex recovery
                  assistance programs. Many eligible residents never received aid due to communication barriers.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-3">
                <h4 className="font-semibold text-gray-200">Elderly Isolation</h4>
                <p className="text-sm text-gray-400">
                  19% of elderly residents lived alone and lacked transportation to reach assistance centers. Many faced
                  health complications from stress and displacement.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">How EquiRelief Helps</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-900/30 p-3 rounded-md border border-green-800">
                <h4 className="font-semibold text-green-400">Early Identification</h4>
                <p className="text-sm text-gray-300">
                  EquiRelief identifies vulnerable communities before disaster strikes, allowing agencies to prepare
                  targeted response plans.
                </p>
              </div>

              <div className="bg-blue-900/30 p-3 rounded-md border border-blue-800">
                <h4 className="font-semibold text-blue-400">Tailored Recommendations</h4>
                <p className="text-sm text-gray-300">
                  Specific recommendations based on demographic data ensure resources address the unique needs of each
                  community.
                </p>
              </div>

              <div className="bg-purple-900/30 p-3 rounded-md border border-purple-800">
                <h4 className="font-semibold text-purple-400">Resource Prioritization</h4>
                <p className="text-sm text-gray-300">
                  Equity scores help agencies allocate limited resources to communities that will face the greatest
                  recovery challenges.
                </p>
              </div>

              <div className="bg-amber-900/30 p-3 rounded-md border border-amber-800">
                <h4 className="font-semibold text-amber-400">Data-Driven Advocacy</h4>
                <p className="text-sm text-gray-300">
                  Quantifiable equity metrics provide evidence for policy changes and additional funding for vulnerable
                  areas.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4 mt-6">
            <p className="text-center font-medium text-gray-300">
              Equal disaster impact does not mean equal recovery capacity.
              <br />
              EquiRelief ensures recovery is not just fast—but fair.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
