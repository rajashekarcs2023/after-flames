require('dotenv').config();
const mongoose = require('mongoose');
const Voice = require('./models/voice');
const { textToSpeech } = require('./utils/deepgram');
const fs = require('fs');
const path = require('path');

// 10 realistic voice transcripts for wildfire victims and responders
const voiceData = [
  {
    id: "voice1",
    lat: 37.7749,
    lng: -122.4194,
    category: "Urgent Help",
    transcript: "We're trapped on Redwood Drive near the creek. The fire is moving fast and we can't get out. Our car won't start. There are three of us including my elderly mother who can't walk well. Please send help immediately.",
    timestamp: "2 hours ago"
  },
  {
    id: "voice2",
    lat: 34.0522,
    lng: -118.2437,
    category: "Emotional Testimony",
    transcript: "I lost everything in the fire. My home of 30 years, all our family photos, everything is gone. The community has been amazing though. Strangers are offering places to stay. I never thought I'd experience something like this, but the kindness of people gives me hope.",
    timestamp: "5 hours ago"
  },
  {
    id: "voice3",
    lat: 38.5816,
    lng: -121.4944,
    category: "Pet Missing",
    transcript: "Our dog Buddy ran away during evacuation. He's a golden retriever with a blue collar and he's microchipped. Last seen near the Pine Ridge evacuation center. He's a service dog for my daughter who has anxiety. Please call the number on his tag if you find him.",
    timestamp: "1 day ago"
  },
  {
    id: "voice4",
    lat: 36.7783,
    lng: -119.4179,
    category: "Needs Shelter",
    transcript: "Family of four needs shelter tonight. We were staying at the high school but it's now at capacity. We have two young children ages 3 and 5. Our home in Oak Valley was destroyed. We have a car but nowhere to go. Any information on available shelters would be appreciated.",
    timestamp: "3 hours ago"
  },
  {
    id: "voice5",
    lat: 32.7157,
    lng: -117.1611,
    category: "Urgent Help",
    transcript: "My neighbor Mrs. Garcia is still in her house on Maple Street. She's 87 and refused to evacuate. I couldn't convince her to leave. She has mobility issues and lives alone. The fire is getting closer to that area. Please send someone to help her.",
    timestamp: "1 hour ago"
  },
  {
    id: "voice6",
    lat: 37.3382,
    lng: -121.8863,
    category: "Emotional Testimony",
    transcript: "I'm a firefighter with Station 12. We've been working 72 hours straight. The community support has been incredible. People bringing food, water, even clean socks. It's these small acts of kindness that keep us going. We're making progress but please stay evacuated until it's safe.",
    timestamp: "6 hours ago"
  },
  {
    id: "voice7",
    lat: 33.8121,
    lng: -117.919,
    category: "Pet Missing",
    transcript: "Missing cat named Whiskers. Gray tabby last seen near the Pinecrest evacuation center. She's an indoor cat and very scared of noises. She was in a carrier but got spooked and escaped when we were evacuating. She's microchipped and wearing a purple collar.",
    timestamp: "8 hours ago"
  },
  {
    id: "voice8",
    lat: 38.2527,
    lng: -122.04,
    category: "Needs Shelter",
    transcript: "I'm a disabled veteran in need of accessible shelter. I use a wheelchair and require oxygen. The motel I was staying at lost power and I need electricity for my medical equipment. I have transportation but need somewhere with power and wheelchair access.",
    timestamp: "4 hours ago"
  },
  {
    id: "voice9",
    lat: 39.5296,
    lng: -119.8138,
    category: "Urgent Help",
    transcript: "There's a downed power line blocking Cedar Road just past the intersection with Highway 20. It's sparking and could start another fire. No emergency services have arrived yet. The area needs to be blocked off before someone gets hurt.",
    timestamp: "30 minutes ago"
  },
  {
    id: "voice10",
    lat: 35.3733,
    lng: -119.0187,
    category: "Emotional Testimony",
    transcript: "I want to thank the volunteers who saved our community center. It's now housing over 200 people who lost their homes. People are sharing resources, helping each other fill out insurance forms, and supporting those who are grieving. In the midst of this tragedy, I'm seeing the best of humanity.",
    timestamp: "12 hours ago"
  }
];

// Create public/audio directory if it doesn't exist
const audioDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

async function seedVoices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for voice seeding');
    
    // Clear existing voices
    await Voice.deleteMany({});
    console.log('Cleared existing voice data');
    
    // Process each voice entry
    for (const voice of voiceData) {
      try {
        // Generate audio using Deepgram
        const audioURL = await textToSpeech(voice.transcript, voice.id);
        
        // Create new voice document with audio URL
        const newVoice = new Voice({
          ...voice,
          audioURL
        });
        
        await newVoice.save();
        console.log(`Created voice: ${voice.id}`);
      } catch (error) {
        console.error(`Error processing voice ${voice.id}:`, error);
      }
    }
    
    console.log('Voice seeding completed');
  } catch (error) {
    console.error('Error seeding voices:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedVoices();
