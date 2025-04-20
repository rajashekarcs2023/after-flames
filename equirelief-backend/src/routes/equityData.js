const express = require('express');
const router = express.Router();
const EquityData = require('../models/equityData');

// GET /api/equity-data?minScore=70
router.get('/', async (req, res) => {
  try {
    const minScore = req.query.minScore ? parseFloat(req.query.minScore) : null;
    const filter = minScore ? { equity_score: { $gte: minScore } } : {};
    const data = await EquityData.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch equity data' });
  }
});

// GET /api/equity-data/:zip
router.get('/:zip', async (req, res) => {
  try {
    const entry = await EquityData.findOne({ zip: req.params.zip });
    if (!entry) return res.status(404).json({ error: 'ZIP not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ZIP data' });
  }
});

// POST /api/equity-data/calculate
router.post('/calculate', (req, res) => {
  const { renter_pct, elderly_pct, LEP_pct, income, renterWeight = 1, elderlyWeight = 1, lepWeight = 1, incomeWeight = 1 } = req.body;
  if ([renter_pct, elderly_pct, LEP_pct, income].some(x => typeof x !== 'number')) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  let score = (renterWeight * renter_pct / 25) + (elderlyWeight * elderly_pct / 10) + (lepWeight * LEP_pct / 15) - (incomeWeight * income / 10000);
  // Normalize to 0-100
  score = Math.max(0, Math.min(100, score * 10));
  res.json({ equity_score: Math.round(score * 10) / 10 });
});

module.exports = router;
