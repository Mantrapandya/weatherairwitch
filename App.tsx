import React, { useState } from 'react';
import { HotspotLocation, AuthorityAlert } from './types';
import { INITIAL_HOTSPOTS, INITIAL_AUTHORITY_ALERTS } from './data/mockData';
import { Navbar, TabType } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ReportPollutionView } from './components/ReportPollutionView';
import { HotspotsView } from './components/HotspotsView';
import { ForecastView } from './components/ForecastView';
import { AuthorityView } from './components/AuthorityView';
import { CityIntelligenceView } from './components/CityIntelligenceView';
import { FutureIntegrationsView } from './components/FutureIntegrationsView';
import { SimulatedBadge } from './components/SimulatedBadge';
import {
  Flame,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  MapPin,
  FileText,
  Activity,
  Heart,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('DASHBOARD');
  const [hotspots, setHotspots] = useState<HotspotLocation[]>(INITIAL_HOTSPOTS);
  const [alerts, setAlerts] = useState<AuthorityAlert[]>(INITIAL_AUTHORITY_ALERTS);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotLocation | null>(INITIAL_HOTSPOTS[0]);
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  // Add new hotspot from citizen report
  const handleAddHotspot = (newHotspot: HotspotLocation) => {
    setHotspots((prev) => [newHotspot, ...prev]);
    setSelectedHotspot(newHotspot);
  };

  // Add new alert from citizen report
  const handleAddAlert = (newAlert: AuthorityAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Trigger alert dispatch from Authority view or Map
  const handleTriggerAlert = (alertId: string, actionNote: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'DISPATCHED',
              dispatchedTo: `${a.city} Municipal Flying Squad & Air Response Unit`,
              dispatchTimestamp: 'Just now',
              recommendedAction: `${a.recommendedAction} (Directive: ${actionNote})`,
            }
          : a
      )
    );
  };

  // Quick dispatch directly from map or hotspot card
  const handleQuickDispatchFromHotspot = (hotspot: HotspotLocation) => {
    const existingAlert = alerts.find((a) => a.location === hotspot.locationName);
    if (existingAlert) {
      handleTriggerAlert(existingAlert.id, 'Accelerated response triggered from Map command');
    } else {
      const newAlert: AuthorityAlert = {
        id: `ALT-MAP-${Date.now().toString().slice(-4)}`,
        location: hotspot.locationName,
        city: hotspot.city,
        riskLevel: hotspot.riskLevel,
        riskScore: hotspot.riskScore,
        evidence: [
          `Hotspot telemetry: PM2.5 at ${hotspot.signals.pm25} µg/m³, PM10 at ${hotspot.signals.pm10} µg/m³`,
          `Contributing factors: ${hotspot.probableContributingFactors.join('; ')}`,
        ],
        aiAssessment: `Rapid command escalation for ${hotspot.locationName}, ${hotspot.city}.`,
        recommendedAction: hotspot.recommendedAction,
        confidence: hotspot.confidence,
        timestamp: 'Just now',
        status: 'DISPATCHED',
        priority: hotspot.riskLevel === 'HIGH' ? 'CRITICAL' : 'ELEVATED',
        dispatchedTo: `${hotspot.city} Pollution Control Task Force`,
        dispatchTimestamp: 'Just now',
      };
      handleAddAlert(newAlert);
    }
    setCurrentTab('AUTHORITY');
  };

  const highRiskCount = hotspots.filter((h) => h.riskLevel === 'HIGH').length;
  const activeAlertCount = alerts.filter(
    (a) => a.status === 'PENDING_REVIEW' || a.status === 'DISPATCHED'
  ).length;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Main Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeAlertCount={activeAlertCount}
        highRiskCount={highRiskCount}
      />

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'DASHBOARD' && (
          <DashboardView
            hotspots={hotspots}
            alerts={alerts}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={(h) => {
              setSelectedHotspot(h);
              setCurrentTab('HOTSPOTS');
            }}
            onNavigate={setCurrentTab}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onDispatchAlert={handleQuickDispatchFromHotspot}
          />
        )}

        {currentTab === 'REPORT' && (
          <ReportPollutionView
            onAddHotspot={handleAddHotspot}
            onAddAlert={handleAddAlert}
            onNavigateToAuthority={() => setCurrentTab('AUTHORITY')}
          />
        )}

        {currentTab === 'HOTSPOTS' && (
          <HotspotsView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onDispatchAlert={handleQuickDispatchFromHotspot}
          />
        )}

        {currentTab === 'FORECAST' && <ForecastView />}

        {currentTab === 'AUTHORITY' && (
          <AuthorityView
            alerts={alerts}
            hotspots={hotspots}
            onTriggerAlert={handleTriggerAlert}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
          />
        )}

        {currentTab === 'INTELLIGENCE' && <CityIntelligenceView />}

        {currentTab === 'INTEGRATIONS' && <FutureIntegrationsView />}
      </main>

      {/* Modern Climate-Tech Footer */}
      <footer className="bg-[#08090d] border-t border-white/[0.08] mt-12 py-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200">AirWatch AI</span> — Hyperlocal Pollution Intelligence & Climate Action
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="text-slate-400">
              Indian Metros: Ahmedabad • Delhi NCR • Mumbai • Bengaluru
            </span>
            <span className="text-slate-600">•</span>
            <SimulatedBadge text="SIMULATED MVP FOR DEMO" size="sm" />
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Powered by Gemini 3.7 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
