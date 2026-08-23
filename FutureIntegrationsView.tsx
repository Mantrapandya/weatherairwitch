import React from 'react';
import { FUTURE_INTEGRATIONS_DATA } from '../data/mockData';
import { SimulatedBadge } from './SimulatedBadge';
import {
  Satellite,
  CloudSun,
  Cpu,
  Camera,
  ShieldCheck,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Globe2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const FutureIntegrationsView: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Satellite':
        return <Satellite className="w-6 h-6 text-sky-400" />;
      case 'CloudSun':
        return <CloudSun className="w-6 h-6 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      case 'Camera':
        return <Camera className="w-6 h-6 text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-cyan-400" />;
      default:
        return <Layers className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Future Data Ingestion Pipeline & Architecture
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Designed with a modular ingestion architecture ready to connect high-throughput orbital rasters, physical IoT mesh streams, and official regulatory CAAQMS feeds.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              MODULAR INGESTION ROADMAP
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Explicitly labeled: Not active in MVP simulation
            </span>
          </div>
        </div>
      </div>

      {/* Future Integrations 5 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FUTURE_INTEGRATIONS_DATA.map((item) => (
          <div
            key={item.id}
            className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden group hover:border-white/[0.15] transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="p-3 rounded-2xl bg-[#050507] border border-white/[0.08]">
                  {getIcon(item.iconName)}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-extrabold uppercase ${
                    item.status.includes('LIVE')
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                {item.category}
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                {item.description}
              </p>

              {/* Data Sources */}
              <div className="mt-4 space-y-1.5 pt-3 border-t border-white/[0.06]">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Planned Target Feeds:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.dataSources.map((source, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-[#050507] text-slate-300 text-[10px] font-mono border border-white/[0.08] font-medium"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>

              {/* Value Add */}
              <div className="mt-3 text-xs text-slate-300 bg-[#050507] p-3 rounded-xl border border-white/[0.08]">
                <strong className="text-emerald-400">Intelligence Value:</strong> {item.valueAdd}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/[0.06] font-mono">
              <span>{item.id}</span>
              <span className="text-slate-400 italic">Interface ready in API specs</span>
            </div>
          </div>
        ))}

        {/* Sixth Card: Google AI Hackathon Project Summary */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-[#0f1115] to-[#0f1115] border border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <SimulatedBadge text="HACKATHON MVP" size="sm" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              AirWatch AI Architecture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              Engineered with full-stack TypeScript (Express + Vite + React), server-side Gemini 2.5 Flash environmental reasoning, and differential privacy federated intelligence simulation.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero client-side API key leakage (server proxy)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Domain-calibrated meteorological synthesis heuristics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Multi-city Indian hotspot coordinate projection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Immediate authority field directive generation</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 text-[11px] text-emerald-300 font-mono font-semibold flex items-center justify-between">
            <span>Production-ready design system</span>
            <span>v1.0-MVP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
