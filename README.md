# After the Flames

<p align="center">
  <img src="https://img.shields.io/badge/Status-Beta-yellow" alt="Status: Beta">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License: MIT">
  <img src="https://img.shields.io/badge/Platform-Web-brightgreen" alt="Platform: Web">
</p>

## 🔥 Overview

**After the Flames** is a web application designed to assist California in planning wildfire recovery with equity at its core. Using a map-based interface, it displays fire zones alongside demographic vulnerability data, helping decision-makers prioritize resources for the most vulnerable communities.

### Key Features

- **Interactive Map Interface**: Visualize fire perimeters and affected communities
- **Equity Data Analysis**: Access demographic data by ZIP code with calculated vulnerability scores
- **Voice Testimonials**: Listen to first-hand accounts from affected communities
- **AI-Powered Recommendations**: Receive intelligent recovery planning suggestions

## 📋 Project Structure

```
after-the-flames/
├── after-the-flames/         # Frontend (Next.js)
│   ├── components/           # React components
│   ├── app/                  # Next.js app router
│   └── public/               # Static assets
└── after-the-flames-backend/ # Backend (Node.js/Express)
    ├── src/
    │   ├── routes/           # API routes
    │   ├── data/             # Mock data
    │   └── utils/            # Helper functions
    └── voices/               # Voice testimonial audio files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/after-the-flames.git
cd after-the-flames
```

2. **Set up the backend**

```bash
cd after-the-flames-backend
npm install

# Create a .env file with the following variables
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=4000
```

3. **Set up the frontend**

```bash
cd ../after-the-flames
npm install
```

### Running the Application

1. **Start the backend server**

```bash
cd after-the-flames-backend
npm run dev
```

2. **Start the frontend application**

```bash
cd ../after-the-flames
npm run dev
```

3. **Access the application**

Open your browser and navigate to `http://localhost:3000`

## 🔧 Technologies Used

### Frontend
- Next.js 14
- React
- Tailwind CSS
- Mapbox GL
- shadcn/ui components

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Google Gemini AI

## 📊 Data Sources

- California Fire Perimeter Data (mock)
- Demographic data by ZIP code (mock)
- Voice testimonials from affected communities

## 🌟 Features in Detail

### Equity Data API
- MongoDB collection for ZIP code-level demographic data
- Endpoints for retrieving and calculating equity scores
- Supports filtering and detailed demographic analysis

### Fire Perimeters API
- GeoJSON support for fire zone visualization
- Endpoint to retrieve fire perimeter information

### Recommendations API
- Dynamic recommendations generation
- Integrated Gemini AI for intelligent recommendations
- Fallback to static rule-based recommendations

### Voice Testimonials
- Interactive map pins for voice locations
- Audio playback of community testimonials
- Category-based filtering

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- California Department of Forestry and Fire Protection
- All community members who shared their experiences
- Open-source libraries and tools that made this project possible