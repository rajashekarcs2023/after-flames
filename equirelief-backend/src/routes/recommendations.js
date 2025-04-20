const express = require('express');
const router = express.Router();
const EquityData = require('../models/equityData');
const { generateGeminiContent } = require('../utils/gemini');

// GET /api/recommendations/:zip
router.get('/:zip', async (req, res) => {
  try {
    const entry = await EquityData.findOne({ zip: req.params.zip });
    if (!entry) return res.status(404).json({ error: 'ZIP not found' });

    if (process.env.GEMINI_API_KEY) {
      // Compose a prompt for Gemini
      const prompt = `Given the following California ZIP code wildfire vulnerability and demographic data, generate 3-5 actionable, concise, and tailored recovery recommendations.\n\nData: ${JSON.stringify(entry)}\n\nRespond with only a JSON array of recommendations, no explanation.`;
      try {
        const geminiResponse = await generateGeminiContent(prompt);
        // Try to parse JSON array from Gemini's response
        let recommendations;
        try {
          recommendations = JSON.parse(geminiResponse);
        } catch {
          // Fallback: treat as plain text, split by newlines
          recommendations = geminiResponse.split(/\n|;|\./).map(s => s.trim()).filter(Boolean);
        }
        return res.json({ zip: entry.zip, recommendations });
      } catch (err) {
        return res.status(500).json({ error: 'Gemini API error', details: err.message });
      }
    }

    // Fallback: static recommendations
    const recommendations = [];
    if (entry.LEP_pct > 30) recommendations.push('Deploy bilingual units');
    if (entry.renter_pct > 60) recommendations.push('Temporary housing aid');
    if (entry.elderly_pct > 20) recommendations.push('Accessible evacuation');
    if (entry.income < 40000) recommendations.push('Financial assistance');
    if (recommendations.length < 3) recommendations.push('Community outreach');
    res.json({ zip: entry.zip, recommendations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

module.exports = router;
