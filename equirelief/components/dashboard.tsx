"use client"

import { useState } from "react"
import type { EquityData, FilterState, WeightState } from "@/types/data-types"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Sliders, Filter, ChevronRight, X, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DemoWalkthrough } from "@/components/demo-walkthrough"

interface DashboardProps {
  equityData: EquityData[]
  topVulnerableZips: EquityData[]
  filters: FilterState
  setFilters: (filters: FilterState) => void
  weights: WeightState
  setWeights: (weights: WeightState) => void
  selectedZip: string | null
  setSelectedZip: (zip: string | null) => void
  selectedZipData: EquityData | null
  generateRecommendation: (data: EquityData) => string
  setShowCaseStudy: (show: boolean) => void
  setShowAbout: (show: boolean) => void
  setSidebarOpen: (open: boolean) => void
}

export default function Dashboard({
  equityData,
  topVulnerableZips,
  filters,
  setFilters,
  weights,
  setWeights,
  selectedZip,
  setSelectedZip,
  selectedZipData,
  generateRecommendation,
  setShowCaseStudy,
  setShowAbout,
  setSidebarOpen,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showCharts, setShowCharts] = useState(false)

  const handleDownloadCSV = () => {
    // Create CSV content with enhanced fields
    const headers = [
      "ZIP",
      "Equity Score",
      "Renters %",
      "Elderly %",
      "LEP %",
      "Median Income",
      "Recovery Tags",
      "Recommendation",
    ]
    const rows = topVulnerableZips.map((item) => {
      const recommendation = item.recommendation || generateRecommendation(item)

      // Generate recovery tags
      const tags = []
      if (item.LEP_pct > 30) tags.push("Bilingual Support")
      if (item.renter_pct > 60) tags.push("Renter Aid")
      if (item.elderly_pct > 20) tags.push("Elderly Services")
      if (item.income < 40000) tags.push("Financial Aid")
      if (item.disabled_pct && item.disabled_pct > 12) tags.push("ADA Compliance")
      if (item.shelter_access_score && item.shelter_access_score < 3) tags.push("Shelter Access")

      return [
        item.zip,
        item.calculated_equity_score?.toFixed(1) || item.equity_score.toFixed(1),
        item.renter_pct,
        item.LEP_pct,
        item.income,
        `"${tags.join(", ")}"`,
        `"${recommendation}"`,
      ].join(",")
    })
    const csvContent = [headers.join(","), ...rows].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "EquiRelief_Recovery_Plan.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle demo walkthrough
  const handleDemoHighlightZip = (zip: string | null) => {
    setSelectedZip(zip)
  }

  const handleDemoAdjustWeights = (newWeights: WeightState) => {
    setWeights(newWeights)
  }

  const handleDemoComplete = () => {
    // Reset to default state after demo
    setShowCaseStudy(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center md:hidden">
        <h2 className="font-semibold text-white">Dashboard</h2>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-gray-400">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-4 py-2 border-b border-gray-700">
        <DemoWalkthrough
          onHighlightZip={handleDemoHighlightZip}
          onShowCaseStudy={setShowCaseStudy}
          onAdjustWeights={handleDemoAdjustWeights}
          onComplete={handleDemoComplete}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 border-b border-gray-700">
          <TabsList className="w-full justify-start gap-4 h-12 bg-gray-800">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="flex-1 overflow-auto p-4 space-y-4">
          {/* Top Vulnerable ZIP Codes */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-white">Top Vulnerable ZIP Codes</CardTitle>
                <div className="flex gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                      >
                        <Filter className="h-4 w-4" />
                        <span className="sr-only">Filter</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-gray-800 text-gray-200 border-l border-gray-700">
                      <SheetHeader>
                        <SheetTitle className="text-white">Filter Criteria</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-300">
                              Renters &gt; {filters.renterPct}%
                            </label>
                            <span className="text-sm text-gray-400">{filters.renterPct}%</span>
                          </div>
                          <Slider
                            value={[filters.renterPct]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => setFilters({ ...filters, renterPct: value[0] })}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-300">
                              Elderly &gt; {filters.elderlyPct}%
                            </label>
                            <span className="text-sm text-gray-400">{filters.elderlyPct}%</span>
                          </div>
                          <Slider
                            value={[filters.elderlyPct]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => setFilters({ ...filters, elderlyPct: value[0] })}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-300">
                              Limited English &gt; {filters.lepPct}%
                            </label>
                            <span className="text-sm text-gray-400">{filters.lepPct}%</span>
                          </div>
                          <Slider
                            value={[filters.lepPct]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => setFilters({ ...filters, lepPct: value[0] })}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-300">
                              Income &lt; ${filters.maxIncome.toLocaleString()}
                            </label>
                            <span className="text-sm text-gray-400">${filters.maxIncome.toLocaleString()}</span>
                          </div>
                          <Slider
                            value={[filters.maxIncome]}
                            min={20000}
                            max={100000}
                            step={1000}
                            onValueChange={(value) => setFilters({ ...filters, maxIncome: value[0] })}
                          />
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCSV}
                    className="h-8 w-8 p-0 border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download CSV</span>
                  </Button>
                </div>
              </div>
              <CardDescription className="text-gray-400">Click on a ZIP code to see recommendations</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-md overflow-hidden border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-900">
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">ZIP</TableHead>
                      <TableHead className="text-gray-300">Score</TableHead>
                      <TableHead className="text-gray-300">Renters</TableHead>
                      <TableHead className="text-gray-300">Income</TableHead>
                      <TableHead className="w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topVulnerableZips.length > 0 ? (
                      topVulnerableZips.map((item) => (
                        <TableRow
                          key={item.zip}
                          className={`cursor-pointer border-gray-700 hover:bg-gray-700 ${
                            selectedZip === item.zip ? "bg-gray-700" : ""
                          }`}
                          onClick={() => setSelectedZip(item.zip)}
                        >
                          <TableCell className="font-medium text-gray-200">{item.zip}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${
                                item.calculated_equity_score > 85
                                  ? "border-red-500 text-red-400 bg-red-900/20"
                                  : item.calculated_equity_score > 75
                                    ? "border-orange-500 text-orange-400 bg-orange-900/20"
                                    : "border-yellow-500 text-yellow-400 bg-yellow-900/20"
                              }`}
                            >
                              {item.calculated_equity_score?.toFixed(1) || item.equity_score.toFixed(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">{item.renter_pct}%</TableCell>
                          <TableCell className="text-gray-300">${(item.income / 1000).toFixed(0)}k</TableCell>
                          <TableCell>
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="border-gray-700">
                        <TableCell colSpan={5} className="text-center py-4 text-gray-400">
                          <div className="flex flex-col items-center gap-2 py-4">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <p>No results. Adjust filters to explore more areas.</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setFilters({
                                  renterPct: 0,
                                  elderlyPct: 0,
                                  lepPct: 0,
                                  maxIncome: 100000,
                                })
                              }
                              className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200"
                            >
                              Reset Filters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-0 px-0 text-xs text-gray-500 justify-center">
              Showing {topVulnerableZips.length} of {equityData.length} ZIP codes
            </CardFooter>
          </Card>

          {/* Recommendations Section */}
          {selectedZipData ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg text-white">Recovery Plan for ZIP {selectedZip}</CardTitle>
                    <CardDescription className="text-gray-400">
                      Equity Score:{" "}
                      <span
                        className={`font-medium ${
                          selectedZipData.calculated_equity_score > 85
                            ? "text-red-400"
                            : selectedZipData.calculated_equity_score > 75
                              ? "text-orange-400"
                              : "text-yellow-400"
                        }`}
                      >
                        {selectedZipData.calculated_equity_score?.toFixed(1) || selectedZipData.equity_score.toFixed(1)}
                      </span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => setSelectedZip(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-900/20 rounded-md border border-blue-800 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-300">Priority Recommendations</p>
                      <p className="text-blue-200 mt-1">
                        {selectedZipData.recommendation || generateRecommendation(selectedZipData)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedZipData.LEP_pct > 30 && (
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Bilingual Support</Badge>
                  )}
                  {selectedZipData.renter_pct > 60 && (
                    <Badge className="bg-purple-600 hover:bg-purple-700 text-white">Renter Aid Priority</Badge>
                  )}
                  {selectedZipData.elderly_pct > 20 && (
                    <Badge className="bg-amber-600 hover:bg-amber-700 text-white">Accessibility Transportation</Badge>
                  )}
                  {selectedZipData.income < 40000 && (
                    <Badge className="bg-green-600 hover:bg-green-700 text-white">Financial Assistance</Badge>
                  )}
                  {selectedZipData.disabled_pct && selectedZipData.disabled_pct > 12 && (
                    <Badge className="bg-rose-600 hover:bg-rose-700 text-white">ADA Compliance</Badge>
                  )}
                  {selectedZipData.shelter_access_score && selectedZipData.shelter_access_score < 3 && (
                    <Badge className="bg-orange-600 hover:bg-orange-700 text-white">Shelter Access</Badge>
                  )}
                </div>

                <Separator className="bg-gray-700" />

                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-200">Demographic Profile</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-400">Renters:</div>
                    <div className="font-medium text-gray-200">{selectedZipData.renter_pct}%</div>

                    <div className="text-gray-400">Elderly:</div>
                    <div className="font-medium text-gray-200">{selectedZipData.elderly_pct}%</div>

                    <div className="text-gray-400">Limited English:</div>
                    <div className="font-medium text-gray-200">{selectedZipData.LEP_pct}%</div>

                    <div className="text-gray-400">Median Income:</div>
                    <div className="font-medium text-gray-200">${selectedZipData.income.toLocaleString()}</div>

                    {selectedZipData.disabled_pct && (
                      <>
                        <div className="text-gray-400">Disabled:</div>
                        <div className="font-medium text-gray-200">{selectedZipData.disabled_pct}%</div>
                      </>
                    )}

                    {selectedZipData.shelter_access_score && (
                      <>
                        <div className="text-gray-400">Shelter Access:</div>
                        <div className="font-medium text-gray-200">{selectedZipData.shelter_access_score}/5</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => setShowCaseStudy(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View Similar Case Studies
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="text-center text-gray-400 space-y-2">
                  <p>Select a ZIP code from the table or map to see recommendations</p>
                  <p className="text-sm">
                    The most vulnerable areas are highlighted in red on the map and sorted at the top of the table
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="flex-1 overflow-auto p-4 space-y-4">
          {/* Equity Score Weights */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-white">Equity Scoring Priorities</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                >
                  <Sliders className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-gray-400">
                Adjust how different factors impact the equity score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Renters Weight</label>
                  <span className="text-sm text-gray-400">{weights.renterWeight.toFixed(1)}</span>
                </div>
                <Slider
                  value={[weights.renterWeight]}
                  min={0}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setWeights({ ...weights, renterWeight: value[0] })}
                  className="slider-green-red"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Higher values prioritize areas with more renters, who often lack insurance and face displacement
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Elderly Weight</label>
                  <span className="text-sm text-gray-400">{weights.elderlyWeight.toFixed(1)}</span>
                </div>
                <Slider
                  value={[weights.elderlyWeight]}
                  min={0}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setWeights({ ...weights, elderlyWeight: value[0] })}
                  className="slider-green-red"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Higher values prioritize areas with more elderly residents, who may need evacuation assistance
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">LEP Weight</label>
                  <span className="text-sm text-gray-400">{weights.lepWeight.toFixed(1)}</span>
                </div>
                <Slider
                  value={[weights.lepWeight]}
                  min={0}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setWeights({ ...weights, lepWeight: value[0] })}
                  className="slider-green-red"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Higher values prioritize areas with limited English proficiency, requiring multilingual support
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Income Weight (inverse)</label>
                  <span className="text-sm text-gray-400">{weights.incomeWeight.toFixed(1)}</span>
                </div>
                <Slider
                  value={[weights.incomeWeight]}
                  min={0}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setWeights({ ...weights, incomeWeight: value[0] })}
                  className="slider-green-red"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Higher values prioritize lower-income areas with fewer resources for recovery
                </p>
              </div>

              <div className="text-sm text-gray-400 mt-4 p-3 bg-gray-700 rounded-md border border-gray-600">
                <p className="font-medium mb-1 text-gray-300">Equity Score Formula:</p>
                <p className="font-mono text-xs bg-gray-900 p-2 rounded text-gray-300">
                  score = (w1 * renters/25) + (w2 * elderly/10) + (w3 * LEP/15) - (w4 * income/10000)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Data Sources & Methodology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-300">
              <p>
                EquiRelief combines demographic data from the U.S. Census with fire perimeter data from CalFire to
                identify communities most vulnerable during wildfire recovery.
              </p>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-200">Key Vulnerability Factors:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium text-gray-200">Renters</span> - Less likely to have insurance, face
                    permanent displacement
                  </li>
                  <li>
                    <span className="font-medium text-gray-200">Elderly</span> - May need evacuation assistance, face
                    health challenges
                  </li>
                  <li>
                    <span className="font-medium text-gray-200">Limited English</span> - Barriers to accessing recovery
                    resources
                  </li>
                  <li>
                    <span className="font-medium text-gray-200">Income</span> - Lower income areas have fewer recovery
                    resources
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAbout(true)}
                className="w-full border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200"
              >
                Learn More About EquiRelief
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
