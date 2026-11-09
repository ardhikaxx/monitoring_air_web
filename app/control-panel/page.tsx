'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DeviceInfoCard from '@/components/control-panel/DeviceInfoCard';
import SimulationScenarioBar from '@/components/control-panel/SimulationScenarioBar';
import SensorControlCard from '@/components/control-panel/SensorControlCard';
import SensorTestModal from '@/components/control-panel/SensorTestModal';
import TestAllModal from '@/components/control-panel/TestAllModal';
import { useSystem } from '@/context/SystemContext';
import { SensorReading } from '@/types/sensor';
import {
  Sliders,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  FlaskConical,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react';
import { showConfirm } from '@/lib/alerts';

export default function ControlPanelPage() {
  const {
    sensors,
    isMonitoringActive,
    toggleMonitoring,
    refreshAllData,
    resetSimulation,
  } = useSystem();

  const [selectedSensorForTest, setSelectedSensorForTest] = useState<SensorReading | null>(null);
  const [isTestAllOpen, setIsTestAllOpen] = useState(false);

  const inletSensors = sensors.filter((s) => s.location === 'inlet');
  const outletSensors = sensors.filter((s) => s.location === 'outlet');

  const handleResetWithConfirm = async () => {
    const confirmed = await showConfirm(
      'Reset Simulasi ke Nilai Awal?',
      'Tindakan ini akan mengembalikan seluruh nilai telemetri sensor, log, dan status ESP32 ke nilai default pabrik.',
      'Ya, Reset Sekarang',
      'Batalkan'
    );
    if (confirmed) {
      resetSimulation();
    }
  };

  const handleRefreshWithConfirm = () => {
    refreshAllData();
  };

  return (
    <AppLayout>
      {/* Top Header & Master Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Pusat Kendali Operasional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            IoT Sensor Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Pusat manajemen dan uji fungsionalitas seluruh 7 sensor stasiun air bersih. Kelola pembaruan otomatis, simulasi skenario anomali, dan jalankan uji diagnostik perangkat.
          </p>
        </div>

        {/* Master Operations Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Test All Sensors */}
          <button
            onClick={() => setIsTestAllOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Test All Sensors (7 Unit)</span>
          </button>

          {/* Refresh All Data */}
          <button
            onClick={handleRefreshWithConfirm}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>Refresh All Data</span>
          </button>

          {/* Enable / Pause Monitoring Toggle */}
          <button
            onClick={toggleMonitoring}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 shadow-xs ${
              isMonitoringActive
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            {isMonitoringActive ? (
              <>
                <Pause className="w-4 h-4 text-amber-600" />
                <span>Pause Monitoring</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Enable Monitoring</span>
              </>
            )}
          </button>

          {/* Reset Simulation */}
          <button
            onClick={handleResetWithConfirm}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 active:scale-95 text-slate-600 text-xs font-semibold transition-all"
            title="Kembalikan semua nilai simulasi ke kondisi awal"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Simulasi</span>
          </button>
        </div>
      </div>

      {/* ESP32 Hardware Device Information Card */}
      <DeviceInfoCard />

      {/* Simulation Scenarios Bar */}
      <SimulationScenarioBar />

      {/* SENSOR CONTROL CENTER */}
      <div className="space-y-6">
        {/* Section 1: Inlet Sensor Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <ArrowDownToLine className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Inlet Sensor Controls (4 Modul Sebelum Filtrasi)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Pipa Intake Air Baku</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {inletSensors.map((sensor) => (
              <SensorControlCard
                key={sensor.id}
                sensor={sensor}
                onOpenTestModal={(s) => setSelectedSensorForTest(s)}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Outlet Sensor Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <ArrowUpFromLine className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Outlet Sensor Controls (3 Modul Setelah Filtrasi &amp; UV)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Pipa Keluaran Air Bersih</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {outletSensors.map((sensor) => (
              <SensorControlCard
                key={sensor.id}
                sensor={sensor}
                onOpenTestModal={(s) => setSelectedSensorForTest(s)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Single Sensor Test Modal */}
      <SensorTestModal
        sensor={selectedSensorForTest}
        onClose={() => setSelectedSensorForTest(null)}
      />

      {/* Test All Sensors Progress Modal */}
      <TestAllModal
        isOpen={isTestAllOpen}
        onClose={() => setIsTestAllOpen(false)}
      />
    </AppLayout>
  );
}
