const express = require('express');
const router = express.Router();
const FirePerimeter = require('../models/firePerimeter');

// GET /api/fire-perimeters
router.get('/', async (req, res) => {
  try {
    const perimeters = await FirePerimeter.find();
    res.json(perimeters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fire perimeters' });
  }
});

module.exports = router;
