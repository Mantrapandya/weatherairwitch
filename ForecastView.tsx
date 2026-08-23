import React, { useState } from 'react';
import { HOURLY_FORECAST_DATA } from '../data/mockData';
import { SimulatedBadge } from './SimulatedBadge';
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Wind,
  Layers,
  Thermometer,
  ShieldAlert,
  Info,
  Sun,
  Moon,
  CloudSun,
  Activity,
} from 'lucide-react';
import { RiskLevel } from '../types';
import { LiveWeatherPanel } from './LiveWeatherPanel';
import { CITY_COORDINATES } from '../services/weatherService';

export const ForecastView: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Delhi');

  const currentPoint = HOURLY_FORECAST_DATA[0];
  const twoHourPoint = HOURLY_FORECAST_DATA[2];
  const sixHourPoint = HOURLY_FORECAST_DATA[5];
  const twelveHourPoint = HOURLY_FORECAST_DATA[7];

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'HIGH':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'MEDIUM':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'LOW':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header with Mandatory Label */}
      <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Clock className="w-5 h-5" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                24-Hour Pollution Risk Forecast
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Predictive simulation modeling diurnal atmospheric boundary layer dynamics, thermal inversion likelihood, and forward particulate accumulation trends.
            </p>
          </div>

          {/* Critical Mandated Label */}
          <div className="flex flex-col sm:items-end gap-2">
            <span className="px-4 py-2 rounded-xl text-xs font-mono font-black tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner">
              SIMULATED FORECAST — DEMO DATA
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Heuristic dispersion model for hackathon evaluation
            </span>
          </div>
        </div>

        {/* City Filter Tabs */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Selected Urban Center:
          </span>
          {['Delhi', 'Ahmedabad', 'Mumbai', 'Bengaluru'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
                selectedCity === city
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-[#050507] text-slate-400 hover:text-slate-200 border border-white/[0.08]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Live Meteorological Observations from Open-Meteo API */}
      <LiveWeatherPanel
        lat={CITY_COORDINATES[selectedCity]?.lat || 28.6139}
        lng={CITY_COORDINATES[selectedCity]?.lng || 77.2090}
        cityName={selectedCity}
      />

      {/* Primary Forecast Horizon Cards (Current, 2-Hour, 6-Hour, 12-Hour) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Risk */}
        <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
            <span>Current Risk</span>
            <span className="text-[10px] bg-white/[0.06] px-2 py-0.5 rounded text-slate-300">Live</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-white">{currentPoint.riskScore}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold border ${getRiskBadge(currentPoint.riskLevel)}`}>
              {currentPoint.riskLevel}
            </span>
          </div>
          <div className="space-y-1 text-xs text-slate-400 pt-1 border-t border-white/[0.06] font-mono">
            <div className="flex justify-between">
              <span>PM2.5 / PM10:</span>
              <span className="font-bold text-slate-200">{currentPoint.pm25} / {currentPoint.pm10}</span>
            </div>
            <div className="flex justify-between">
              <span>Wind Speed:</span>
              <span className="font-bold text-slate-200">{currentPoint.windSpeed} km/h</span>
            </div>
            <div className="flex justify-between">
              <span>Inversion Risk:</span>
              <span className="font-bold text-red-400">{currentPoint.inversionRisk}</span>
            </div>
          </div>
        </div>

        {/* 2-Hour Risk */}
        <div className="bg-[#0f1115] border border-red-500/30 rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-red-400 font-mono font-semibold uppercase tracking-wider">
            <span>2-Hour Risk</span>
            <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8 pts
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-red-400">{twoHourPoint.riskScore}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold border ${getRiskBadge(twoHourPoint.riskLevel)}`}>
              {twoHourPoint.riskLevel}
            </span>
          </div>
          <div className="space-y-1 text-xs text-slate-400 pt-1 border-t border-white/[0.06] font-mono">
            <div className="flex justify-between">
              <span>Predicted PM2.5:</span>
              <span className="font-bold text-red-300">{twoHourPoint.pm25} µg/m³</span>
            </div>
            <div className="flex justify-between">
              <span>Stagnation Index:</span>
              <span className="font-bold text-red-400">High (15/100)</span>
            </div>
            <div className="flex justify-between">
              <span>Morning Peak:</span>
              <span className="font-bold text-amber-300">Rush Build</span>
            </div>
          </div>
        </div>

        {/* 6-Hour Risk */}
        <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">
            <span>6-Hour Risk</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
              <TrendingDown className="w-3 h-3" /> -6 pts
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-orange-400">{sixHourPoint.riskScore}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold border ${getRiskBadge(sixHourPoint.riskLevel)}`}>
              {sixHourPoint.riskLevel}
            </span>
          </div>
          <div className="space-y-1 text-xs text-slate-400 pt-1 border-t border-white/[0.06] font-mono">
            <div className="flex justify-between">
              <span>Predicted PM2.5:</span>
              <span className="font-bold text-slate-200">{sixHourPoint.pm25} µg/m³</span>
            </div>
            <div className="flex justify-between">
              <span>Solar Warming:</span>
              <span className="font-bold text-emerald-400">Boundary Opening</span>
            </div>
            <div className="flex justify-between">
              <span>Wind Speed:</span>
              <span className="font-bold text-slate-200">{sixHourPoint.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* Risk Trend Summary */}
        <div className="bg-[#0f1115] border border-emerald-500/30 rounded-3xl p-5 shadow-lg space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 block">
            Overall Trend Velocity
          </span>
          <div className="text-lg font-bold text-white flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Diurnal Bimodal Surge</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            Particulate risk peaks during nocturnal cooling (04:00-07:00), softens with midday solar thermal mixing (12:00-15:00), and climbs again after sunset.
          </p>
        </div>
      </div>

      {/* 24-Hour Interactive Timeline Visualizer */}
      <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              24-Hour Diurnal Pollution Risk Trajectory
            </h3>
            <p className="text-xs text-slate-400">
              Hourly simulated particulate and dispersion index for {selectedCity}
            </p>
          </div>
          <SimulatedBadge text="HOURLY SYNTHESIS" size="sm" />
        </div>

        {/* Bar & Line Chart Representation */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-11 gap-2 items-end h-56 bg-[#050507] p-4 rounded-2xl border border-white/[0.08]">
            {HOURLY_FORECAST_DATA.map((point, idx) => {
              const heightPercent = Math.round((point.riskScore / 100) * 100);
              const isHigh = point.riskScore >= 70;
              const isMed = point.riskScore >= 40 && point.riskScore < 70;

              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 bg-[#0a0c10] border border-white/[0.15] text-white text-[10px] p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20 shadow-xl font-mono">
                    <div className="font-bold">{point.timeLabel}</div>
                    <div>PM2.5: {point.pm25} µg/m³ • Wind: {point.windSpeed}km/h</div>
                  </div>

                  {/* Score Label above Bar */}
                  <span className="text-[10px] font-mono font-bold text-slate-400 mb-1 group-hover:text-white transition">
                    {point.riskScore}
                  </span>

                  {/* Visual Bar */}
                  <div
                    className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                      isHigh
                        ? 'bg-gradient-to-t from-red-600 to-red-400 group-hover:brightness-125'
                        : isMed
                        ? 'bg-gradient-to-t from-orange-600 to-orange-400 group-hover:brightness-125'
                        : 'bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:brightness-125'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>

                  {/* Hour Label */}
                  <span className="text-[9px] font-mono text-slate-400 font-medium mt-2 truncate w-full text-center">
                    {point.timeLabel.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-500"></span> High Risk (Score ≥ 70)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-orange-500"></span> Medium Risk (40-69)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span> Low Risk (&lt;40)
            </span>
            <span>0-100 Synthetic Risk Score</span>
          </div>
        </div>

        {/* Meteorological Insights Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#050507] p-4 rounded-2xl border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1 font-mono">
              <Wind className="w-4 h-4" />
              Wind Dispersion Potential
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nocturnal surface winds drop below 3 km/h, preventing horizontal advection and concentrating local emissions in low-lying pockets.
            </p>
          </div>

          <div className="bg-[#050507] p-4 rounded-2xl border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1 font-mono">
              <Layers className="w-4 h-4" />
              Planetary Boundary Layer
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mixing layer compresses to 220m during early morning hours, creating a physical ceiling that traps tailpipe aerosols.
            </p>
          </div>

          <div className="bg-[#050507] p-4 rounded-2xl border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1 font-mono">
              <Sun className="w-4 h-4" />
              Midday Ventilation Window
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Solar irradiance expands the vertical boundary layer past 1,200m between 11:00 and 16:00, temporarily dispersing surface particulate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
