"use client"

import { useState } from "react"
import Dashboard from "@/components/dashboard"
import MapView from "@/components/map-view"
import type { EquityData, FirePerimeter } from "@/types/data-types"

// Embed the data directly in the component
import equityDataRaw from "../public/data/equity_data.json"
import firePerimetersRaw from "../public/data/fire_perimeters.geojson"

// Type assertion
const equityData = equityDataRaw as unknown as EquityData[]
const firePerimeters = (firePerimetersRaw as any).features as FirePerimeter[]

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    renterPct: 0,
    elderlyPct: 0,
    lepPct: 0,
    maxIncome: 100000,
  })

  const filteredData = equityData.filter(
    (item) =>
      item.renter_pct >= filters.renterPct &&
      item.elderly_pct >= filters.elderlyPct &&
      item.LEP_pct >= filters.lepPct &&
      item.income <= filters.maxIncome,
  )

  // Sort by equity score (descending) and take top 10
  const topVulnerableZips = [...filteredData].sort((a, b) => b.equity_score - a.equity_score).slice(0, 10)

  return (
    <main className="flex flex-col md:flex-row h-screen bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-2xl font-semibold text-gray-700">Loading EquiRelief data...</div>
        </div>
      ) : (
        <>
          <div className="w-full md:w-[30%] h-[50vh] md:h-screen overflow-auto p-4 bg-white shadow-md">
            <Dashboard
              equityData={filteredData}
              topVulnerableZips={topVulnerableZips}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
          <div className="w-full md:w-[70%] h-[50vh] md:h-screen">
            <MapView equityData={filteredData} firePerimeters={firePerimeters} />
          </div>
        </>
      )}
    </main>
  )
}
