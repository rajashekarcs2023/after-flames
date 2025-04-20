const mongoose = require('mongoose');

const geometrySchema = new mongoose.Schema({
  type: { type: String, enum: ['Polygon'], required: true },
  coordinates: { type: [[[Number]]], required: true }
}, { _id: false });

const equityDataSchema = new mongoose.Schema({
  zip: { type: String, required: true, unique: true },
  renter_pct: Number,
  elderly_pct: Number,
  LEP_pct: Number,
  income: Number,
  disabled_pct: Number,
  shelter_access_score: Number,
  disaster_history: Number,
  equity_score: Number,
  recommendation: String,
  geometry: geometrySchema
});

module.exports = mongoose.model('EquityData', equityDataSchema);
