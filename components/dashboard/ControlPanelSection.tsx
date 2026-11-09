'use client';

import React, { useState } from 'react';
import { useSystem } from '@/context/SystemContext';
import { SensorReading } from '@/types/sensor';
import TestAllModal from '@/components/control-panel/TestAllModal';
import SensorTestModal from '@/components/control-panel/SensorTestModal';
import SimulationScenarioBar from '@/components/control-panel/SimulationScenarioBar';
import {
  Sliders,
  FlaskConical,
  RefreshCw,
  RotateCcw,
  Play,
  Pause,
  Search,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react';
import { showConfirm, showSensorCheckResult } from '@/lib/alerts';

export default function ControlPanelSection() {
  const {
    sensors,
    deviceStatus,
    normalCount,
    warningCount,
    criticalCount,
    offlineCount,
    totalSensors,
    isMonitoringActive,
    toggleMonitoring,
    refreshAllData,
    resetSimulation,
    runSensorCheck,
  } = useSystem();

  const [isTestAllOpen, setIsTestAllOpen] = useState(false);
  const [selectedSensorForTest, setSelectedSensorForTest] = useState<SensorReading | null>(null);
  const [checkingSensorId, setCheckingSensorId] = useState<string | null>(null);

  const inletSensors = sensors.filter((s) => s.location === 'inlet');
  const outletSensors = sensors.filter((s) => s.location === 'outlet');

  const handleCheckSingle = async (sensor: SensorReading) => {
    setCheckingSensorId(sensor.id);
    try {
      const result = await runSensorCheck(sensor.id);
      showSensorCheckResult(result);
    } finally {
      setCheckingSensorId(null);
    }
  };

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

  const getStatusBadge = (status: SensorReading['status']) => {
    switch (status) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1 w-fit">
            <AlertOctagon className="w-2.5 h-2.5" />
            Kritis
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-2.5 h-2.5" />
            Warning
          </span>
        );
      case 'offline':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 w-fit">
            Offline
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Normal
          </span>
        );
    }
  };

  return (
    <section id="control-panel" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Control Panel &amp; Pusat Pengujian Sensor
            </h2>
            <p className="text-xs text-slate-500">
              Pusat diagnostik instan, kendali polling real-time, dan simulasi skenario pengujian sensor
            </p>
          </div>
        </div>

        {/* Master Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Test All Sensors */}
          <button
            onClick={() => setIsTestAllOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Test All Sensors (7 Unit)</span>
          </button>

          {/* Refresh All Data */}
          <button
            onClick={refreshAllData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>Refresh All Data</span>
          </button>

          {/* Start / Pause Monitoring Toggle */}
          <button
            onClick={toggleMonitoring}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 shadow-xs ${
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
                <span>Start Monitoring</span>
              </>
            )}
          </button>

          {/* Reset Simulation */}
          <button
            onClick={handleResetWithConfirm}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 active:scale-95 text-slate-600 text-xs font-semibold transition-all"
            title="Kembalikan semua nilai simulasi ke kondisi awal"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Summary Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Status ESP32</div>
          <div
            className={`text-base font-bold font-mono mt-0.5 ${
              deviceStatus.status === 'online' ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {deviceStatus.status.toUpperCase()}
          </div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Sensor</div>
          <div className="text-base font-bold text-slate-900 font-mono mt-0.5">{totalSensors} Unit</div>
        </div>
        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center">
          <div className="text-[10px] text-emerald-700 font-semibold uppercase">Sensor Normal</div>
          <div className="text-base font-bold text-emerald-800 font-mono mt-0.5">{normalCount} Unit</div>
        </div>
        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-center">
          <div className="text-[10px] text-amber-700 font-semibold uppercase">Sensor Warning</div>
          <div className="text-base font-bold text-amber-800 font-mono mt-0.5">{warningCount} Unit</div>
        </div>
        <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-center col-span-2 sm:col-span-1">
          <div className="text-[10px] text-rose-700 font-semibold uppercase">Error / Offline</div>
          <div className="text-base font-bold text-rose-800 font-mono mt-0.5">
            {criticalCount + offlineCount} Unit
          </div>
        </div>
      </div>

      {/* Simulation Scenario Trigger Bar */}
      <SimulationScenarioBar />

      {/* 7 Sensors Control List (Inlet & Outlet) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Daftar 7 Sensor Utama &amp; Kontrol Pemeriksaan
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Mode Diagnostik Frontend
          </span>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="py-2.5 px-3">Nama Sensor</th>
                <th className="py-2.5 px-3">Lokasi</th>
                <th className="py-2.5 px-3">Model &amp; Pin</th>
                <th className="py-2.5 px-3 text-right">Nilai Terakhir</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Aksi Diagnostik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Inlet Group Header */}
              <tr className="bg-blue-50/50">
                <td colSpan={6} className="py-2 px-3 font-bold text-blue-900 text-xs">
                  <div className="flex items-center gap-1.5">
                    <ArrowDownToLine className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inlet Sensors (Sebelum Filtrasi)</span>
                  </div>
                </td>
              </tr>
              {inletSensors.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    {sensor.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                      Inlet
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                    {sensor.pin.split(' ')[0]}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {sensor.value} <span className="text-[10px] font-normal text-slate-500">{sensor.unit}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    {getStatusBadge(sensor.status)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleCheckSingle(sensor)}
                        disabled={checkingSensorId === sensor.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1"
                        title="Pindai koneksi & sinyal"
                      >
                        {checkingSensorId === sensor.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Search className="w-3 h-3 text-slate-500" />
                        )}
                        <span>Check</span>
                      </button>

                      <button
                        onClick={() => setSelectedSensorForTest(sensor)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 text-xs font-semibold transition-all flex items-center gap-1"
                        title="Uji 5 langkah diagnostik"
                      >
                        <FlaskConical className="w-3 h-3 text-blue-600" />
                        <span>Test</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Outlet Group Header */}
              <tr className="bg-emerald-50/50">
                <td colSpan={6} className="py-2 px-3 font-bold text-emerald-900 text-xs">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpFromLine className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Outlet Sensors (Setelah Filtrasi &amp; UV)</span>
                  </div>
                </td>
              </tr>
              {outletSensors.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    {sensor.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                      Outlet
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                    {sensor.pin.split(' ')[0]}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {sensor.value} <span className="text-[10px] font-normal text-slate-500">{sensor.unit}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    {getStatusBadge(sensor.status)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleCheckSingle(sensor)}
                        disabled={checkingSensorId === sensor.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1"
                        title="Pindai koneksi & sinyal"
                      >
                        {checkingSensorId === sensor.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Search className="w-3 h-3 text-slate-500" />
                        )}
                        <span>Check</span>
                      </button>

                      <button
                        onClick={() => setSelectedSensorForTest(sensor)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 text-xs font-semibold transition-all flex items-center gap-1"
                        title="Uji 5 langkah diagnostik"
                      >
                        <FlaskConical className="w-3 h-3 text-blue-600" />
                        <span>Test</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TestAllModal
        isOpen={isTestAllOpen}
        onClose={() => setIsTestAllOpen(false)}
      />

      <SensorTestModal
        sensor={selectedSensorForTest}
        onClose={() => setSelectedSensorForTest(null)}
      />
    </section>
  );
}
