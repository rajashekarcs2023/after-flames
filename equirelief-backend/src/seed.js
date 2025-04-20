require('dotenv').config();
const mongoose = require('mongoose');
const EquityData = require('./models/equityData');
const FirePerimeter = require('./models/firePerimeter');

const equityDataSeed = [
  {
    zip: "90011",
    renter_pct: 72,
    elderly_pct: 19,
    LEP_pct: 41,
    income: 32000,
    disabled_pct: 13,
    shelter_access_score: 2,
    disaster_history: 3,
    equity_score: 91.2,
    recommendation: "Deploy bilingual medical units, prioritize renter support, and open shelters",
    geometry: {
      type: "Polygon",
      coordinates: [[[ -118.254, 33.985 ], [ -118.248, 33.985 ], [ -118.248, 33.990 ], [ -118.254, 33.990 ], [ -118.254, 33.985 ]]]
    }
  },
  {
    zip: "95823",
    renter_pct: 58,
    elderly_pct: 15,
    LEP_pct: 28,
    income: 47000,
    disabled_pct: 10,
    shelter_access_score: 3,
    disaster_history: 2,
    equity_score: 74.5,
    recommendation: "Provide translation support, renter aid, and coordinate accessible transport",
    geometry: {
      type: "Polygon",
      coordinates: [[[ -121.450, 38.475 ], [ -121.445, 38.475 ], [ -121.445, 38.480 ], [ -121.450, 38.480 ], [ -121.450, 38.475 ]]]
    }
  },
  {
    zip: "94112",
    renter_pct: 45,
    elderly_pct: 28,
    LEP_pct: 22,
    income: 54000,
    disabled_pct: 9,
    shelter_access_score: 4,
    disaster_history: 1,
    equity_score: 61.7,
    recommendation: "Ensure elderly care facilities and basic shelter access",
    geometry: {
      type: "Polygon",
      coordinates: [[[ -122.444, 37.721 ], [ -122.439, 37.721 ], [ -122.439, 37.725 ], [ -122.444, 37.725 ], [ -122.444, 37.721 ]]]
    }
  }
];

const firePerimetersSeed = [
  {
    name: "Ridgeview Fire",
    year: 2023,
    acres: 15000,
    start_date: "2023-08-10T00:00:00Z",
    contained_date: "2023-08-15T00:00:00Z",
    status: "contained",
    geometry: {
      type: "Polygon",
      coordinates: [[[ -121.455, 38.470 ], [ -121.440, 38.470 ], [ -121.440, 38.485 ], [ -121.455, 38.485 ], [ -121.455, 38.470 ]]]
    }
  },
  {
    name: "Mesa Blaze",
    year: 2024,
    acres: 32000,
    start_date: "2024-07-20T00:00:00Z",
    status: "active",
    geometry: {
      type: "Polygon",
      coordinates: [[[ -118.260, 33.980 ], [ -118.240, 33.980 ], [ -118.240, 33.995 ], [ -118.260, 33.995 ], [ -118.260, 33.980 ]]]
    }
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await EquityData.deleteMany({});
  await FirePerimeter.deleteMany({});
  await EquityData.insertMany(equityDataSeed);
  await FirePerimeter.insertMany(firePerimetersSeed);
  console.log('Database seeded!');
  mongoose.disconnect();
}

seed();
