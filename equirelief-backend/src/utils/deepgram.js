const fs = require('fs');
const path = require('path');
const axios = require('axios');

/**
 * Converts text to speech using Deepgram's TTS API
 * @param {string} text - The text to convert to speech
 * @param {string} filename - The filename to save the audio (without extension)
 * @param {string} model - The TTS model to use (default: 'aura-asteria-en')
 * @returns {Promise<string>} - Path to the saved audio file
 */
async function textToSpeech(text, filename, model = 'aura-asteria-en') {
  try {
    // Create the public/audio directory if it doesn't exist
    const audioDir = path.join(__dirname, '../../public/audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Make request to Deepgram API
    const response = await axios({
      method: 'POST',
      url: 'https://api.deepgram.com/v1/speak',
      headers: {
        'Authorization': `Token ${process.env.DEEPOGRAM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        text,
        model
      },
      responseType: 'arraybuffer' // Important for binary data
    });

    // Save the audio file
    const outputPath = path.join(audioDir, `${filename}.mp3`);
    fs.writeFileSync(outputPath, response.data);
    
    // Return the relative path for the frontend
    return `/audio/${filename}.mp3`;
  } catch (error) {
    console.error('Error generating speech:', error.response?.data || error.message);
    throw new Error('Failed to generate speech');
  }
}

module.exports = { textToSpeech };
