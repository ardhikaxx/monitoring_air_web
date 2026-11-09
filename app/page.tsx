'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DeviceConnectionCard from '@/components/dashboard/DeviceConnectionCard';
import StatCard from '@/components/dashboard/StatCard';
import WaterTreatmentDiagram from '@/components/dashboard/WaterTreatmentDiagram';
import MonitoringSensorSection from '@/components/dashboard/MonitoringSensorSection';
import WaterQualityComparison from '@/components/dashboard/WaterQualityComparison';
import ControlPanelSection from '@/components/dashboard/ControlPanelSection';
import MonitoringChartSection from '@/components/dashboard/MonitoringChartSection';
import RecentActivitySection from '@/components/dashboard/RecentActivitySection';
import { useSystem } from '@/context/SystemContext';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Gauge,
  Waves,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export default function SinglePageDashboard() {
  const {
    sensors,
    normalCount,
    warningCount,
    criticalCount,
    offlineCount,
    totalSensors,
    refreshAllData,
  } = useSystem();

  const flowSensor = sensors.find((s) => s.id === 'flow_inlet');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AppLayout>
      {/* SECTION 1: OVERVIEW & DEVICE CONNECTION */}
      <section id="overview" className="space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#123B5D] via-[#163B5C] to-[#1677C8] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/15 relative overflow-hidden">
          {/* Subtle water wave background */}
          <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/8 opacity-10 pointer-events-none">
            <Waves className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-200 font-semibold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                AquaMonitor IoT Platform • Single Page Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                IoT Water Treatment Monitoring System
              </h1>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Monitoring kondisi air sebelum dan sesudah proses penjernihan secara real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={refreshAllData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all shadow-xs"
              >
                <RefreshCw className="w-4 h-4 text-cyan-300" />
                <span>Refresh Telemetri</span>
              </button>

              <button
                onClick={() => scrollToSection('control-panel')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-[#0e2b44] text-xs font-bold transition-all shadow-md shadow-cyan-500/25"
              >
                <Sliders className="w-4 h-4 text-[#0e2b44]" />
                <span>Control Panel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Device Connection Card */}
        <DeviceConnectionCard />

        {/* 5 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Total Sensor */}
          <StatCard
            title="Total Sensor"
            value={totalSensors}
            unit="Unit"
            subtitle="4 Inlet + 3 Outlet"
            icon={Activity}
            variant="blue"
            badgeText="7 Terpasang"
          />

          {/* Sensor Normal */}
          <StatCard
            title="Sensor Normal"
            value={normalCount}
            unit="Unit"
            subtitle="Kondisi Optimal"
            icon={CheckCircle2}
            variant="emerald"
            badgeText={`${Math.round((normalCount / totalSensors) * 100)}%`}
          />

          {/* Sensor Warning */}
          <StatCard
            title="Sensor Warning"
            value={warningCount}
            unit="Unit"
            subtitle="Mendekati Ambang"
            icon={AlertTriangle}
            variant="amber"
            badgeText={warningCount > 0 ? 'Perlu Atensi' : 'Aman'}
          />

          {/* Sensor Error / Offline */}
          <StatCard
            title="Error / Offline"
            value={criticalCount + offlineCount}
            unit="Unit"
            subtitle="Kritis / Terputus"
            icon={AlertOctagon}
            variant={criticalCount + offlineCount > 0 ? 'rose' : 'slate'}
            badgeText={criticalCount + offlineCount > 0 ? 'Tindakan' : 'Nol'}
          />

          {/* Flow Rate Saat Ini */}
          <div className="col-span-2 sm:col-span-1">
            <StatCard
              title="Debit Aliran"
              value={flowSensor?.value ?? 20.3}
              unit="L/jam"
              subtitle={`Tekanan: ${flowSensor?.secondaryValue ?? 1.82} bar`}
              icon={Gauge}
              variant="blue"
              badgeText="Kapasitas ~20 L/j"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: WATER TREATMENT OVERVIEW (MINIATUR PROSES FILTRASI) */}
      <WaterTreatmentDiagram />

      {/* SECTION 3: MONITORING SENSOR (INLET & OUTLET PANELS) */}
      <MonitoringSensorSection />

      {/* SECTION 4: WATER QUALITY COMPARISON */}
      <WaterQualityComparison />

      {/* SECTION 5: CONTROL PANEL */}
      <ControlPanelSection />

      {/* SECTION 6: MONITORING CHART (RECHARTS) */}
      <MonitoringChartSection />

      {/* SECTION 7: RECENT ACTIVITY (LOG TELEMETRI) */}
      <RecentActivitySection />
    </AppLayout>
  );
}
