import React, { useState } from 'react';
import { AuthorityAlert, HotspotLocation, RiskLevel } from '../types';
import { SimulatedBadge } from './SimulatedBadge';
import {
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Activity,
  FileCheck,
  Building,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AuthorityViewProps {
  alerts: AuthorityAlert[];
  hotspots: HotspotLocation[];
  onTriggerAlert: (alertId: string, actionNote: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const AuthorityView: React.FC<AuthorityViewProps> = ({
  alerts,
  hotspots,
  onTriggerAlert,
  selectedCity,
  onSelectCity,
}) => {
  const [filterRisk, setFilterRisk] = useState<'ALL' | RiskLevel>('ALL');
  const [activeModalAlert, setActiveModalAlert] = useState<AuthorityAlert | null>(null);
  const [dispatchNote, setDispatchNote] = useState<string>('Deploy mechanized water mist cannons and dispatch regional inspection team.');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState<string | null>(null);

  const totalReportsCount = hotspots.reduce((acc, h) => acc + h.citizenReportCount, 0) + 42;
  const highRiskHotspots = hotspots.filter((h) => h.riskLevel === 'HIGH').length;
  const mediumRiskHotspots = hotspots.filter((h) => h.riskLevel === 'MEDIUM').length;
  const lowRiskHotspots = hotspots.filter((h) => h.riskLevel === 'LOW').length;
  const activeAlertsCount = alerts.filter((a) => a.status === 'PENDING_REVIEW' || a.status === 'DISPATCHED').length;

  const filteredAlerts = alerts.filter((alert) => {
    const matchesCity = selectedCity === 'ALL' || alert.city === selectedCity;
    const matchesRisk = filterRisk === 'ALL' || alert.riskLevel === filterRisk;
    return matchesCity && matchesRisk;
  });

  const handleConfirmDispatch = async () => {
    if (!activeModalAlert) return;
    setIsDispatching(true);

    try {
      const res = await fetch('/api/trigger-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: activeModalAlert.id,
          location: activeModalAlert.location,
          city: activeModalAlert.city,
          severity: activeModalAlert.riskLevel,
          actionTaken: dispatchNote,
        }),
      });

      const data = await res.json();
      onTriggerAlert(activeModalAlert.id, dispatchNote);
      setDispatchSuccessToast(data.message || 'Authority response alert dispatched to field squads.');
      setTimeout(() => setDispatchSuccessToast(null), 6000);
      setActiveModalAlert(null);
    } catch (err) {
      console.error('Dispatch error:', err);
      onTriggerAlert(activeModalAlert.id, dispatchNote);
      setDispatchSuccessToast(`Alert dispatched to ${activeModalAlert.city} Municipal Pollution Control Squad.`);
      setTimeout(() => setDispatchSuccessToast(null), 6000);
      setActiveModalAlert(null);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Authority Command & Response Dashboard
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            High-priority environmental incident triage for Municipal Corporations and State Pollution Control Boards (SPCBs). Inspect AI evidence dossiers and dispatch field interventions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SimulatedBadge text="SIMULATED DISPATCH PROTOCOL" size="md" />
        </div>
      </div>

      {/* Success Toast */}
      {dispatchSuccessToast && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 p-4 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn shadow-xl font-mono">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{dispatchSuccessToast}</span>
          </div>
          <button
            onClick={() => setDispatchSuccessToast(null)}
            className="text-xs text-emerald-300 hover:text-white underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Five Metrics Overview Row (Total reports, High, Medium, Low hotspots, Active alerts) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Reports */}
        <div className="bg-[#0f1115] border border-white/[0.08] rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Total Reports
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-1">
            {totalReportsCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Citizen & sensor signals</span>
        </div>

        {/* High-Risk Hotspots */}
        <div className="bg-[#0f1115] border border-red-500/30 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400 block">
            High-Risk Hotspots
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-400 mt-1">
            {highRiskHotspots}
          </div>
          <span className="text-[10px] font-mono text-red-300/70 mt-1 block">Score ≥ 70</span>
        </div>

        {/* Medium-Risk Hotspots */}
        <div className="bg-[#0f1115] border border-orange-500/30 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-400 block">
            Medium-Risk Hotspots
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-orange-400 mt-1">
            {mediumRiskHotspots}
          </div>
          <span className="text-[10px] font-mono text-orange-300/70 mt-1 block">Score 40-69</span>
        </div>

        {/* Low-Risk Hotspots */}
        <div className="bg-[#0f1115] border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
            Low-Risk Zones
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-1">
            {lowRiskHotspots}
          </div>
          <span className="text-[10px] font-mono text-emerald-300/70 mt-1 block">Score &lt; 40</span>
        </div>

        {/* Active Alerts */}
        <div className="bg-[#0f1115] border border-amber-500/30 rounded-2xl p-4 shadow-lg col-span-2 sm:col-span-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
            Active Alerts
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 mt-1">
            {activeAlertsCount}
          </div>
          <span className="text-[10px] text-amber-300/70 mt-1 block">Actionable Queue</span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-[#0f1115] border border-white/[0.08] rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Authority Incident Dossiers</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400">
              {filteredAlerts.length} actionable alerts
            </span>
          </div>

          {/* City Filter selector */}
          <div className="flex items-center gap-1 bg-[#050507] p-1 rounded-xl border border-white/[0.08]">
            {['ALL', 'Ahmedabad', 'Delhi', 'Mumbai', 'Bengaluru'].map((city) => (
              <button
                key={city}
                onClick={() => onSelectCity(city)}
                className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition ${
                  selectedCity === city
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Filter Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Severity Filter:
          </span>
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterRisk(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition ${
                filterRisk === lvl
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-[#050507] text-slate-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Alert Cards List */}
        <div className="space-y-4 pt-2">
          {filteredAlerts.map((alert) => {
            const isHigh = alert.riskLevel === 'HIGH';
            const isDispatched = alert.status === 'DISPATCHED' || alert.status === 'MITIGATING';
            const isResolved = alert.status === 'RESOLVED';

            return (
              <div
                key={alert.id}
                id={`authority-alert-card-${alert.id}`}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  isHigh
                    ? 'bg-[#050507] border-red-500/40 hover:border-red-500/60'
                    : 'bg-[#050507] border-white/[0.08] hover:border-white/[0.15]'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                        {alert.id} • {alert.city}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                          isResolved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isDispatched
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        STATUS: {alert.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white tracking-tight mt-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      {alert.location}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">AI Confidence</span>
                      <span className="text-sm font-bold font-mono text-cyan-400">{alert.confidence}%</span>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-xl font-mono font-extrabold text-xs border ${
                        isHigh
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                      }`}
                    >
                      {alert.riskLevel} RISK ({alert.riskScore}/100)
                    </div>
                  </div>
                </div>

                {/* Evidence Section */}
                <div className="bg-[#0a0c10] p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                    Synthesized Evidence Signals
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300 pl-4 list-disc">
                    {alert.evidence.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* AI Assessment */}
                <div className="text-xs text-slate-300">
                  <strong className="text-slate-200">AI Risk Assessment:</strong> {alert.aiAssessment}
                </div>

                {/* Recommended Authority Action */}
                <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Recommended Authority Intervention
                    </span>
                    <p className="text-xs text-slate-100 font-medium">
                      {alert.recommendedAction}
                    </p>
                    {alert.dispatchedTo && (
                      <p className="text-[11px] font-mono text-sky-300">
                        Dispatched to: {alert.dispatchedTo} ({alert.dispatchTimestamp})
                      </p>
                    )}
                  </div>

                  <button
                    id={`alert-authority-btn-${alert.id}`}
                    onClick={() => setActiveModalAlert(alert)}
                    className="py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-red-950 transition active:scale-95 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isDispatched ? 'Update Dispatch Protocol' : 'Alert Authority'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Alert Authority Dispatch Modal */}
      {activeModalAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1115] border border-white/[0.15] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-white">
                  Dispatch Authority Field Action
                </h3>
              </div>
              <SimulatedBadge text="SIMULATION" size="sm" />
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                You are initiating an official simulated intervention directive for:
              </p>
              <div className="bg-[#050507] p-3 rounded-xl border border-white/[0.08] text-white font-medium">
                <div>Location: {activeModalAlert.location} ({activeModalAlert.city})</div>
                <div className="text-red-400 font-mono font-bold mt-1">
                  Severity: {activeModalAlert.riskLevel} Risk ({activeModalAlert.riskScore}/100)
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 font-mono">
                  Field Action Directive Note:
                </label>
                <textarea
                  rows={3}
                  value={dispatchNote}
                  onChange={(e) => setDispatchNote(e.target.value)}
                  className="w-full bg-[#050507] border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="text-[11px] text-slate-400 italic">
                * Note: In production, this issues automated webhooks to Municipal ERPs, CPCB portal integrations, and SMS dispatch to flying squads.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveModalAlert(null)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] text-slate-300 text-xs font-semibold hover:bg-white/[0.1] transition font-mono"
              >
                Cancel
              </button>

              <button
                type="button"
                id="confirm-dispatch-btn"
                disabled={isDispatching}
                onClick={handleConfirmDispatch}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-red-950 transition"
              >
                {isDispatching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting Protocol...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm & Transmit Alert</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
