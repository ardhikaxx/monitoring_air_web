'use client';

import React, { useState, useEffect } from 'react';
import { useSystem } from '@/context/SystemContext';
import NotificationDropdown from './NotificationDropdown';
import {
  Menu,
  Clock,
  Radio,
  User,
  ShieldCheck,
  Pause,
  Play,
} from 'lucide-react';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const { deviceStatus, isMonitoringActive, toggleMonitoring } = useSystem();
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

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                Dashboard
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Single Page IoT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              AquaMonitor Water Treatment Monitoring System
            </p>
          </div>
        </div>

        {/* Right: Telemetry status, clock, notification, user */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Monitoring Mode Button */}
          <button
            onClick={toggleMonitoring}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isMonitoringActive
                ? 'bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
            title={isMonitoringActive ? 'Klik untuk jeda pembaruan otomatis' : 'Klik untuk aktifkan auto refresh'}
          >
            {isMonitoringActive ? (
              <>
                <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Auto-Refresh Aktif</span>
                <Pause className="w-3 h-3 text-blue-400 ml-1" />
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Monitoring Dijeda</span>
                <Play className="w-3 h-3 text-amber-600 ml-1 fill-amber-600" />
              </>
            )}
          </button>

          {/* Device Online Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border ${
              deviceStatus.status === 'online'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
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

          {/* Current Date & Time (WIB) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-600 bg-slate-50 border border-slate-200/80 font-mono">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentDateTime || 'Memuat waktu...'}</span>
          </div>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#123B5D] to-[#1677C8] flex items-center justify-center text-white shadow-sm font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">Administrator</div>
              <div className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
