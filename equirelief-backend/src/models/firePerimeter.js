const mongoose = require('mongoose');

const geometrySchema = new mongoose.Schema({
  type: { type: String, enum: ['Polygon'], required: true },
  coordinates: { type: [[[Number]]], required: true }
}, { _id: false });

const firePerimeterSchema = new mongoose.Schema({
  name: String,
  year: Number,
  acres: Number,
  start_date: String,
  contained_date: String,
  status: String,
  geometry: geometrySchema
});

module.exports = mongoose.model('FirePerimeter', firePerimeterSchema);
