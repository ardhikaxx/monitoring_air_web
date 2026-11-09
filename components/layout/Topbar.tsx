'use client';

import React, { useState, useEffect } from 'react';
import { useSystem } from '@/context/SystemContext';
import {
  Clock,
  Radio,
  Play,
  Droplets,
} from 'lucide-react';

export default function Topbar() {
  const { deviceStatus, isMonitoringActive, toggleMonitoring } = useSystem();
  const [currentDateTime, setCurrentDateTime] = useState('');

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
      });
      setCurrentDateTime(`${formatted}, ${timeStr} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#123B5D] flex items-center justify-center text-white shrink-0">
            <Droplets className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
              AquaMonitor
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600">
              IoT
            </span>
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Stream Toggle */}
          <button
            onClick={toggleMonitoring}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isMonitoringActive
                ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
            title={isMonitoringActive ? 'Klik untuk jeda pembaruan data' : 'Klik untuk mulai streaming data'}
          >
            {isMonitoringActive ? (
              <>
                <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Live</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>Mulai</span>
              </>
            )}
          </button>

          {/* Status ESP32 */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700">
            <span
              className={`w-2 h-2 rounded-full ${
                deviceStatus.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span>ESP32 {deviceStatus.status === 'online' ? 'Online' : 'Offline'}</span>
          </div>

          {/* Clock */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono pl-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDateTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
