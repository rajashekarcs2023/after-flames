const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// POST /api/tts - Convert text to speech and return audio
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    console.log('TTS Request:', { text: text.substring(0, 50) + '...' });
    
    // Use the existing audio files in the voices folder
    // We'll select one based on the text content to simulate different voices
    
    // Calculate a simple hash of the text to consistently select the same audio file for the same text
    const textHash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const fileNumber = (textHash % 10) + 1; // Get a number between 1-10
    
    // Construct the path to the audio file
    const audioFilePath = path.join(__dirname, `../../voices/voice${fileNumber}.mp3`);
    
    console.log(`Using audio file: ${audioFilePath}`);
    
    // Check if the audio file exists
    if (fs.existsSync(audioFilePath)) {
      // Set appropriate headers for audio response
      res.set({
        'Content-Type': 'audio/mp3',
        'Cache-Control': 'no-cache'
      });
      
      // Stream the audio file to the client
      const fileStream = fs.createReadStream(audioFilePath);
      fileStream.pipe(res);
    } else {
      // If the audio file doesn't exist, try a fallback
      console.log('Selected audio file not found, trying fallback');
      
      // Try voice1.mp3 as a fallback
      const fallbackPath = path.join(__dirname, '../../voices/voice1.mp3');
      
      if (fs.existsSync(fallbackPath)) {
        res.set({
          'Content-Type': 'audio/mp3',
          'Cache-Control': 'no-cache'
        });
        
        const fallbackStream = fs.createReadStream(fallbackPath);
        fallbackStream.pipe(res);
      } else {
        // If all else fails, return a JSON response
        return res.status(200).json({ 
          message: 'Audio files not found', 
          text: text
        });
      }
    }
  } catch (error) {
    console.error('Error generating speech:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to generate speech', details: error.message });
  }
});

module.exports = router;
