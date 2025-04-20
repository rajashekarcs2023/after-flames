"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart } from "@/components/charts/bar-chart"
import { RadarChart } from "@/components/charts/radar-chart"
import type { EquityData } from "@/types/data-types"

interface DataVisualizationProps {
  equityData: EquityData[]
  selectedZipData: EquityData | null
}

export function DataVisualization({ equityData, selectedZipData }: DataVisualizationProps) {
  const [activeTab, setActiveTab] = useState("bar")

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Data Visualization</CardTitle>
        <CardDescription>Explore equity data through charts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="bar">Top 5 ZIP Codes</TabsTrigger>
            <TabsTrigger value="radar" disabled={!selectedZipData}>
              Vulnerability Comparison
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bar" className="h-64">
            <BarChart data={equityData} />
          </TabsContent>
          <TabsContent value="radar" className="h-64">
            <RadarChart data={selectedZipData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
