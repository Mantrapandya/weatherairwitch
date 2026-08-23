import React, { useState } from 'react';
import { HotspotLocation, RiskLevel } from '../types';
import {
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Info,
  Maximize2,
  Minimize2,
  Navigation,
  Activity,
  Layers,
  Send,
} from 'lucide-react';
import { SimulatedBadge } from './SimulatedBadge';
import { LiveWeatherPanel } from './LiveWeatherPanel';

interface IndiaMapProps {
  hotspots: HotspotLocation[];
  selectedHotspot: HotspotLocation | null;
  onSelectHotspot: (hotspot: HotspotLocation) => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onDispatchAlert?: (hotspot: HotspotLocation) => void;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  selectedCity = 'ALL',
  onSelectCity,
  onDispatchAlert,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | RiskLevel>('ALL');
  const [viewMode, setViewMode] = useState<'HOTSPOTS' | 'HEATMAP' | 'SOURCES'>('HOTSPOTS');

  const filteredHotspots = hotspots.filter((h) => {
    const matchesCity = selectedCity === 'ALL' || h.city === selectedCity;
    const matchesSeverity = filterSeverity === 'ALL' || h.riskLevel === filterSeverity;
    return matchesCity && matchesSeverity;
  });

  const getMarkerColor = (level: RiskLevel) => {
    switch (level) {
      case 'HIGH':
        return {
          fill: '#ef4444',
          stroke: '#991b1b',
          glow: 'rgba(239, 68, 68, 0.45)',
          bg: 'bg-red-500',
          text: 'text-red-600 dark:text-red-400',
          badge: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30',
        };
      case 'MEDIUM':
        return {
          fill: '#f97316',
          stroke: '#9a3412',
          glow: 'rgba(249, 115, 22, 0.45)',
          bg: 'bg-orange-500',
          text: 'text-orange-600 dark:text-orange-400',
          badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
        };
      case 'LOW':
        return {
          fill: '#10b981',
          stroke: '#065f46',
          glow: 'rgba(16, 185, 129, 0.45)',
          bg: 'bg-emerald-500',
          text: 'text-emerald-600 dark:text-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        };
    }
  };

  const cities = ['ALL', 'Ahmedabad', 'Delhi', 'Mumbai', 'Bengaluru'];

  return (
    <div id="india-map-container" className="bg-[#0f1115] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl text-slate-100 flex flex-col">
      {/* Top Map Toolbar */}
      <div className="p-4 bg-[#0a0c10] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm tracking-wide text-white">
                Hyperlocal India Pollution Hotspot Map
              </h3>
              <SimulatedBadge text="SIMULATED SPATIAL FEEDS" size="sm" />
            </div>
            <p className="text-xs text-slate-400">
              Interactive risk markers with real-time micro-meteorology and source attribution
            </p>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#050507] p-1 rounded-xl border border-white/[0.08]">
          {cities.map((city) => (
            <button
              key={city}
              id={`map-city-filter-${city.toLowerCase()}`}
              onClick={() => onSelectCity && onSelectCity(city)}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-lg transition-all ${
                selectedCity === city
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-toolbar with Severity Filter and Legend */}
      <div className="px-4 py-2.5 bg-[#08090d] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider font-semibold">Filter Risk:</span>
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition ${
              filterSeverity === 'ALL' ? 'bg-white/[0.1] text-white' : 'text-slate-400 hover:bg-white/[0.05]'
            }`}
          >
            All ({hotspots.length})
          </button>
          <button
            onClick={() => setFilterSeverity('HIGH')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium transition ${
              filterSeverity === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-red-400 hover:bg-red-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span> High (
            {hotspots.filter((h) => h.riskLevel === 'HIGH').length})
          </button>
          <button
            onClick={() => setFilterSeverity('MEDIUM')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium transition ${
              filterSeverity === 'MEDIUM' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'text-orange-400 hover:bg-orange-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500"></span> Medium (
            {hotspots.filter((h) => h.riskLevel === 'MEDIUM').length})
          </button>
          <button
            onClick={() => setFilterSeverity('LOW')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium transition ${
              filterSeverity === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low (
            {hotspots.filter((h) => h.riskLevel === 'LOW').length})
          </button>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> RED = HIGH (≥70)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span> ORANGE = MED (40-69)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span> GREEN = LOW (&lt;40)
          </span>
        </div>
      </div>

      {/* Map Graphic Area and Details Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[500px]">
        {/* SVG Map Canvas */}
        <div className="lg:col-span-7 relative bg-[#050507] p-4 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/[0.08]">
          {/* Subtle Grid Lines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>

          {/* Interactive SVG Projection */}
          <svg
            viewBox="100 80 500 850"
            className="w-full max-h-[560px] select-none transition-transform duration-300 drop-shadow-2xl"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <defs>
              <radialGradient id="highRiskGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="mediumRiskGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#f97316" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="lowRiskGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
              <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Stylized Accurate India Contour Boundary Path */}
            <path
              d="M 330 110 
                 C 340 100, 365 110, 380 140 
                 C 400 160, 420 180, 440 210
                 C 470 230, 500 240, 515 250
                 C 530 260, 560 270, 570 290
                 C 560 310, 540 320, 530 335
                 C 515 350, 490 355, 480 375
                 C 470 395, 460 410, 480 430
                 C 500 450, 520 465, 540 480
                 C 525 500, 500 520, 475 550
                 C 455 580, 440 610, 430 650
                 C 420 700, 410 750, 380 820
                 C 360 870, 340 895, 330 900
                 C 320 890, 300 840, 280 770
                 C 265 720, 255 670, 250 630
                 C 245 590, 240 550, 255 520
                 C 265 495, 230 480, 210 470
                 C 180 460, 160 470, 150 490
                 C 140 510, 160 540, 180 545
                 C 195 550, 210 540, 230 520
                 C 250 490, 260 460, 270 420
                 C 280 370, 275 320, 290 280
                 C 300 240, 310 190, 315 150
                 Z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="2.5"
              className="transition-colors duration-300 hover:fill-slate-800/80"
            />

            {/* Inner Sub-regions & River Network Accents */}
            <path
              d="M 285 470 Q 320 450 360 460 T 430 480"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.4"
            />
            <path
              d="M 390 270 Q 420 320 450 380 T 510 450"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.4"
            />

            {/* City Regional Anchor Markers */}
            <g id="city-anchors" className="pointer-events-none">
              {/* Ahmedabad Anchor */}
              <circle cx="282" cy="475" r="3" fill="#94a3b8" />
              <text x="230" y="472" fill="#cbd5e1" fontSize="13" fontWeight="600" fontFamily="sans-serif">
                Ahmedabad
              </text>

              {/* Delhi Anchor */}
              <circle cx="410" cy="285" r="3" fill="#94a3b8" />
              <text x="425" y="280" fill="#cbd5e1" fontSize="13" fontWeight="600" fontFamily="sans-serif">
                Delhi NCR
              </text>

              {/* Mumbai Anchor */}
              <circle cx="288" cy="620" r="3" fill="#94a3b8" />
              <text x="215" y="625" fill="#cbd5e1" fontSize="13" fontWeight="600" fontFamily="sans-serif">
                Mumbai
              </text>

              {/* Bengaluru Anchor */}
              <circle cx="415" cy="815" r="3" fill="#94a3b8" />
              <text x="430" y="820" fill="#cbd5e1" fontSize="13" fontWeight="600" fontFamily="sans-serif">
                Bengaluru
              </text>
            </g>

            {/* Hotspot Pulse Glow Circles & Markers */}
            {filteredHotspots.map((spot) => {
              const isSelected = selectedHotspot?.id === spot.id;
              const colorInfo = getMarkerColor(spot.riskLevel);
              const glowId =
                spot.riskLevel === 'HIGH'
                  ? 'url(#highRiskGlow)'
                  : spot.riskLevel === 'MEDIUM'
                  ? 'url(#mediumRiskGlow)'
                  : 'url(#lowRiskGlow)';

              return (
                <g
                  key={spot.id}
                  id={`svg-marker-${spot.id}`}
                  onClick={() => onSelectHotspot(spot)}
                  className="cursor-pointer transition-transform hover:scale-125"
                  style={{ transformOrigin: `${spot.coordinates.svgX}px ${spot.coordinates.svgY}px` }}
                >
                  {/* Outer Radar Glow Pulse */}
                  <circle
                    cx={spot.coordinates.svgX}
                    cy={spot.coordinates.svgY}
                    r={isSelected ? 36 : 24}
                    fill={glowId}
                    className={spot.riskLevel === 'HIGH' ? 'animate-pulse' : ''}
                  />

                  {/* Ring Indicator */}
                  <circle
                    cx={spot.coordinates.svgX}
                    cy={spot.coordinates.svgY}
                    r={isSelected ? 14 : 9}
                    fill={colorInfo.fill}
                    stroke={isSelected ? '#ffffff' : colorInfo.stroke}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter="url(#shadowGlow)"
                  />

                  {/* Center Dot */}
                  <circle
                    cx={spot.coordinates.svgX}
                    cy={spot.coordinates.svgY}
                    r={isSelected ? 5 : 3}
                    fill="#ffffff"
                  />

                  {/* Hotspot Score Pill (visible on selected or high risk) */}
                  {(isSelected || spot.riskLevel === 'HIGH') && (
                    <g transform={`translate(${spot.coordinates.svgX + 12}, ${spot.coordinates.svgY - 14})`}>
                      <rect
                        x="-2"
                        y="-10"
                        width="46"
                        height="18"
                        rx="9"
                        fill="#0f172a"
                        stroke={colorInfo.fill}
                        strokeWidth="1.5"
                        filter="url(#shadowGlow)"
                      />
                      <text
                        x="21"
                        y="3"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {spot.riskScore}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Map Floating Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 bg-[#0a0c10]/90 p-1.5 rounded-xl border border-white/[0.1] shadow-lg">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2))}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-300 transition"
              title="Zoom In"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-300 transition"
              title="Zoom Out"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-300 text-[10px] font-mono font-bold text-center"
              title="Reset View"
            >
              1x
            </button>
          </div>
        </div>

        {/* Selected Hotspot Intelligence Drawer / Inspector */}
        <div className="lg:col-span-5 p-5 bg-[#0d0f14] flex flex-col justify-between overflow-y-auto">
          {selectedHotspot ? (
            <div className="space-y-4">
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                    {selectedHotspot.city} • {selectedHotspot.wardNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                      getMarkerColor(selectedHotspot.riskLevel).badge
                    }`}
                  >
                    {selectedHotspot.riskLevel} RISK
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {selectedHotspot.locationName}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                  <span>Last updated: {selectedHotspot.timestamp}</span>
                  <span>•</span>
                  <span>{selectedHotspot.citizenReportCount} signals</span>
                </div>
              </div>

              {/* Risk Gauge Bar */}
              <div className="bg-[#050507] p-3.5 rounded-xl border border-white/[0.08]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">AI Risk Index</span>
                  <span className={`text-base font-extrabold font-mono ${getMarkerColor(selectedHotspot.riskLevel).text}`}>
                    {selectedHotspot.riskScore} / 100
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      getMarkerColor(selectedHotspot.riskLevel).bg
                    }`}
                    style={{ width: `${selectedHotspot.riskScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>0 Clean</span>
                  <span>40 Moderate</span>
                  <span>70 High</span>
                  <span>100 Hazard</span>
                </div>
              </div>

              {/* Simulated Particulate Sensor Telemetry */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider">Particulate Densities</span>
                  <span className="text-slate-400 text-[10px]">Simulated Sensor Signals</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#050507] p-2.5 rounded-xl border border-white/[0.08] text-center">
                    <div className="text-[10px] uppercase text-slate-400 font-mono font-medium">Fine PM2.5</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">{selectedHotspot.signals.pm25} µg/m³</div>
                    <div className="text-[9px] text-red-400 font-mono font-medium mt-0.5">
                      {Math.round((selectedHotspot.signals.pm25 / 30) * 10) / 10}x Safe Ceiling
                    </div>
                  </div>
                  <div className="bg-[#050507] p-2.5 rounded-xl border border-white/[0.08] text-center">
                    <div className="text-[10px] uppercase text-slate-400 font-mono font-medium">Coarse PM10</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">{selectedHotspot.signals.pm10} µg/m³</div>
                    <div className="text-[9px] text-amber-400 font-mono font-medium mt-0.5">Fugitive Dust</div>
                  </div>
                </div>
              </div>

              {/* LIVE WEATHER DATA (Open-Meteo API Real-Time Fetch) */}
              <LiveWeatherPanel
                lat={selectedHotspot.coordinates.lat}
                lng={selectedHotspot.coordinates.lng}
                locationName={selectedHotspot.locationName}
                cityName={selectedHotspot.city}
              />

              {/* Probable Factors */}
              <div>
                <h5 className="text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  Probable Contributing Factors
                </h5>
                <ul className="space-y-1.5">
                  {selectedHotspot.probableContributingFactors.map((factor, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-300 bg-[#050507] p-2 rounded-lg border border-white/[0.06] flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Authority Action */}
              <div className="bg-emerald-950/20 border border-emerald-500/25 p-3 rounded-xl">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1">
                  <span className="flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Recommended Authority Action
                  </span>
                  <span className="text-[11px] font-mono font-normal text-emerald-300">
                    Confidence: {selectedHotspot.confidence}%
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedHotspot.recommendedAction}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                {onDispatchAlert && (
                  <button
                    id="map-dispatch-alert-btn"
                    onClick={() => onDispatchAlert(selectedHotspot)}
                    className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch Authority Alert
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MapPin className="w-10 h-10 text-slate-600 mb-3 animate-bounce" />
              <h4 className="text-sm font-semibold text-slate-200">Select any Hotspot on the Map</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Click on any colored marker in Ahmedabad, Delhi, Mumbai, or Bengaluru to view live micro-sensor telemetry and AI risk assessment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
