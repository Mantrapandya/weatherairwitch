import React, { useState } from 'react';
import { CITY_INTELLIGENCE_NODES } from '../data/mockData';
import { SimulatedBadge } from './SimulatedBadge';
import {
  Network,
  Share2,
  ShieldCheck,
  RefreshCw,
  Cpu,
  CheckCircle2,
  Lock,
  ArrowRightLeft,
  Sparkles,
  Layers,
  Building2,
  Activity,
} from 'lucide-react';
import { CityNode } from '../types';
import { LiveWeatherPanel } from './LiveWeatherPanel';
import { CITY_COORDINATES } from '../services/weatherService';

export const CityIntelligenceView: React.FC = () => {
  const [nodes, setNodes] = useState<CityNode[]>(CITY_INTELLIGENCE_NODES);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<CityNode>(nodes[0]);
  const [federatedRound, setFederatedRound] = useState<number>(142);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncNotice(null);

    try {
      const res = await fetch('/api/federated-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: selectedNode.city }),
      });

      const data = await res.json();
      setFederatedRound((r) => r + 1);
      setSyncNotice(
        `Federated Round #${federatedRound + 1} completed! Synchronized updated dispersion weights across Ahmedabad, Delhi, Mumbai, and Bengaluru.`
      );
    } catch (err) {
      setFederatedRound((r) => r + 1);
      setSyncNotice(`Federated weight exchange simulated for Round #${federatedRound + 1}.`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Network className="w-5 h-5" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                City Intelligence Network
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Decentralized multi-city pollution intelligence exchange. Cities collaboratively refine micro-meteorological and source-attribution models while preserving citizen data privacy.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <SimulatedBadge text="FEDERATED INTELLIGENCE CONCEPT" size="md" />
            <span className="text-[11px] font-mono text-slate-400">
              Round #{federatedRound} • Differential Privacy ε = 0.85
            </span>
          </div>
        </div>

        {/* Primary Conceptual Explanation Box */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] bg-[#050507] p-4 rounded-2xl border border-white/[0.08] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-white">Privacy-Preserving Collaborative Learning</h4>
            <p className="text-slate-300 leading-relaxed">
              <strong>"Cities can exchange learned insights without requiring all raw citizen observations to be centralized."</strong>
              <br />
              Local edge models train on municipal sensor streams and citizen reports on-device. Only anonymous model gradient updates (e.g. boundary layer trapping weights, dust resuspension curves) are shared with the national aggregator.
            </p>
            <p className="text-[10px] text-slate-400 italic pt-0.5 font-mono">
              * For this MVP, this architecture is a high-fidelity conceptual simulation demonstrating future production federated deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Sync Success Notification */}
      {syncNotice && (
        <div className="bg-purple-500/20 border border-purple-500/50 text-purple-200 p-4 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn font-mono">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
            <span>{syncNotice}</span>
          </div>
          <button
            onClick={() => setSyncNotice(null)}
            className="text-xs text-purple-300 hover:text-white underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Network Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nodes.map((node) => {
          const isSelected = selectedNode.city === node.city;

          return (
            <div
              key={node.city}
              onClick={() => setSelectedNode(node)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-[#141820] border-purple-500 shadow-2xl ring-1 ring-purple-500/50'
                  : 'bg-[#0f1115] border-white/[0.08] hover:bg-[#141820]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                    {node.state}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#050507] text-slate-400 border border-white/[0.08] font-mono">
                    {node.edgeModelVersion}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{node.city}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {node.dominantChallenge}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-[#050507] p-2 rounded-xl border border-white/[0.08]">
                    <span className="text-[10px] font-mono text-slate-400 block">Avg Risk</span>
                    <span className="font-bold font-mono text-amber-400">{node.avgRiskScore}/100</span>
                  </div>
                  <div className="bg-[#050507] p-2 rounded-xl border border-white/[0.08]">
                    <span className="text-[10px] font-mono text-slate-400 block">Active Hotspots</span>
                    <span className="font-bold font-mono text-white">{node.activeHotspots}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Dataset: {node.localDatasetSize.toLocaleString()} records</span>
                <span className="text-emerald-400">Synced {node.lastFederatedSync}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Federated Node Inspector & Topology Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Node Topology Diagram */}
        <div className="lg:col-span-7 bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-400" />
                Inter-City Gradient Exchange Topology
              </h3>
              <SimulatedBadge text="ACTIVE MESH" size="sm" />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Synchronizing non-linear meteorological weights across distinct ecological zones
            </p>
          </div>

          {/* Graphical Topology Canvas */}
          <div className="relative bg-[#050507] rounded-2xl p-6 border border-white/[0.08] h-72 flex items-center justify-center overflow-hidden">
            {/* Center Aggregator Hub */}
            <div className="z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-900 to-indigo-600 border-2 border-purple-400/80 p-1 flex flex-col items-center justify-center text-center shadow-xl shadow-purple-950 animate-pulse">
              <Cpu className="w-6 h-6 text-white mb-0.5" />
              <span className="text-[10px] font-mono font-extrabold text-white uppercase">Central Hub</span>
              <span className="text-[8px] font-mono text-purple-200">Aggregator</span>
            </div>

            {/* Connecting Rays */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
              <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
              <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
              <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            </svg>

            {/* Ahmedabad Node (Top Left) */}
            <div
              onClick={() => setSelectedNode(nodes[0])}
              className={`absolute top-4 left-6 p-2.5 rounded-xl border cursor-pointer transition ${
                selectedNode.city === 'Ahmedabad'
                  ? 'bg-[#141820] border-purple-400 shadow-lg scale-105'
                  : 'bg-[#0f1115] border-white/[0.08] hover:bg-[#141820]'
              }`}
            >
              <div className="text-xs font-bold text-white">Ahmedabad</div>
              <div className="text-[9px] font-mono text-purple-300">Industrial Plumes</div>
            </div>

            {/* Delhi Node (Top Right) */}
            <div
              onClick={() => setSelectedNode(nodes[1])}
              className={`absolute top-4 right-6 p-2.5 rounded-xl border cursor-pointer transition ${
                selectedNode.city === 'Delhi'
                  ? 'bg-[#141820] border-purple-400 shadow-lg scale-105'
                  : 'bg-[#0f1115] border-white/[0.08] hover:bg-[#141820]'
              }`}
            >
              <div className="text-xs font-bold text-white">Delhi NCR</div>
              <div className="text-[9px] font-mono text-purple-300">Thermal Inversion</div>
            </div>

            {/* Mumbai Node (Bottom Left) */}
            <div
              onClick={() => setSelectedNode(nodes[2])}
              className={`absolute bottom-4 left-6 p-2.5 rounded-xl border cursor-pointer transition ${
                selectedNode.city === 'Mumbai'
                  ? 'bg-[#141820] border-purple-400 shadow-lg scale-105'
                  : 'bg-[#0f1115] border-white/[0.08] hover:bg-[#141820]'
              }`}
            >
              <div className="text-xs font-bold text-white">Mumbai</div>
              <div className="text-[9px] font-mono text-purple-300">Marine Coastal Aerosols</div>
            </div>

            {/* Bengaluru Node (Bottom Right) */}
            <div
              onClick={() => setSelectedNode(nodes[3])}
              className={`absolute bottom-4 right-6 p-2.5 rounded-xl border cursor-pointer transition ${
                selectedNode.city === 'Bengaluru'
                  ? 'bg-[#141820] border-purple-400 shadow-lg scale-105'
                  : 'bg-[#0f1115] border-white/[0.08] hover:bg-[#141820]'
              }`}
            >
              <div className="text-xs font-bold text-white">Bengaluru</div>
              <div className="text-[9px] font-mono text-purple-300">Traffic Micro-Corridors</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 font-mono">
              Zero Raw PII Exchanged • Only Model Hyperplane Deltas
            </span>
            <button
              id="simulate-federated-round-btn"
              disabled={isSyncing}
              onClick={handleTriggerSync}
              className="py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-purple-950 transition active:scale-95"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Aggregating Gradients...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Simulate Federated Sync Round</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected City Learned Insights Drawer */}
        <div className="lg:col-span-5 bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400">
                Node Inspection
              </span>
              <h4 className="text-lg font-bold text-white">{selectedNode.city} Edge Node</h4>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#050507] text-slate-300 border border-white/[0.08]">
              {selectedNode.edgeModelVersion}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Live Weather Observations via Open-Meteo */}
            <LiveWeatherPanel
              lat={selectedNode.coordinates.lat}
              lng={selectedNode.coordinates.lng}
              cityName={selectedNode.city}
            />

            <div>
              <span className="text-slate-400 font-semibold block mb-1">
                Dominant Ecological Airshed Challenge:
              </span>
              <p className="text-slate-200 bg-[#050507] p-3 rounded-xl border border-white/[0.08]">
                {selectedNode.dominantChallenge}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-1.5 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Learned Pattern Insights Exported to Mesh:
              </span>
              <div className="space-y-2">
                {selectedNode.sharedInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#050507] rounded-xl border border-purple-500/20 text-slate-200 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-950/30 border border-purple-500/30 p-3.5 rounded-xl space-y-1">
              <span className="font-bold font-mono text-purple-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Data Sovereignty & Security
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Raw citizen photos, street addresses, and device identifiers remain strictly locked inside {selectedNode.city}'s municipal vault.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
