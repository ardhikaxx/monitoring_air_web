'use client';

import React, { useState, useEffect } from 'react';
import { useSystem } from '@/context/SystemContext';
import {
  Clock,
  Radio,
  Pause,
  Play,
  Droplets,
  Cpu,
  Wifi,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function Topbar() {
  const {
    deviceStatus,
    isMonitoringActive,
    toggleMonitoring,
    warningCount,
    criticalCount,
    totalSensors,
  } = useSystem();

  const [currentDateTime, setCurrentDateTime] = useState('');

  // Live formatted Indonesian date and time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentDateTime(`${formatted}, ${timeStr} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
      {/* Primary Command Bar */}
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 text-left group focus:outline-none"
            title="Kembali ke atas"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#123B5D] via-[#163B5C] to-[#1677C8] flex items-center justify-center text-white shadow-md shadow-blue-900/20 relative group-hover:scale-105 transition-transform shrink-0">
              <Droplets className="w-5 h-5 text-cyan-300" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                  AquaMonitor
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-blue-600 text-white tracking-wider uppercase">
                  IoT SCADA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 hidden xs:block">
                Water Treatment Monitoring System
              </p>
            </div>
          </button>

          {/* Right: Telemetry Controls & System Indicators */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Auto-Refresh Stream Toggle */}
            <button
              onClick={toggleMonitoring}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isMonitoringActive
                  ? 'bg-blue-50/90 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title={
                isMonitoringActive
                  ? 'Live telemetry streaming aktif. Klik untuk jeda'
                  : 'Streaming dijeda. Klik untuk aktifkan kembali'
              }
            >
              {isMonitoringActive ? (
                <>
                  <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  <span className="hidden sm:inline">Live Stream</span>
                  <Pause className="w-3 h-3 text-blue-400 ml-0.5" />
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Dijeda</span>
                  <Play className="w-3 h-3 text-amber-600 ml-0.5 fill-amber-600" />
                </>
              )}
            </button>

            {/* ESP32 Hardware Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                deviceStatus.status === 'online'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {deviceStatus.status === 'online' ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>ESP32 Online</span>
                </>
              ) : (
                <>
                  <span className="inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  <span>ESP32 Offline</span>
                </>
              )}
            </div>

            {/* Current Time in Indonesian Format (WIB) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-600 bg-slate-50 border border-slate-200/80 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentDateTime || 'Memuat waktu...'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Header Industrial Telemetry Ribbon */}
      <div className="border-t border-slate-200/60 bg-slate-50/70 backdrop-blur-xs">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          {/* Micro Telemetry Hardware Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-800">ESP32 NodeMCU-32S</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-[11px] text-slate-600">IP: 192.168.1.105</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-600" /> -62 dBm
              </span>
            </div>

            {/* Live Sensor Status Pill */}
            <div className="hidden md:flex items-center gap-1 text-[11px]">
              <span className="text-slate-300">•</span>
              {criticalCount > 0 ? (
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {criticalCount} Kritis
                </span>
              ) : warningCount > 0 ? (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {warningCount} Warning
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {totalSensors} Sensor Optimal
                </span>
              )}
            </div>
          </div>

          {/* Standards & Sampling Interval */}
          <div className="flex items-center gap-3 text-[11px]">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                Baku Mutu: <strong className="text-slate-800">Permenkes RI No. 2/2023</strong>
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="text-slate-600 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Interval Telemetri: <strong className="text-blue-700">3 Detik</strong></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
