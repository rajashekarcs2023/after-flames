"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import type { EquityData } from "@/types/data-types"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
  data: EquityData[]
}

export function BarChart({ data }: BarChartProps) {
  // Sort by equity score and take top 5
  const topZips = [...data]
    .sort((a, b) => {
      const scoreA = a.calculated_equity_score || a.equity_score
      const scoreB = b.calculated_equity_score || b.equity_score
      return scoreB - scoreA
    })
    .slice(0, 5)

  const chartData = {
    labels: topZips.map((item) => item.zip),
    datasets: [
      {
        label: "Equity Score",
        data: topZips.map((item) => item.calculated_equity_score || item.equity_score),
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Top 5 Vulnerable ZIP Codes",
      },
      tooltip: {
        callbacks: {
          label: (context) => `Equity Score: ${context.parsed.y.toFixed(1)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: Math.floor(Math.min(...topZips.map((item) => item.calculated_equity_score || item.equity_score)) - 5),
        max: 100,
        title: {
          display: true,
          text: "Equity Score",
        },
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
