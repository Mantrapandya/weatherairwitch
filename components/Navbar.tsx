import React from 'react';
import {
  ShieldAlert,
  MapPin,
  Flame,
  Clock,
  Network,
  Layers,
  FileText,
  Activity,
  Sparkles,
  Info,
} from 'lucide-react';
import { SimulatedBadge } from './SimulatedBadge';

export type TabType =
  | 'DASHBOARD'
  | 'REPORT'
  | 'HOTSPOTS'
  | 'FORECAST'
  | 'AUTHORITY'
  | 'INTELLIGENCE'
  | 'INTEGRATIONS';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  activeAlertCount: number;
  highRiskCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeAlertCount,
  highRiskCount,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'REPORT', label: 'Report Pollution', icon: <FileText className="w-4 h-4" /> },
    { id: 'HOTSPOTS', label: 'Hotspots', icon: <MapPin className="w-4 h-4" />, badge: highRiskCount },
    { id: 'FORECAST', label: 'Forecast', icon: <Clock className="w-4 h-4" /> },
    { id: 'AUTHORITY', label: 'Authority Alerts', icon: <ShieldAlert className="w-4 h-4" />, badge: activeAlertCount },
    { id: 'INTELLIGENCE', label: 'City Intelligence', icon: <Network className="w-4 h-4" /> },
    { id: 'INTEGRATIONS', label: 'Future Data', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#08090d]/95 backdrop-blur border-b border-white/[0.08] text-slate-100">
      {/* Top Banner Notice */}
      <div className="bg-[#050608] px-4 py-1.5 text-xs text-slate-300 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-emerald-400 tracking-wide">AirWatch AI MVP</span>
          <span className="text-slate-500 font-mono text-[11px]">| Hyperlocal Pollution Intelligence & Climate Action</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <SimulatedBadge text="PROTOTYPE DATA FOR HACKATHON" size="sm" />
          <span className="text-[11px] text-slate-400 font-medium">Indian Urban Cluster (Ahmedabad • Delhi • Mumbai • Bengaluru)</span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab('DASHBOARD')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#08090d] rounded-[10px] flex items-center justify-center text-emerald-400">
                <Flame className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white">AirWatch</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Pollution Signals → Climate Action
              </p>
            </div>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id.toLowerCase()}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                        item.id === 'AUTHORITY'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action button */}
          <div className="flex items-center gap-2">
            <button
              id="header-report-btn"
              onClick={() => onSelectTab('REPORT')}
              className="py-2 px-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Report Signal</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="md:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-white/[0.08] no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-white/[0.05]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
