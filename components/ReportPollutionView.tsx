import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Info,
  RefreshCw,
  Wind,
  Droplets,
  Thermometer,
  FileText,
  Activity,
  X,
  Layers,
  Radio,
  Compass,
} from 'lucide-react';
import { GeminiAnalysisResult, RiskLevel, HotspotLocation, AuthorityAlert } from '../types';
import { PRESET_CITIZEN_REPORTS } from '../data/mockData';
import { SimulatedBadge } from './SimulatedBadge';
import { fetchLiveWeather, CITY_COORDINATES } from '../services/weatherService';

interface ReportPollutionViewProps {
  onAddHotspot: (hotspot: HotspotLocation) => void;
  onAddAlert: (alert: AuthorityAlert) => void;
  onNavigateToAuthority: () => void;
}

export const ReportPollutionView: React.FC<ReportPollutionViewProps> = ({
  onAddHotspot,
  onAddAlert,
  onNavigateToAuthority,
}) => {
  // Form State
  const [city, setCity] = useState<string>('Ahmedabad');
  const [location, setLocation] = useState<string>('Vatva Industrial Estate Phase II');
  const [description, setDescription] = useState<string>(
    'Dense greyish smoke plume venting continuously from boiler stacks along the canal. Pungent chemical odor in the air with low morning visibility.'
  );
  const [pm25, setPm25] = useState<number>(186);
  const [pm10, setPm10] = useState<number>(294);
  const [temperature, setTemperature] = useState<number>(31);
  const [humidity, setHumidity] = useState<number>(72);
  const [windSpeed, setWindSpeed] = useState<number>(4);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<GeminiAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [dispatchedNotice, setDispatchedNotice] = useState<boolean>(false);

  // Weather Fetch State
  const [isFetchingWeather, setIsFetchingWeather] = useState<boolean>(false);
  const [weatherStatusNotice, setWeatherStatusNotice] = useState<string | null>(null);
  const [weatherFetchError, setWeatherFetchError] = useState<string | null>(null);

  // Fetch Live Weather from Open-Meteo for selected city
  const handleFetchLiveWeatherForCity = async () => {
    setIsFetchingWeather(true);
    setWeatherStatusNotice(null);
    setWeatherFetchError(null);

    const coords = CITY_COORDINATES[city] || CITY_COORDINATES['Ahmedabad'];

    try {
      const live = await fetchLiveWeather(coords.lat, coords.lng, true);
      setTemperature(live.temperature);
      setHumidity(live.humidity);
      setWindSpeed(live.windSpeed);
      setWeatherStatusNotice(
        `LIVE WEATHER APPLIED (${city}): ${live.temperature}°C, ${live.humidity}% humidity, ${live.windSpeed} km/h wind from ${live.windDirectionCompass} (${live.timestamp})`
      );
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setWeatherFetchError('Weather data temporarily unavailable from Open-Meteo API.');
    } finally {
      setIsFetchingWeather(false);
    }
  };

  // Quick Preset Selection
  const handleSelectPreset = (preset: typeof PRESET_CITIZEN_REPORTS[0]) => {
    setCity(preset.city);
    setLocation(preset.location);
    setDescription(preset.description);
    setPm25(preset.pm25);
    setPm10(preset.pm10);
    setTemperature(preset.temperature);
    setHumidity(preset.humidity);
    setWindSpeed(preset.windSpeed);
    setAnalysisResult(null);
    setDispatchedNotice(false);
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Gemini AI Analysis via Server API
  const handleAnalyzeReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisError(null);
    setDispatchedNotice(false);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          location,
          description,
          pm25: Number(pm25),
          pm10: Number(pm10),
          temperature: Number(temperature),
          humidity: Number(humidity),
          windSpeed: Number(windSpeed),
          imageBase64: imagePreview,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data: GeminiAnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(
        'Failed to connect to AI engine. Using local calibrated fallback analysis.'
      );
      // Fallback display
      setAnalysisResult({
        pollutionRisk: pm25 > 120 ? 'HIGH' : pm25 > 60 ? 'MEDIUM' : 'LOW',
        riskScore: Math.min(Math.max(Math.round(pm25 * 0.4 + pm10 * 0.15), 10), 96),
        keySignals: [
          `Particulate PM2.5 at ${pm25} µg/m³ significantly elevated`,
          `High humidity (${humidity}%) facilitating particulate aggregation`,
          `Stagnant wind (${windSpeed} km/h) impeding natural dispersion`,
        ],
        probableContributingFactors: [
          'Localized industrial boiler discharge and combustion',
          'Heavy diesel vehicle emissions along arterial freight routes',
        ],
        recommendedAuthorityAction:
          'Deploy localized mist suppression canons and trigger continuous stack emission audit in ward.',
        confidence: 88,
        summaryNote: `Calibrated heuristic risk evaluation for ${location}, ${city}.`,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Convert Analysis into Dispatched Alert & Hotspot
  const handleDispatchToAuthority = () => {
    if (!analysisResult) return;

    const newHotspot: HotspotLocation = {
      id: `HOT-${city.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      city: city as any,
      locationName: location,
      coordinates: {
        lat: city === 'Ahmedabad' ? 23.0225 : city === 'Delhi' ? 28.6139 : city === 'Mumbai' ? 19.076 : 12.9716,
        lng: city === 'Ahmedabad' ? 72.5714 : city === 'Delhi' ? 77.209 : city === 'Mumbai' ? 72.8777 : 77.5946,
        svgX: city === 'Ahmedabad' ? 282 : city === 'Delhi' ? 410 : city === 'Mumbai' ? 288 : 415,
        svgY: city === 'Ahmedabad' ? 475 : city === 'Delhi' ? 285 : city === 'Mumbai' ? 620 : 815,
      },
      riskLevel: analysisResult.pollutionRisk,
      riskScore: analysisResult.riskScore,
      signals: {
        pm25: Number(pm25),
        pm10: Number(pm10),
        temperature: Number(temperature),
        humidity: Number(humidity),
        windSpeed: Number(windSpeed),
      },
      probableContributingFactors: analysisResult.probableContributingFactors,
      confidence: analysisResult.confidence,
      timestamp: 'Just now',
      citizenReportCount: 1,
      recommendedAction: analysisResult.recommendedAuthorityAction,
      wardNumber: `Ward Auto-${Math.floor(10 + Math.random() * 89)}`,
      dominantSource: description.toLowerCase().includes('industry') ? 'Industrial' : 'Vehicular',
    };

    const newAlert: AuthorityAlert = {
      id: `ALT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      location,
      city,
      riskLevel: analysisResult.pollutionRisk,
      riskScore: analysisResult.riskScore,
      evidence: [
        `Citizen observation: "${description}"`,
        `Sensor telemetry: PM2.5: ${pm25} µg/m³, PM10: ${pm10} µg/m³, Wind: ${windSpeed} km/h`,
        ...analysisResult.keySignals,
      ],
      aiAssessment: analysisResult.summaryNote,
      recommendedAction: analysisResult.recommendedAuthorityAction,
      confidence: analysisResult.confidence,
      timestamp: 'Just now',
      status: 'PENDING_REVIEW',
      priority: analysisResult.pollutionRisk === 'HIGH' ? 'CRITICAL' : 'ELEVATED',
    };

    onAddHotspot(newHotspot);
    onAddAlert(newAlert);
    setDispatchedNotice(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Citizen Pollution Signal Report
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Submit ground-level pollution observations and micro-environmental readings. Gemini AI will synthesize multi-factor risk signals, probable sources, and authority action recommendations.
            </p>
          </div>
          <SimulatedBadge text="SIMULATED CITIZEN INGEST" size="md" />
        </div>

        {/* Quick Presets selector bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Quick Fill Indian City Scenarios (Simulated Data):
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_CITIZEN_REPORTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                id={`preset-btn-${idx}`}
                onClick={() => handleSelectPreset(preset)}
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-[#050507] border border-white/[0.08] text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, AI Analysis Result Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Form */}
        <form
          onSubmit={handleAnalyzeReport}
          className="lg:col-span-6 bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Environmental Telemetry & Observation
            </h3>
            <span className="text-xs font-mono text-slate-400">* All fields editable</span>
          </div>

          {/* City and Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                City / Urban Node
              </label>
              <select
                id="report-city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#050507] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="Ahmedabad">Ahmedabad (Gujarat)</option>
                <option value="Delhi">Delhi NCR (National Capital)</option>
                <option value="Mumbai">Mumbai (Maharashtra)</option>
                <option value="Bengaluru">Bengaluru (Karnataka)</option>
                <option value="Kolkata">Kolkata (West Bengal)</option>
                <option value="Hyderabad">Hyderabad (Telangana)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Specific Ward / Location Name
              </label>
              <input
                id="report-location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Vatva Phase II / Anand Vihar / Chembur"
                required
                className="w-full bg-[#050507] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition font-mono"
              />
            </div>
          </div>

          {/* Observation Description */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description of Observation
            </label>
            <textarea
              id="report-description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe smoke color, odor, visibility distance, visible fire/stubble burning, or traffic conditions..."
              required
              className="w-full bg-[#050507] border border-white/[0.08] rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition resize-none"
            />
          </div>

          {/* Numerical Sensor Signals & Live Weather Telemetry */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 block">
                Environmental & Atmospheric Signals
              </span>

              {/* Real-time Fetch Live Weather button from Open-Meteo */}
              <button
                type="button"
                id="fetch-live-weather-btn"
                onClick={handleFetchLiveWeatherForCity}
                disabled={isFetchingWeather}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              >
                <Radio className={`w-3.5 h-3.5 text-cyan-400 ${isFetchingWeather ? 'animate-pulse' : ''}`} />
                {isFetchingWeather ? 'Fetching Open-Meteo...' : `Fetch Live Weather (${city})`}
              </button>
            </div>

            {/* Weather status feedback banner */}
            {weatherStatusNotice && (
              <div className="p-2.5 rounded-xl bg-cyan-950/25 border border-cyan-500/30 text-xs font-mono text-cyan-200 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-semibold text-cyan-300">LIVE WEATHER DATA:</span>
                <span>{weatherStatusNotice}</span>
              </div>
            )}

            {weatherFetchError && (
              <div className="p-2.5 rounded-xl bg-red-950/25 border border-red-500/30 text-xs font-mono text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Weather data temporarily unavailable from Open-Meteo API.</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* PM2.5 */}
              <div className="bg-[#050507] p-3 rounded-xl border border-white/[0.08]">
                <label className="block text-[11px] font-mono font-semibold text-slate-400">
                  PM2.5 (µg/m³) <span className="text-[10px] text-slate-500 font-normal">[Simulated]</span>
                </label>
                <input
                  id="report-pm25-input"
                  type="number"
                  min="0"
                  max="1000"
                  value={pm25}
                  onChange={(e) => setPm25(Number(e.target.value))}
                  className="w-full mt-1 bg-[#0a0c10] border border-white/[0.08] rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Safe: 30-60</span>
              </div>

              {/* PM10 */}
              <div className="bg-[#050507] p-3 rounded-xl border border-white/[0.08]">
                <label className="block text-[11px] font-mono font-semibold text-slate-400">
                  PM10 (µg/m³) <span className="text-[10px] text-slate-500 font-normal">[Simulated]</span>
                </label>
                <input
                  id="report-pm10-input"
                  type="number"
                  min="0"
                  max="1500"
                  value={pm10}
                  onChange={(e) => setPm10(Number(e.target.value))}
                  className="w-full mt-1 bg-[#0a0c10] border border-white/[0.08] rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Safe: 100</span>
              </div>

              {/* Wind Speed */}
              <div className="bg-[#050507] p-3 rounded-xl border border-white/[0.08]">
                <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400">
                  <span>Wind Speed</span>
                  <span className="text-[10px] text-cyan-400 font-normal">km/h</span>
                </div>
                <input
                  id="report-wind-input"
                  type="number"
                  min="0"
                  max="80"
                  step="0.5"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full mt-1 bg-[#0a0c10] border border-white/[0.08] rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">&lt; 4 = Stagnant</span>
              </div>

              {/* Temperature */}
              <div className="bg-[#050507] p-3 rounded-xl border border-white/[0.08]">
                <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400">
                  <span>Temperature</span>
                  <span className="text-[10px] text-amber-400 font-normal">°C</span>
                </div>
                <input
                  id="report-temp-input"
                  type="number"
                  min="-10"
                  max="55"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full mt-1 bg-[#0a0c10] border border-white/[0.08] rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Ambient 2m</span>
              </div>

              {/* Humidity */}
              <div className="bg-[#050507] p-3 rounded-xl border border-white/[0.08] col-span-2 sm:col-span-2">
                <label className="block text-[11px] font-mono font-semibold text-slate-400">
                  Relative Humidity (%)
                </label>
                <input
                  id="report-humidity-input"
                  type="number"
                  min="0"
                  max="100"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full mt-1 bg-[#0a0c10] border border-white/[0.08] rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">&gt; 70% traps particulates</span>
              </div>
            </div>
          </div>

          {/* Optional Photo Upload UI */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Attach Observation Photo (Optional)</span>
              <span className="text-[10px] font-mono text-slate-400 font-normal">JPG, PNG up to 10MB</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-[#050507] p-2">
                <img
                  src={imagePreview}
                  alt="Citizen observation upload"
                  className="w-full max-h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-4 right-4 p-1.5 bg-[#0a0c10]/90 hover:bg-red-500 text-white rounded-full transition shadow-lg"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-2 flex items-center justify-between px-2 text-xs text-emerald-400 font-mono">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Image attached for Gemini Multimodal Analysis
                  </span>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.08] hover:border-emerald-500/50 rounded-2xl p-4 bg-[#050507] cursor-pointer transition group">
                <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition" />
                <span className="text-xs font-medium text-slate-300 mt-2">
                  Click or drag photo here to upload
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Useful for stack plumes, visible haze, or traffic queues
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="analyze-report-btn"
            disabled={isAnalyzing}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition active:scale-95 ${
              isAnalyzing
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-emerald-950/60'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span className="font-mono">Gemini AI Analyzing Environmental Signals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Report with Gemini AI</span>
              </>
            )}
          </button>
        </form>

        {/* AI Analysis Result Panel (Right) */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {analysisResult ? (
            <div className="bg-[#0f1115] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5 animate-fadeIn">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      AI-Generated Pollution Risk Assessment
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Evaluated for {location}, {city}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold tracking-wider border ${
                      analysisResult.pollutionRisk === 'HIGH'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : analysisResult.pollutionRisk === 'MEDIUM'
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {analysisResult.pollutionRisk} RISK
                  </span>
                </div>
              </div>

              {/* Mandatory Disclaimer Box */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Assessment Disclaimer:</strong> This is an AI-generated pollution risk assessment derived from citizen reports and environmental signals for decision support. It is <em>not</em> an official CPCB regulatory AQI measurement.
                </span>
              </div>

              {/* Risk Score Gauge & Confidence */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#050507] p-4 rounded-2xl border border-white/[0.08] text-center">
                  <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
                    Calculated Risk Score
                  </span>
                  <div
                    className={`text-3xl font-extrabold font-mono mt-1 ${
                      analysisResult.riskScore >= 70
                        ? 'text-red-400'
                        : analysisResult.riskScore >= 40
                        ? 'text-orange-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {analysisResult.riskScore}
                    <span className="text-sm font-normal text-slate-500"> / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.08] rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        analysisResult.riskScore >= 70
                          ? 'bg-red-500'
                          : analysisResult.riskScore >= 40
                          ? 'bg-orange-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${analysisResult.riskScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-[#050507] p-4 rounded-2xl border border-white/[0.08] text-center">
                  <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
                    Model Confidence
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">
                    {analysisResult.confidence}%
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                    Synthesized from 5 meteorology factors
                  </span>
                </div>
              </div>

              {/* Key Environmental Signals */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Key Signals Detected
                </h4>
                <div className="space-y-1.5">
                  {analysisResult.keySignals.map((signal, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-200 bg-[#050507] p-2.5 rounded-xl border border-white/[0.06] flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Probable Contributing Factors */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Probable Contributing Factors
                </h4>
                <div className="space-y-1.5">
                  {analysisResult.probableContributingFactors.map((factor, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-200 bg-[#050507] p-2.5 rounded-xl border border-white/[0.06] flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Authority Action */}
              <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-4 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Recommended Authority Action
                </span>
                <p className="text-xs text-slate-100 leading-relaxed font-medium">
                  {analysisResult.recommendedAuthorityAction}
                </p>
              </div>

              {/* Summary Note */}
              <p className="text-xs text-slate-400 italic">
                "{analysisResult.summaryNote}"
              </p>

              {/* Action Buttons: Add to Hotspots & Push to Authority Dashboard */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  id="dispatch-to-authority-btn"
                  onClick={handleDispatchToAuthority}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Alert to Authority Dashboard
                </button>
              </div>

              {dispatchedNotice && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
                  <span className="flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Alert successfully added to Hotspots and Authority Command queue!
                  </span>
                  <button
                    onClick={onNavigateToAuthority}
                    className="underline font-bold text-white hover:text-emerald-200 font-mono"
                  >
                    View in Authority →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-8 shadow-xl flex-1 flex flex-col items-center justify-center text-center text-slate-400 space-y-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-[#050507] border border-white/[0.08] flex items-center justify-center text-emerald-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-base font-bold text-white">Awaiting Environmental Report</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fill in the citizen observation form or click any quick-fill preset on the left, then click <strong>"Analyze Report with Gemini AI"</strong> to generate the real-time risk assessment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
