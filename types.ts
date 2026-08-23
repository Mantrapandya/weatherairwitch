export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface LiveWeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windDirectionCompass: string;
  timestamp: string;
  rawTime: string;
  source: 'Open-Meteo Live API';
  isLive: true;
}

export interface LiveWeatherState {
  data: LiveWeatherData | null;
  loading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
}

export interface EnvironmentalSignals {
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export interface CitizenReport {
  id: string;
  city: string;
  location: string;
  description: string;
  signals: EnvironmentalSignals;
  imageUrl?: string;
  timestamp: string;
  citizenReporter?: string;
  verifiedCitizenCount?: number;
}

export interface GeminiAnalysisResult {
  pollutionRisk: RiskLevel;
  riskScore: number;
  keySignals: string[];
  probableContributingFactors: string[];
  recommendedAuthorityAction: string;
  confidence: number;
  summaryNote: string;
  isGeminiGenerated?: boolean;
}

export interface HotspotLocation {
  id: string;
  city: 'Ahmedabad' | 'Delhi' | 'Mumbai' | 'Bengaluru' | 'Kolkata' | 'Hyderabad';
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
    // Normalized for custom SVG India projection
    svgX: number;
    svgY: number;
  };
  riskLevel: RiskLevel;
  riskScore: number;
  signals: EnvironmentalSignals;
  probableContributingFactors: string[];
  confidence: number;
  timestamp: string;
  citizenReportCount: number;
  recommendedAction: string;
  wardNumber: string;
  dominantSource: 'Industrial' | 'Vehicular' | 'Biomass/Waste' | 'Construction Dust' | 'Mixed';
}

export interface AuthorityAlert {
  id: string;
  location: string;
  city: string;
  riskLevel: RiskLevel;
  riskScore: number;
  evidence: string[];
  aiAssessment: string;
  recommendedAction: string;
  confidence: number;
  timestamp: string;
  status: 'PENDING_REVIEW' | 'DISPATCHED' | 'MITIGATING' | 'RESOLVED';
  priority: 'CRITICAL' | 'ELEVATED' | 'ROUTINE';
  dispatchedTo?: string;
  dispatchTimestamp?: string;
}

export interface ForecastPoint {
  timeLabel: string;
  hourOffset: number;
  riskScore: number;
  riskLevel: RiskLevel;
  pm25: number;
  pm10: number;
  windSpeed: number;
  inversionRisk: 'Low' | 'Moderate' | 'Severe';
  dispersionIndex: number; // 0-100
}

export interface CityNode {
  city: string;
  state: string;
  activeHotspots: number;
  avgRiskScore: number;
  topPollutant: string;
  dominantChallenge: string;
  edgeModelVersion: string;
  localDatasetSize: number;
  lastFederatedSync: string;
  coordinates: { lat: number; lng: number };
  sharedInsights: string[];
}

export interface FutureIntegration {
  id: string;
  title: string;
  category: string;
  iconName: string;
  description: string;
  dataSources: string[];
  valueAdd: string;
  technicalFeasibility: string;
  status: string;
}
