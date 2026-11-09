'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import SystemOverviewDiagram from '@/components/dashboard/SystemOverviewDiagram';
import WaterQualityComparison from '@/components/dashboard/WaterQualityComparison';
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed';
import { useSystem } from '@/context/SystemContext';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Cpu,
  Gauge,
  RefreshCw,
  Sliders,
  Waves,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    sensors,
    deviceStatus,
    normalCount,
    warningCount,
    criticalCount,
    offlineCount,
    totalSensors,
    refreshAllData,
  } = useSystem();

  const flowSensor = sensors.find((s) => s.id === 'flow_inlet');

  return (
    <AppLayout>
      {/* Top Greeting & Operational Summary */}
      <div className="bg-gradient-to-r from-[#123B5D] via-[#163B5C] to-[#1677C8] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/15 relative overflow-hidden">
        {/* Subtle decorative background water wave */}
        <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/8 opacity-10 pointer-events-none">
          <Waves className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-200 font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Sistem Penjernihan Air Bersih IoT Aktif
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Monitoring Sistem Penjernihan Air
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Memantau parameter fisik dan kimia air sebelum proses filtrasi (Inlet) dan sesudah proses filtrasi multimedia &amp; disinfeksi UV (Outlet) secara real-time berbasis telemetri ESP32.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={refreshAllData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-cyan-300" />
              <span>Refresh Telemetri</span>
            </button>

            <Link
              href="/control-panel"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-[#0e2b44] text-xs font-bold transition-all shadow-md shadow-cyan-500/25"
            >
              <Sliders className="w-4 h-4 text-[#0e2b44]" />
              <span>Control Panel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 6 Main Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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

        {/* Status ESP32 */}
        <StatCard
          title="Status ESP32"
          value={deviceStatus.status === 'online' ? 'Online' : 'Offline'}
          subtitle={deviceStatus.status === 'online' ? `${deviceStatus.wifiSignal} dBm` : 'Terputus'}
          icon={Cpu}
          variant={deviceStatus.status === 'online' ? 'emerald' : 'rose'}
          badgeText={deviceStatus.status === 'online' ? 'Koneksi Stabil' : 'Error'}
        />

        {/* Debit Air Saat Ini */}
        <StatCard
          title="Debit Air Masuk"
          value={flowSensor?.value ?? 20.3}
          unit="L/jam"
          subtitle={`Tekanan: ${flowSensor?.secondaryValue ?? 1.82} bar`}
          icon={Gauge}
          variant="blue"
          badgeText="Kapasitas ~20 L/j"
        />
      </div>

      {/* System Overview Interactive Horizontal Workflow */}
      <SystemOverviewDiagram />

      {/* Water Quality Comparison & Recent Activity Feed in 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WaterQualityComparison />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>
      </div>
    </AppLayout>
  );
}
