# 🌦️ WeatherAirWitch

### AI-Powered Weather Intelligence

WeatherAirWitch is an AI-powered weather assistant that combines **real-time weather data with Google Gemini** to turn raw weather conditions into simple, useful, and personalized insights.

## 💡 Problem

Most weather apps show users numbers like temperature, humidity, wind speed, and precipitation.

But users still have to interpret those numbers themselves.

**WeatherAirWitch bridges this gap by using AI to explain what the weather actually means.**

## 🚀 Solution

WeatherAirWitch takes live weather data and uses **Google Gemini** to generate natural-language weather insights.

Instead of simply showing:

> **32°C | 70% Humidity | 20 km/h Wind**

the AI helps turn these conditions into information that is easier to understand and act on.

## ✨ Key Features

* 🌤️ Real-time weather information
* 🤖 AI-powered weather analysis using Google Gemini
* 📍 Location-based weather insights
* 💬 Natural-language weather explanations
* 🧠 Combines multiple weather conditions into one understandable insight
* ⚡ Simple and focused user experience

## 🧠 How AI Is Used

Gemini is the intelligence layer of WeatherAirWitch.

```text
        Live Weather Data
               ↓
        WeatherAirWitch
               ↓
          Google Gemini
               ↓
        AI Interpretation
               ↓
      Useful Weather Insight
```

The AI receives relevant weather information and interprets it to generate an easy-to-understand response.

The goal is to move from:

**"Here is your weather data."**

to:

**"Here is what your weather data means."**

## 🏗️ Architecture

```text
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           ↓
                 ┌──────────────────┐
                 │  WeatherAirWitch  │
                 └────────┬─────────┘
                          │
                 ┌────────┴────────┐
                 ↓                 ↓
        ┌────────────────┐  ┌────────────────┐
        │   Open-Meteo   │  │ Google Gemini  │
        │  Weather Data  │  │  AI Analysis   │
        └───────┬────────┘  └───────┬────────┘
                │                   │
                └─────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │ Weather Insight  │
                 └──────────────────┘
```

## 🛠️ Tech Stack

| Technology        | Purpose                           |
| ----------------- | --------------------------------- |
| **Google Gemini** | AI-powered weather interpretation |
| **Open-Meteo**    | Real-time weather data            |
| **TypeScript**    | Application logic                 |
| **Node.js**       | Runtime                           |
| **npm**           | Dependency management             |

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Mantrapandya/weatherairwitch.git
cd weatherairwitch
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

### 4. Start the application

```bash
npm run dev
```

Open the local URL provided by the development server.

## 🔐 Security

The Gemini API key is accessed through an environment variable:

```text
process.env.GEMINI_API_KEY
```

No real API credentials are intentionally stored in the public repository.

The repository contains only placeholder values in `env.example`.

**Never commit your real API key or `.env.local` file to GitHub.**

## 🎯 Why WeatherAirWitch?

Weather data is already everywhere.

The interesting part is making that data **understandable and useful**.

WeatherAirWitch explores how generative AI can transform traditional weather data into a more natural and intelligent experience.

## 🔮 Future Scope

The prototype can be extended with:

* Personalized weather recommendations
* Activity-aware suggestions
* Travel and commute insights
* Severe-weather explanations
* Multi-location comparison
* Voice-based interaction
* More contextual AI recommendations

## 📌 Prototype

**Built as an AI prototype for Build with AI.**

The core idea is simple:

> **Don't just show the weather. Explain it.**

## 👨‍💻 Creator

**Mantrapandya**

[GitHub Repository](https://github.com/Mantrapandya/weatherairwitch)
