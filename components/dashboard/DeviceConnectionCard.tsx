'use client';

import React from 'react';
import { useSystem } from '@/context/SystemContext';
import {
  Cpu,
  Wifi,
  WifiOff,
  Clock,
  HardDrive,
  Thermometer,
} from 'lucide-react';

export default function DeviceConnectionCard() {
  const { deviceStatus, lastUpdatedTime } = useSystem();

  const isOnline = deviceStatus.status === 'online';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                {deviceStatus.name}
              </h2>
              <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                {deviceStatus.deviceId}
              </span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Grid of Telemetry Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* IP Address */}
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
          <div className="text-[11px] text-slate-400 font-medium">Alamat IP</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 truncate">
            {isOnline ? deviceStatus.ipAddress : 'Terputus'}
          </div>
        </div>

        {/* WiFi Signal */}
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
          <div className="text-[11px] text-slate-400 font-medium">Sinyal Wi-Fi</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-blue-600" /> : <WifiOff className="w-3.5 h-3.5 text-rose-500" />}
            <span>{isOnline ? `${deviceStatus.wifiSignal} dBm` : '--'}</span>
          </div>
        </div>

        {/* Uptime */}
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
          <div className="text-[11px] text-slate-400 font-medium">Uptime Sistem</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 truncate">
            {isOnline ? deviceStatus.uptime : '0m'}
          </div>
        </div>

        {/* Last Sync */}
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
          <div className="text-[11px] text-slate-400 font-medium">Pembaruan</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{lastUpdatedTime}</span>
          </div>
        </div>

        {/* Free Heap RAM */}
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
          <div className="text-[11px] text-slate-400 font-medium">Memori Heap</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-purple-600" />
            <span>{isOnline ? deviceStatus.freeHeap.split('/')[0] : '0 KB'}</span>
          </div>
        </div>

        {/* Core Temp */}
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
          <div className="text-[11px] text-slate-400 font-medium">Suhu Chip</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span>{isOnline ? `${deviceStatus.cpuTemp} °C` : '--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
