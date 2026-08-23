import type { Config } from '@netlify/functions';
import { GoogleGenAI, Type } from '@google/genai';

let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = Netlify.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return null;
  }
  try {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return genAIClient;
  } catch (error) {
    console.error('Failed to initialize GoogleGenAI:', error);
    return null;
  }
}

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
  const desc = (data.description || '').toLowerCase();

  let score = 25;
  if (pm25 > 250) score += 45;
  else if (pm25 > 120) score += 30;
  else if (pm25 > 60) score += 15;

  if (pm10 > 350) score += 20;
  else if (pm10 > 200) score += 12;

  if (wind < 3) score += 12;
  if (humidity > 75) score += 8;

  if (desc.includes('burn') || desc.includes('smoke') || desc.includes('fire') || desc.includes('smog')) score += 15;
  if (desc.includes('dust') || desc.includes('construction') || desc.includes('traffic') || desc.includes('industrial')) score += 10;

  score = Math.min(Math.max(Math.round(score), 12), 98);

  const pollutionRisk: 'LOW' | 'MEDIUM' | 'HIGH' =
    score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';

  const keySignals: string[] = [];
  if (pm25 > 120) keySignals.push(`Elevated PM2.5 particulate density (${pm25} µg/m³) breaching safe threshold`);
  if (pm10 > 200) keySignals.push(`Coarse dust & construction PM10 concentration elevated at ${pm10} µg/m³`);
  if (wind < 4) keySignals.push(`Low atmospheric dispersion velocity (${wind} km/h) causing particulate stagnation`);
  if (humidity > 70) keySignals.push(`High relative humidity (${humidity}%) promoting secondary aerosol condensation`);
  if (keySignals.length === 0) keySignals.push('Ambient particulate concentrations within baseline seasonal tolerances');

  const probableFactors: string[] = [];
  if (desc.includes('burn') || desc.includes('smoke') || desc.includes('stubble')) probableFactors.push('Open biomass / municipal waste or agricultural residue combustion');
  if (desc.includes('traffic') || desc.includes('road') || desc.includes('highway')) probableFactors.push('Heavy vehicular congestion and tailpipe diesel emissions');
  if (desc.includes('industry') || desc.includes('factory') || desc.includes('chimney')) probableFactors.push('Industrial boiler emissions or localized manufacturing discharge');
  if (desc.includes('construction') || desc.includes('dust')) probableFactors.push('Unmitigated road dust resuspension and unpaved excavation');
  if (probableFactors.length === 0) {
    if (pm10 > pm25 * 2) probableFactors.push('Road dust re-suspension and mechanical construction activity');
    else probableFactors.push('Mixed urban vehicular transit and localized micro-combustion sources');
  }

  let recommendedAuthorityAction = 'Continue routine ambient sensor surveillance and verify ward baseline data.';
  if (pollutionRisk === 'HIGH') {
    recommendedAuthorityAction = 'Immediate deployment of anti-smog water mist canons, targeted inspection of local industrial boilers/construction sites, and rerouting of heavy diesel transit.';
  } else if (pollutionRisk === 'MEDIUM') {
    recommendedAuthorityAction = 'Intensify mechanized street sweeping, issue advisory to nearby residential zones, and monitor wind direction shift.';
  }

  const confidence = Math.min(Math.max(Math.round(75 + (score > 80 ? 15 : 5)), 60), 96);

  return {
    pollutionRisk,
    riskScore: score,
    keySignals,
    probableContributingFactors: probableFactors,
    recommendedAuthorityAction,
    confidence,
    summaryNote: `Heuristic environmental synthesis conducted for ${data.location || 'observed zone'}, ${data.city || 'Urban Region'}.`,
    isGeminiGenerated: false,
  };
}

export default async (req: Request): Promise<Response> => {
  const body = await req.json().catch(() => ({}));
  const {
    city = 'Ahmedabad',
    location = 'Industrial Zone',
    description = '',
    pm25 = 120,
    pm10 = 200,
    temperature = 29,
    humidity = 65,
    windSpeed = 5,
    imageBase64,
  } = body || {};

  try {
    const ai = getGeminiClient();

    if (!ai) {
      console.log('No GEMINI_API_KEY set; utilizing domain-calibrated heuristic analysis.');
      const heuristicResult = calculateHeuristicRisk({
        city, location, description, pm25, pm10, temperature, humidity, windSpeed,
      });
      return Response.json(heuristicResult);
    }

    const systemInstruction = `You are the lead Environmental Risk & Pollution Intelligence AI for "AirWatch AI" (focusing on Indian urban ecosystems like Ahmedabad, Delhi, Mumbai, Bengaluru).
Analyze the citizen pollution report, environmental readings (PM2.5, PM10, Temp, Humidity, Wind), and description.
Evaluate the pollution risk level, calculate a 0-100 risk score, identify key physical/meteorological signals, pinpoint probable contributing factors (e.g. biomass burning, vehicular idling, road dust, industrial discharge, thermal inversion), suggest clear actionable municipal/SPCB authority interventions, and provide an AI confidence score (0-100%).

IMPORTANT DISCLAIMER RULE: This is an AI-generated pollution risk assessment derived from observations and signals, not an officially certified CPCB reference standard.

Output MUST strictly follow the provided JSON schema.`;

    const promptText = `Citizen Pollution Report to Analyze:
City: ${city}
Specific Location: ${location}
Citizen Description / Observation: "${description || 'Hazy conditions observed near area'}"
Environmental Signals:
- PM2.5: ${pm25} µg/m³
- PM10: ${pm10} µg/m³
- Ambient Temperature: ${temperature}°C
- Relative Humidity: ${humidity}%
- Wind Speed: ${windSpeed} km/h

Analyze these factors in the context of urban Indian meteorology (e.g., dispersion potential, inversion traps, localized emission patterns). Return the structured pollution risk assessment.`;

    let contentsPayload: any;

    if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.includes(',')) {
      const parts = imageBase64.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
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
      model: 'gemini-3.7-flash',
      contents: contentsPayload,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pollutionRisk: {
              type: Type.STRING,
              description: "Must be exactly 'LOW', 'MEDIUM', or 'HIGH'",
            },
            riskScore: {
              type: Type.INTEGER,
              description: 'Overall pollution risk index from 0 to 100',
            },
            keySignals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 4 distinct key environmental / meteorological signals identified',
            },
            probableContributingFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Probable sources (e.g. diesel emissions, dust resuspension, industrial boilers, stubble/waste burning)',
            },
            recommendedAuthorityAction: {
              type: Type.STRING,
              description: 'Specific high-priority municipal / SPCB action recommended',
            },
            confidence: {
              type: Type.INTEGER,
              description: 'Confidence percentage of this AI assessment (0 to 100)',
            },
            summaryNote: {
              type: Type.STRING,
              description: 'Short synthesis note explaining the meteorological and source context',
            },
          },
          required: [
            'pollutionRisk',
            'riskScore',
            'keySignals',
            'probableContributingFactors',
            'recommendedAuthorityAction',
            'confidence',
            'summaryNote',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const normalizedRisk = ['LOW', 'MEDIUM', 'HIGH'].includes(parsed.pollutionRisk?.toUpperCase())
      ? parsed.pollutionRisk.toUpperCase()
      : parsed.riskScore >= 70 ? 'HIGH' : parsed.riskScore >= 40 ? 'MEDIUM' : 'LOW';

    return Response.json({
      pollutionRisk: normalizedRisk,
      riskScore: Math.min(Math.max(Number(parsed.riskScore) || 50, 0), 100),
      keySignals: Array.isArray(parsed.keySignals) && parsed.keySignals.length > 0 ? parsed.keySignals : ['Elevated particulate density relative to local atmospheric dispersion.'],
      probableContributingFactors: Array.isArray(parsed.probableContributingFactors) && parsed.probableContributingFactors.length > 0 ? parsed.probableContributingFactors : ['Mixed urban traffic and localized fugitive emissions.'],
      recommendedAuthorityAction: parsed.recommendedAuthorityAction || 'Inspect local zone, deploy dust suppression mist cannons, and monitor trends.',
      confidence: Math.min(Math.max(Number(parsed.confidence) || 85, 40), 98),
      summaryNote: parsed.summaryNote || `AI risk analysis synthesized for ${location}, ${city}.`,
      isGeminiGenerated: true,
    });
  } catch (error: any) {
    console.error('Gemini API call failed, providing fallback:', error?.message || error);
    const fallback = calculateHeuristicRisk({ city, location, description, pm25, pm10, temperature, humidity, windSpeed });
    return Response.json(fallback);
  }
};

export const config: Config = {
  path: '/api/analyze-report',
  method: 'POST',
};
