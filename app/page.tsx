'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DeviceConnectionCard from '@/components/dashboard/DeviceConnectionCard';
import StatCard from '@/components/dashboard/StatCard';
import MonitoringSensorSection from '@/components/dashboard/MonitoringSensorSection';
import WaterQualityComparison from '@/components/dashboard/WaterQualityComparison';
import MonitoringChartSection from '@/components/dashboard/MonitoringChartSection';
import { useSystem } from '@/context/SystemContext';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Gauge,
  RefreshCw,
  LineChart,
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
      <section id="overview" className="space-y-5">
        {/* Simple & Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Monitoring Pengolahan Air
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pemantauan telemetri sensor sebelum (inlet) dan sesudah (outlet) proses filtrasi.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={refreshAllData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-700 text-xs font-medium transition-all shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={() => scrollToSection('charts')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-medium transition-all shadow-2xs"
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Lihat Grafik</span>
            </button>
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
            badgeText="7 Sensor"
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
            subtitle="Mendekati Batas"
            icon={AlertTriangle}
            variant="amber"
            badgeText={warningCount > 0 ? 'Perlu Cek' : 'Aman'}
          />

          {/* Sensor Error / Offline */}
          <StatCard
            title="Error / Offline"
            value={criticalCount + offlineCount}
            unit="Unit"
            subtitle="Kritis / Terputus"
            icon={AlertOctagon}
            variant={criticalCount + offlineCount > 0 ? 'rose' : 'slate'}
            badgeText={criticalCount + offlineCount > 0 ? 'Tindakan' : '0'}
          />

          {/* Flow Rate Saat Ini */}
          <div className="col-span-2 sm:col-span-1">
            <StatCard
              title="Debit Aliran"
              value={flowSensor?.value ?? 20.3}
              unit="L/jam"
              subtitle={`Tekanan ${flowSensor?.secondaryValue ?? 1.82} bar`}
              icon={Gauge}
              variant="blue"
              badgeText="~20 L/j"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: MONITORING SENSOR (INLET & OUTLET PANELS) */}
      <MonitoringSensorSection />

      {/* SECTION 3: WATER QUALITY COMPARISON */}
      <WaterQualityComparison />

      {/* SECTION 4: MONITORING CHART (RECHARTS) */}
      <MonitoringChartSection />
    </AppLayout>
  );
}
