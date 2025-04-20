const mongoose = require('mongoose');

const voiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Urgent Help', 'Emotional Testimony', 'Pet Missing', 'Needs Shelter']
  },
  transcript: { type: String, required: true },
  audioURL: { type: String, required: true },
  timestamp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Voice = mongoose.model('Voice', voiceSchema);

module.exports = Voice;
