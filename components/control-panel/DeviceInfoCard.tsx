'use client';

import React from 'react';
import { useSystem } from '@/context/SystemContext';
import {
  Cpu,
  Wifi,
  WifiOff,
  Thermometer,
  HardDrive,
} from 'lucide-react';

export default function DeviceInfoCard() {
  const { deviceStatus } = useSystem();

  const isOnline = deviceStatus.status === 'online';

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header with Virtual LED */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {deviceStatus.name}
              </h2>
              <span className="font-mono text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-semibold">
                {deviceStatus.deviceId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Mikrokontroler ESP32-WROOM-32D dengan antarmuka ADC 12-bit &amp; GPIO Telemetri
            </p>
          </div>
        </div>

        {/* Virtual RGB LED Indicator */}
        <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <div className="relative flex items-center justify-center">
            {isOnline ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50 relative" />
              </>
            ) : (
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/50" />
            )}
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Virtual LED
            </div>
            <div
              className={`text-xs font-bold ${
                isOnline ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isOnline ? 'ONLINE (Hijau)' : 'OFFLINE (Merah)'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Telemetry Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* IP Address */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Alamat IP</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 truncate">
            {isOnline ? deviceStatus.ipAddress : 'Disconnected'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Port 1883 (MQTT)</div>
        </div>

        {/* MAC Address */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">MAC Address</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 truncate">
            {deviceStatus.macAddress}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Hardware MAC</div>
        </div>

        {/* WiFi Signal */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Kekuatan WiFi</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-blue-600" /> : <WifiOff className="w-3.5 h-3.5 text-rose-500" />}
            <span>{isOnline ? `${deviceStatus.wifiSignal} dBm` : 'No Signal'}</span>
          </div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
            {isOnline ? `Kualitas ${deviceStatus.wifiQuality}%` : 'Offline'}
          </div>
        </div>

        {/* Uptime */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Uptime Sistem</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 truncate">
            {isOnline ? deviceStatus.uptime : '0m'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sejak Boot Awal</div>
        </div>

        {/* Free Heap Memory */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Free Heap RAM</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-purple-600" />
            <span>{isOnline ? deviceStatus.freeHeap.split('/')[0] : '0 KB'}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">SRAM Internal</div>
        </div>

        {/* CPU Temp */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Suhu Core ESP32</div>
          <div className="font-mono font-bold text-slate-800 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span>{isOnline ? `${deviceStatus.cpuTemp} °C` : '--'}</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Thermal Aman</div>
        </div>
      </div>
    </div>
  );
}
