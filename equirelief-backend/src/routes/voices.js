const express = require('express');
const router = express.Router();
const voiceData = require('../data/voice-data');

// GET /api/voices - Get all voice testimonials
router.get('/', (req, res) => {
  try {
    // Add timestamps to the voice data
    const voices = voiceData.map(voice => ({
      ...voice,
      timestamp: getRandomTimestamp()
    }));
    res.json(voices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch voices' });
  }
});

// GET /api/voices/:id - Get a specific voice by ID
router.get('/:id', (req, res) => {
  try {
    const voice = voiceData.find(v => v.id === req.params.id);
    if (!voice) return res.status(404).json({ error: 'Voice not found' });
    
    // Add timestamp to the voice data
    const voiceWithTimestamp = {
      ...voice,
      timestamp: getRandomTimestamp()
    };
    
    res.json(voiceWithTimestamp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch voice' });
  }
});

// Helper function to generate random timestamps
function getRandomTimestamp() {
  const units = ['minutes', 'hours', 'days'];
  const unit = units[Math.floor(Math.random() * units.length)];
  const value = Math.floor(Math.random() * 12) + 1;
  return `${value} ${unit} ago`;
}

module.exports = router;
