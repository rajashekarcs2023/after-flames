"use client"

import { Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import type { EquityData } from "@/types/data-types"

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface RadarChartProps {
  data: EquityData | null
}

export function RadarChart({ data }: RadarChartProps) {
  // State averages (mock data)
  const stateAverages = {
    renter_pct: 45,
    elderly_pct: 15,
    LEP_pct: 20,
    income: 65000,
  }

  // Normalize income for better visualization (inverse relationship)
  const normalizeIncome = (income: number) => {
    // Higher income = lower vulnerability, so we invert the scale
    return 100 - (income / 100000) * 100
  }

  const chartData = {
    labels: ["Renters %", "Elderly %", "Limited English %", "Income Vulnerability"],
    datasets: [
      {
        label: data ? `ZIP ${data.zip}` : "Selected ZIP",
        data: data ? [data.renter_pct, data.elderly_pct, data.LEP_pct, normalizeIncome(data.income)] : [0, 0, 0, 0],
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(239, 68, 68, 1)",
      },
      {
        label: "California Average",
        data: [
          stateAverages.renter_pct,
          stateAverages.elderly_pct,
          stateAverages.LEP_pct,
          normalizeIncome(stateAverages.income),
        ],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
      },
    ],
  }

  const options: ChartOptions<"radar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Vulnerability Comparison",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ""
            const value = context.parsed.r
            if (context.label === "Income Vulnerability") {
              // Convert back to income for tooltip
              const income =
                context.datasetIndex === 0 ? data?.income.toLocaleString() : stateAverages.income.toLocaleString()
              return `${label}: $${income}`
            }
            return `${label}: ${value.toFixed(1)}%`
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  }

  return <Radar data={chartData} options={options} />
}
