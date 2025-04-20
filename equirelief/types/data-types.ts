export interface EquityData {
  zip: string
  renter_pct: number
  elderly_pct: number
  no_vehicle_pct: number
  LEP_pct: number
  income: number
  disabled_pct?: number
  shelter_access_score?: number
  disaster_history?: number
  equity_score: number
  calculated_equity_score?: number
  recommendation?: string
  geometry: {
    type: string
    coordinates: number[][][]
  }
}

export interface FirePerimeter {
  type: string
  properties: {
    name: string
    year: number
    acres: number
  }
  geometry: {
    type: string
    coordinates: number[][][]
  }
}

export interface FilterState {
  renterPct: number
  elderlyPct: number
  lepPct: number
  maxIncome: number
}

export interface WeightState {
  renterWeight: number
  elderlyWeight: number
  lepWeight: number
  incomeWeight: number
}

export interface VoicePin {
  id: string
  lat: number
  lng: number
  category: string
  transcript: string
  audioURL: string
  timestamp: string
}
