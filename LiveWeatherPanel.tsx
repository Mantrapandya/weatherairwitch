import React, { useEffect, useState, useCallback } from 'react';
import { LiveWeatherData } from '../types';
import { fetchLiveWeather } from '../services/weatherService';
import {
  Thermometer,
  Droplets,
  Wind,
  Compass,
  RefreshCw,
  AlertTriangle,
  Info,
  Radio,
} from 'lucide-react';

interface LiveWeatherPanelProps {
  lat: number;
  lng: number;
  locationName?: string;
  cityName?: string;
  className?: string;
}

export const LiveWeatherPanel: React.FC<LiveWeatherPanelProps> = ({
  lat,
  lng,
  locationName,
  cityName,
  className = '',
}) => {
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const loadWeather = useCallback(async (force = false, isMounted = () => true) => {
    try {
      if (!isMounted()) return;
      setLoading(true);
      setError(null);
      if (force) setIsRotating(true);

      const data = await fetchLiveWeather(lat, lng, force);
      if (!isMounted()) return;
      setWeather(data);
      setLastRefreshed(data.timestamp);
    } catch (err: any) {
      if (!isMounted()) return;
      setError(err?.message || 'Weather data temporarily unavailable');
      setWeather(null);
    } finally {
      if (isMounted()) {
        setLoading(false);
        setTimeout(() => {
          if (isMounted()) setIsRotating(false);
        }, 500);
      }
    }
  }, [lat, lng]);

  useEffect(() => {
    let mounted = true;
    loadWeather(false, () => mounted);
    return () => {
      mounted = false;
    };
  }, [loadWeather]);

  return (
    <div
      id="live-weather-panel"
      className={`rounded-2xl bg-[#08090d] border border-cyan-500/25 p-4 space-y-3.5 shadow-lg relative overflow-hidden ${className}`}
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-extrabold tracking-wider uppercase flex items-center gap-1">
            <Radio className="w-3 h-3 text-cyan-400" />
            LIVE WEATHER DATA
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lastRefreshed && (
            <span className="text-[10px] font-mono text-slate-400">
              Updated: <strong className="text-slate-300 font-semibold">{lastRefreshed}</strong>
            </span>
          )}
          <button
            onClick={() => loadWeather(true)}
            disabled={loading}
            title="Refresh Live Weather from Open-Meteo"
            className="p-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-cyan-300 border border-white/[0.08] transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating || loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Rendering: Loading, Error, or Live Data */}
      {loading && !weather ? (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
          <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">
            Fetching real-time telemetry from Open-Meteo API...
          </p>
          <span className="text-[10px] text-slate-500 font-mono">
            Target coords: {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
          </span>
        </div>
      ) : error ? (
        <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-xl space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-mono font-bold">Weather data temporarily unavailable</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Could not fetch live weather from Open-Meteo API. No simulated values are substituted.
          </p>
          <button
            onClick={() => loadWeather(true)}
            className="mt-1 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg text-xs font-mono font-semibold transition"
          >
            Retry Live Fetch
          </button>
        </div>
      ) : weather ? (
        <>
          {/* 4-Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. Temperature */}
            <div className="bg-[#050507] p-2.5 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
                <span>Temp</span>
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="mt-1">
                <span className="text-base font-bold font-mono text-white">
                  {weather.temperature}°C
                </span>
                <span className="block text-[9px] text-slate-500 font-mono mt-0.5">
                  Ambient 2m
                </span>
              </div>
            </div>

            {/* 2. Relative Humidity */}
            <div className="bg-[#050507] p-2.5 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
                <span>Humidity</span>
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="mt-1">
                <span className="text-base font-bold font-mono text-white">
                  {weather.humidity}%
                </span>
                <span className="block text-[9px] text-slate-500 font-mono mt-0.5">
                  {weather.humidity > 75 ? 'High (trapping)' : 'Moderate'}
                </span>
              </div>
            </div>

            {/* 3. Wind Speed */}
            <div className="bg-[#050507] p-2.5 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
                <span>Wind Speed</span>
                <Wind className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="mt-1">
                <span className="text-base font-bold font-mono text-white">
                  {weather.windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
                </span>
                <span className="block text-[9px] text-slate-500 font-mono mt-0.5">
                  {weather.windSpeed < 5 ? 'Stagnant (poor disp.)' : 'Active ventilation'}
                </span>
              </div>
            </div>

            {/* 4. Wind Direction */}
            <div className="bg-[#050507] p-2.5 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase">
                <span>Direction</span>
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold font-mono text-white">
                    {weather.windDirectionCompass}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-300">
                    ({weather.windDirection}°)
                  </span>
                </div>
                <span className="block text-[9px] text-slate-500 font-mono mt-0.5">
                  Azimuth vector
                </span>
              </div>
            </div>
          </div>

          {/* Meteorological Dispersion Impact Note & Scientific Separation */}
          <div className="p-2.5 bg-[#050507] rounded-xl border border-white/[0.06] flex items-start gap-2 text-[11px] text-slate-300">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="leading-relaxed">
                <strong className="text-cyan-300 font-semibold">Physical Dispersion Dynamics:</strong>{' '}
                Wind at <span className="font-mono text-white">{weather.windSpeed} km/h</span> from the{' '}
                <span className="font-mono text-white">{weather.windDirectionCompass}</span> ({weather.windDirection}°) with{' '}
                <span className="font-mono text-white">{weather.humidity}%</span> humidity indicates{' '}
                <span className="text-slate-200">
                  {weather.windSpeed < 4
                    ? 'low atmospheric ventilation and particulate accumulation.'
                    : weather.windSpeed > 12
                    ? 'rapid aerosol dispersion and increased road dust resuspension potential.'
                    : 'moderate convective dispersion.'}
                </span>
              </p>
              <p className="text-[10px] text-slate-400 font-mono italic">
                * Live weather data retrieved via Open-Meteo API. Weather observations are presented separately from AI-synthesized pollution risk scores and are not official CPCB measurements.
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
