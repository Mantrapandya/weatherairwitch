import React from 'react';
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Wind,
  Layers,
  Send,
  Eye,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { HotspotLocation, AuthorityAlert } from '../types';
import { SimulatedBadge } from './SimulatedBadge';
import { IndiaMap } from './IndiaMap';
import { TabType } from './Navbar';

interface DashboardViewProps {
  hotspots: HotspotLocation[];
  alerts: AuthorityAlert[];
  selectedHotspot: HotspotLocation | null;
  onSelectHotspot: (hotspot: HotspotLocation) => void;
  onNavigate: (tab: TabType) => void;
  onSelectCity: (city: string) => void;
  selectedCity: string;
  onDispatchAlert: (hotspot: HotspotLocation) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  hotspots,
  alerts,
  selectedHotspot,
  onSelectHotspot,
  onNavigate,
  onSelectCity,
  selectedCity,
  onDispatchAlert,
}) => {
  const highRiskHotspots = hotspots.filter((h) => h.riskLevel === 'HIGH');
  const activeAlerts = alerts.filter((a) => a.status === 'PENDING_REVIEW' || a.status === 'DISPATCHED');
  const totalMonitoredLocations = 48; // Expanded simulated network
  const monitoredCities = ['Ahmedabad', 'Delhi', 'Mumbai', 'Bengaluru'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Mission Section */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0d0f14] border border-white/[0.08] p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Hyperlocal Environmental Intelligence Platform
            </span>
            <SimulatedBadge text="SIMULATED DATA DEMO" size="sm" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            From Pollution Signals to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Climate Action</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            AirWatch AI combines citizen observations and environmental signals with AI-powered risk intelligence to detect hyperlocal pollution hotspots and support faster response across Indian urban ecosystems.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="hero-report-now-btn"
              onClick={() => onNavigate('REPORT')}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Submit Citizen Observation
            </button>

            <button
              id="hero-view-hotspots-btn"
              onClick={() => onNavigate('HOTSPOTS')}
              className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-white font-semibold text-xs sm:text-sm border border-white/[0.1] flex items-center gap-2 transition"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Explore Hotspot Map
            </button>

            <button
              id="hero-authority-btn"
              onClick={() => onNavigate('AUTHORITY')}
              className="px-5 py-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-red-300 font-semibold text-xs sm:text-sm border border-red-500/30 flex items-center gap-2 transition"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Authority Command View ({activeAlerts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Core KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monitored Locations */}
        <div className="bg-[#0f1115] border border-white/[0.08] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-white/[0.16] transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              Total Monitored
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              {totalMonitoredLocations}
            </span>
            <span className="text-xs text-slate-400 font-medium">Urban Wards</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            Simulated low-cost & citizen reporting mesh
          </p>
        </div>

        {/* High-Risk Hotspots */}
        <div className="bg-[#0f1115] border border-red-500/25 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-red-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-red-400">
              High-Risk Hotspots
            </span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-red-400 font-mono">
              {highRiskHotspots.length}
            </span>
            <span className="text-xs text-red-300/80 font-medium">Critical Zones</span>
          </div>
          <p className="text-[11px] text-red-300/70 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping shrink-0"></span>
            Exceeding particulate dispersion ceilings
          </p>
        </div>

        {/* Active Alerts */}
        <div className="bg-[#0f1115] border border-amber-500/25 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
              Active Alerts
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">
              {activeAlerts.length}
            </span>
            <span className="text-xs text-amber-300/80 font-medium">Dispatched / Queue</span>
          </div>
          <p className="text-[11px] text-amber-300/70 mt-2 flex items-center gap-1">
            <Send className="w-3 h-3 text-amber-400 shrink-0" />
            Simulated municipal & SPCB task forces
          </p>
        </div>

        {/* Cities Monitored */}
        <div className="bg-[#0f1115] border border-emerald-500/25 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
              Cities Monitored
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
              {monitoredCities.length}
            </span>
            <span className="text-xs text-emerald-300/80 font-medium">Primary Metros</span>
          </div>
          <p className="text-[11px] text-emerald-300/70 mt-2 truncate font-mono">
            Ahmedabad • Delhi • Mumbai • Bengaluru
          </p>
        </div>
      </div>

      {/* Interactive Hotspot Map Module */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Live India Pollution Risk Map
            </h2>
            <p className="text-xs text-slate-400">
              Hyperlocal telemetry, risk indicators (RED / ORANGE / GREEN), and AI attribution
            </p>
          </div>
          <button
            onClick={() => onNavigate('HOTSPOTS')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>Full Map Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <IndiaMap
          hotspots={hotspots}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={onSelectHotspot}
          selectedCity={selectedCity}
          onSelectCity={onSelectCity}
          onDispatchAlert={onDispatchAlert}
        />
      </div>

      {/* Two Column Section: Live Hotspot Ticker & Contributing Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent High Priority Hotspots Feed */}
        <div className="lg:col-span-7 bg-[#0f1115] border border-white/[0.08] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Active High-Priority Hotspots</h3>
              <SimulatedBadge text="SIMULATED" size="sm" />
            </div>
            <button
              onClick={() => onNavigate('HOTSPOTS')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View all ({hotspots.length})
            </button>
          </div>

          <div className="space-y-3">
            {hotspots.slice(0, 4).map((hotspot) => {
              const isHigh = hotspot.riskLevel === 'HIGH';
              const isMed = hotspot.riskLevel === 'MEDIUM';

              return (
                <div
                  key={hotspot.id}
                  onClick={() => onSelectHotspot(hotspot)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    selectedHotspot?.id === hotspot.id
                      ? 'bg-white/[0.06] border-emerald-500/40 shadow-md'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono ${
                        isHigh
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : isMed
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {hotspot.riskScore}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">
                          {hotspot.locationName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-300 font-mono">
                          {hotspot.city}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5 font-mono">
                        PM2.5: {hotspot.signals.pm25} µg/m³ • PM10: {hotspot.signals.pm10} µg/m³ • {hotspot.citizenReportCount} reports
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        isHigh
                          ? 'bg-red-500/20 text-red-300'
                          : isMed
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {hotspot.riskLevel}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">{hotspot.timestamp}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source Attribution & Climate Action Pipeline */}
        <div className="lg:col-span-5 space-y-4">
          {/* Emission Profile Breakdown */}
          <div className="bg-[#0f1115] border border-white/[0.08] rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Dominant Emission Profiles
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated from citizen observations and simulated meteorological modeling
            </p>

            <div className="space-y-2.5 pt-1">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1 font-mono">
                  <span>Vehicular Diesel Exhaust & Congestion</span>
                  <span className="text-emerald-400 font-bold">38%</span>
                </div>
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1 font-mono">
                  <span>Industrial & Chemical Boiler Plumes</span>
                  <span className="text-emerald-400 font-bold">29%</span>
                </div>
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '29%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1 font-mono">
                  <span>Unpaved Road & Construction Dust</span>
                  <span className="text-emerald-400 font-bold">21%</span>
                </div>
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '21%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1 font-mono">
                  <span>Open Biomass & Municipal Waste Combustion</span>
                  <span className="text-emerald-400 font-bold">12%</span>
                </div>
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Card to Report */}
          <div className="bg-[#0f1115] border border-emerald-500/25 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-sm text-white">Have a Citizen Observation?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Submit your local particulate observations, smog photos, or micro-sensor numbers. Gemini AI will instantly analyze environmental risk signals.
            </p>
            <button
              onClick={() => onNavigate('REPORT')}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <span>Launch Citizen Report Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
