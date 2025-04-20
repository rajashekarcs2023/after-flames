require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const equityDataRoutes = require('./routes/equityData');
const firePerimetersRoutes = require('./routes/firePerimeters');
const recommendationsRoutes = require('./routes/recommendations');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/equity-data', equityDataRoutes);
app.use('/api/fire-perimeters', firePerimetersRoutes);
app.use('/api/recommendations', recommendationsRoutes);

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
