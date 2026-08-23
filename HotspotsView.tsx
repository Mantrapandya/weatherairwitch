import React, { useState } from 'react';
import { HotspotLocation, RiskLevel } from '../types';
import { IndiaMap } from './IndiaMap';
import { SimulatedBadge } from './SimulatedBadge';
import {
  MapPin,
  Search,
  Filter,
  AlertTriangle,
  Wind,
  ShieldAlert,
  Send,
  Eye,
  Layers,
  Sparkles,
} from 'lucide-react';

interface HotspotsViewProps {
  hotspots: HotspotLocation[];
  selectedHotspot: HotspotLocation | null;
  onSelectHotspot: (hotspot: HotspotLocation) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onDispatchAlert: (hotspot: HotspotLocation) => void;
}

export const HotspotsView: React.FC<HotspotsViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  selectedCity,
  onSelectCity,
  onDispatchAlert,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<'ALL' | RiskLevel>('ALL');
  const [filterSource, setFilterSource] = useState<string>('ALL');

  const filteredHotspots = hotspots.filter((spot) => {
    const matchesCity = selectedCity === 'ALL' || spot.city === selectedCity;
    const matchesLevel = filterLevel === 'ALL' || spot.riskLevel === filterLevel;
    const matchesSource = filterSource === 'ALL' || spot.dominantSource === filterSource;
    const matchesSearch =
      spot.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.wardNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesLevel && matchesSource && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hyperlocal Pollution Hotspots Explorer
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Real-time geospatial hotspot intelligence across Ahmedabad, Delhi, Mumbai, and Bengaluru. Click any marker to view sensor readings and AI risk synthesis.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SimulatedBadge text="SIMULATED HOTSPOT REGISTRY" size="md" />
        </div>
      </div>

      {/* Main Interactive Map */}
      <IndiaMap
        hotspots={hotspots}
        selectedHotspot={selectedHotspot}
        onSelectHotspot={onSelectHotspot}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
        onDispatchAlert={onDispatchAlert}
      />

      {/* Hotspots Search and List Directory */}
      <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Monitored Ward Hotspot Directory</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400">
              {filteredHotspots.length} locations
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ward, street, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050507] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Severity:
            </span>
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                  filterLevel === lvl
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-[#050507] text-slate-400 hover:text-slate-200 border border-white/[0.08]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Source:
            </span>
            {['ALL', 'Industrial', 'Vehicular', 'Biomass/Waste', 'Construction Dust'].map((src) => (
              <button
                key={src}
                onClick={() => setFilterSource(src)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                  filterSource === src
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#050507] text-slate-400 hover:text-slate-200 border border-white/[0.08]'
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        {/* Hotspot Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredHotspots.map((spot) => {
            const isSelected = selectedHotspot?.id === spot.id;
            const isHigh = spot.riskLevel === 'HIGH';
            const isMed = spot.riskLevel === 'MEDIUM';

            return (
              <div
                key={spot.id}
                onClick={() => onSelectHotspot(spot)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-[#141820] border-emerald-500 shadow-xl ring-1 ring-emerald-500/50'
                    : 'bg-[#050507] border-white/[0.08] hover:bg-[#0a0c10] hover:border-white/[0.15]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      {spot.city} • {spot.wardNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold border ${
                        isHigh
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : isMed
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {spot.riskLevel}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white tracking-tight leading-snug">
                    {spot.locationName}
                  </h4>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-[#0a0c10] p-2 rounded-xl border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-slate-400 block">PM2.5</span>
                      <span className="font-bold font-mono text-white">{spot.signals.pm25}</span>
                    </div>
                    <div className="bg-[#0a0c10] p-2 rounded-xl border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-slate-400 block">PM10</span>
                      <span className="font-bold font-mono text-white">{spot.signals.pm10}</span>
                    </div>
                    <div className="bg-[#0a0c10] p-2 rounded-xl border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-slate-400 block">Risk Score</span>
                      <span
                        className={`font-bold font-mono ${
                          isHigh ? 'text-red-400' : isMed ? 'text-orange-400' : 'text-emerald-400'
                        }`}
                      >
                        {spot.riskScore}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    <strong>Probable:</strong> {spot.probableContributingFactors.join(' • ')}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{spot.timestamp}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDispatchAlert(spot);
                    }}
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 font-mono"
                  >
                    <Send className="w-3 h-3" />
                    <span>Dispatch Alert</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
