import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initialize GoogleGenAI instance safely
let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  try {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    return genAIClient;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    return null;
  }
}

// Fallback heuristic analyzer when API key is missing or model fails
function calculateHeuristicRisk(data: {
  city?: string;
  location?: string;
  description?: string;
  pm25?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
}) {
  const pm25 = Number(data.pm25) || 60;
  const pm10 = Number(data.pm10) || 120;
  const wind = Number(data.windSpeed) || 5;
  const humidity = Number(data.humidity) || 60;
  const desc = (data.description || "").toLowerCase();

  let score = 25;
  if (pm25 > 250) score += 45;
  else if (pm25 > 120) score += 30;
  else if (pm25 > 60) score += 15;

  if (pm10 > 350) score += 20;
  else if (pm10 > 200) score += 12;

  // Stagnant air accumulation penalty
  if (wind < 3) score += 12;
  // High humidity trapping particulate
  if (humidity > 75) score += 8;

  // Keyword indicators
  if (desc.includes("burn") || desc.includes("smoke") || desc.includes("fire") || desc.includes("smog")) score += 15;
  if (desc.includes("dust") || desc.includes("construction") || desc.includes("traffic") || desc.includes("industrial")) score += 10;

  score = Math.min(Math.max(Math.round(score), 12), 98);

  const pollutionRisk: "LOW" | "MEDIUM" | "HIGH" =
    score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";

  const keySignals: string[] = [];
  if (pm25 > 120) keySignals.push(`Elevated PM2.5 particulate density (${pm25} µg/m³) breaching safe threshold`);
  if (pm10 > 200) keySignals.push(`Coarse dust & construction PM10 concentration elevated at ${pm10} µg/m³`);
  if (wind < 4) keySignals.push(`Low atmospheric dispersion velocity (${wind} km/h) causing particulate stagnation`);
  if (humidity > 70) keySignals.push(`High relative humidity (${humidity}%) promoting secondary aerosol condensation`);
  if (keySignals.length === 0) keySignals.push("Ambient particulate concentrations within baseline seasonal tolerances");

  const probableFactors: string[] = [];
  if (desc.includes("burn") || desc.includes("smoke") || desc.includes("stubble")) probableFactors.push("Open biomass / municipal waste or agricultural residue combustion");
  if (desc.includes("traffic") || desc.includes("road") || desc.includes("highway")) probableFactors.push("Heavy vehicular congestion and tailpipe diesel emissions");
  if (desc.includes("industry") || desc.includes("factory") || desc.includes("chimney")) probableFactors.push("Industrial boiler emissions or localized manufacturing discharge");
  if (desc.includes("construction") || desc.includes("dust")) probableFactors.push("Unmitigated road dust resuspension and unpaved excavation");
  if (probableFactors.length === 0) {
    if (pm10 > pm25 * 2) probableFactors.push("Road dust re-suspension and mechanical construction activity");
    else probableFactors.push("Mixed urban vehicular transit and localized micro-combustion sources");
  }

  let recommendedAuthorityAction = "Continue routine ambient sensor surveillance and verify ward baseline data.";
  if (pollutionRisk === "HIGH") {
    recommendedAuthorityAction = "Immediate deployment of anti-smog water mist canons, targeted inspection of local industrial boilers/construction sites, and rerouting of heavy diesel transit.";
  } else if (pollutionRisk === "MEDIUM") {
    recommendedAuthorityAction = "Intensify mechanized street sweeping, issue advisory to nearby residential zones, and monitor wind direction shift.";
  }

  const confidence = Math.min(Math.max(Math.round(75 + (score > 80 ? 15 : 5)), 60), 96);

  return {
    pollutionRisk,
    riskScore: score,
    keySignals,
    probableContributingFactors: probableFactors,
    recommendedAuthorityAction,
    confidence,
    summaryNote: `Heuristic environmental synthesis conducted for ${data.location || "observed zone"}, ${data.city || "Urban Region"}.`,
    isGeminiGenerated: false,
  };
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AirWatch AI Environmental Intelligence API",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 2. Gemini AI Environmental Risk Analysis
app.post("/api/analyze-report", async (req, res) => {
  try {
    const {
      city = "Ahmedabad",
      location = "Industrial Zone",
      description = "",
      pm25 = 120,
      pm10 = 200,
      temperature = 29,
      humidity = 65,
      windSpeed = 5,
      imageBase64,
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      console.log("No GEMINI_API_KEY set; utilizing domain-calibrated heuristic analysis.");
      const heuristicResult = calculateHeuristicRisk({
        city,
        location,
        description,
        pm25,
        pm10,
        temperature,
        humidity,
        windSpeed,
      });
      return res.json(heuristicResult);
    }

    const systemInstruction = `You are the lead Environmental Risk & Pollution Intelligence AI for "AirWatch AI" (focusing on Indian urban ecosystems like Ahmedabad, Delhi, Mumbai, Bengaluru).
Analyze the citizen pollution report, environmental readings (PM2.5, PM10, Temp, Humidity, Wind), and description.
Evaluate the pollution risk level, calculate a 0-100 risk score, identify key physical/meteorological signals, pinpoint probable contributing factors (e.g. biomass burning, vehicular idling, road dust, industrial discharge, thermal inversion), suggest clear actionable municipal/SPCB authority interventions, and provide an AI confidence score (0-100%).

IMPORTANT DISCLAIMER RULE: This is an AI-generated pollution risk assessment derived from observations and signals, not an officially certified CPCB reference standard.

Output MUST strictly follow the provided JSON schema.`;

    const promptText = `Citizen Pollution Report to Analyze:
City: ${city}
Specific Location: ${location}
Citizen Description / Observation: "${description || "Hazy conditions observed near area"}"
Environmental Signals:
- PM2.5: ${pm25} µg/m³
- PM10: ${pm10} µg/m³
- Ambient Temperature: ${temperature}°C
- Relative Humidity: ${humidity}%
- Wind Speed: ${windSpeed} km/h

Analyze these factors in the context of urban Indian meteorology (e.g., dispersion potential, inversion traps, localized emission patterns). Return the structured pollution risk assessment.`;

    let contentsPayload: any;

    if (imageBase64 && typeof imageBase64 === "string" && imageBase64.includes(",")) {
      const parts = imageBase64.split(",");
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const base64Data = parts[1];

      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: `${promptText}\n[Note: Also evaluate visual cues from the attached citizen observation photo for haze density, visible plume, dust clouds, or vehicular density.]`,
          },
        ],
      };
    } else {
      contentsPayload = promptText;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contentsPayload,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pollutionRisk: {
              type: Type.STRING,
              description: "Must be exactly 'LOW', 'MEDIUM', or 'HIGH'",
            },
            riskScore: {
              type: Type.INTEGER,
              description: "Overall pollution risk index from 0 to 100",
            },
            keySignals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 4 distinct key environmental / meteorological signals identified",
            },
            probableContributingFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Probable sources (e.g. diesel emissions, dust resuspension, industrial boilers, stubble/waste burning)",
            },
            recommendedAuthorityAction: {
              type: Type.STRING,
              description: "Specific high-priority municipal / SPCB action recommended",
            },
            confidence: {
              type: Type.INTEGER,
              description: "Confidence percentage of this AI assessment (0 to 100)",
            },
            summaryNote: {
              type: Type.STRING,
              description: "Short synthesis note explaining the meteorological and source context",
            },
          },
          required: [
            "pollutionRisk",
            "riskScore",
            "keySignals",
            "probableContributingFactors",
            "recommendedAuthorityAction",
            "confidence",
            "summaryNote",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    const normalizedRisk = ["LOW", "MEDIUM", "HIGH"].includes(parsed.pollutionRisk?.toUpperCase())
      ? parsed.pollutionRisk.toUpperCase()
      : parsed.riskScore >= 70 ? "HIGH" : parsed.riskScore >= 40 ? "MEDIUM" : "LOW";

    return res.json({
      pollutionRisk: normalizedRisk,
      riskScore: Math.min(Math.max(Number(parsed.riskScore) || 50, 0), 100),
      keySignals: Array.isArray(parsed.keySignals) && parsed.keySignals.length > 0 ? parsed.keySignals : ["Elevated particulate density relative to local atmospheric dispersion."],
      probableContributingFactors: Array.isArray(parsed.probableContributingFactors) && parsed.probableContributingFactors.length > 0 ? parsed.probableContributingFactors : ["Mixed urban traffic and localized fugitive emissions."],
      recommendedAuthorityAction: parsed.recommendedAuthorityAction || "Inspect local zone, deploy dust suppression mist cannons, and monitor trends.",
      confidence: Math.min(Math.max(Number(parsed.confidence) || 85, 40), 98),
      summaryNote: parsed.summaryNote || `AI risk analysis synthesized for ${location}, ${city}.`,
      isGeminiGenerated: true,
    });
  } catch (error: any) {
    console.error("Gemini API call failed, providing fallback:", error?.message || error);
    const fallback = calculateHeuristicRisk(req.body);
    return res.json(fallback);
  }
});

// 3. Simulated Authority Alert Dispatch API
app.post("/api/trigger-alert", (req, res) => {
  const { alertId, location, city, severity, actionTaken } = req.body;
  res.json({
    success: true,
    dispatchedAt: new Date().toISOString(),
    alertId: alertId || `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
    recipient: `Municipal Corporation & State Pollution Control Board (${city || "State"} Node)`,
    status: "DISPATCHED_TO_FIELD_TEAMS",
    protocolCode: severity === "HIGH" ? "GRAP-LEVEL-IV-RESPONSE" : "GRAP-LEVEL-II-ACTION",
    message: `Authority intervention alert successfully registered for ${location}, ${city}. Task force notified for ${actionTaken || "field inspection and mist mitigation"}.`,
  });
});

// 4. Simulated Federated City Intelligence Sync API
app.post("/api/federated-sync", (req, res) => {
  const { city } = req.body;
  res.json({
    success: true,
    syncTimestamp: new Date().toISOString(),
    syncedCity: city || "All Nodes",
    insightsExchanged: [
      "Updated micro-meteorological dust dispersion weight vectors (Δw = +0.038)",
      "Shared thermal inversion boundary layer signature for coastal vs inland industrial zones",
      "Calibrated citizen optical opacity weighting matrix without centralizing raw image PII",
    ],
    federatedRound: 142,
    privacyGuarantee: "Differential Privacy ε = 0.85, Zero Citizen PII Exchange",
  });
});

// 5. Open-Meteo Live Weather Proxy API
app.get("/api/weather", async (req, res) => {
  try {
    const lat = req.query.lat || "23.0225";
    const lng = req.query.lng || "72.5714";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const fetchRes = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({
        error: "Weather data temporarily unavailable",
        source: "Open-Meteo",
      });
    }

    const data: any = await fetchRes.json();
    if (!data.current) {
      return res.status(502).json({
        error: "Weather data temporarily unavailable",
        source: "Open-Meteo",
      });
    }

    const current = data.current;
    const temp = Math.round(Number(current.temperature_2m) * 10) / 10;
    const humidity = Math.round(Number(current.relative_humidity_2m));
    const windSpeed = Math.round(Number(current.wind_speed_10m) * 10) / 10;
    const windDir = Math.round(Number(current.wind_direction_10m));

    const directions = [
      "N", "NNE", "NE", "ENE",
      "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW",
      "W", "WNW", "NW", "NNW"
    ];
    const windCompass = directions[Math.round((((windDir % 360) + 360) % 360) / 22.5) % 16];

    return res.json({
      temperature: temp,
      humidity: humidity,
      windSpeed: windSpeed,
      windDirection: windDir,
      windDirectionCompass: windCompass,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      rawTime: current.time || new Date().toISOString(),
      source: "Open-Meteo Live API",
      isLive: true,
    });
  } catch (error: any) {
    console.error("Open-Meteo API proxy error:", error?.message || error);
    return res.status(503).json({
      error: "Weather data temporarily unavailable",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AirWatch AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
