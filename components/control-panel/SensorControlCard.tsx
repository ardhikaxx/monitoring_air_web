'use client';

import React, { useState } from 'react';
import { SensorReading } from '@/types/sensor';
import { useSystem } from '@/context/SystemContext';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  RefreshCw,
  Search,
  FlaskConical,
  Loader2,
} from 'lucide-react';
import { showSensorCheckResult, showToast } from '@/lib/alerts';

interface SensorControlCardProps {
  sensor: SensorReading;
  onOpenTestModal: (sensor: SensorReading) => void;
}

export default function SensorControlCard({
  sensor,
  onOpenTestModal,
}: SensorControlCardProps) {
  const { runSensorCheck } = useSystem();
  const [isChecking, setIsChecking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCheck = async () => {
    setIsChecking(true);
    try {
      const res = await runSensorCheck(sensor.id);
      showSensorCheckResult(res);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRefreshSingle = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsRefreshing(false);
    showToast(`Data ${sensor.name} diperbarui!`, 'success');
  };

  const getStatusBadge = () => {
    switch (sensor.status) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" />
            Kritis
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Warning
          </span>
        );
      case 'offline':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 text-slate-800">
            Offline
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Normal
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Top Info */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {sensor.location === 'inlet' ? 'Inlet' : 'Outlet'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              {sensor.name}
            </h3>
          </div>
          {getStatusBadge()}
        </div>

        {/* Live Value Display */}
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 my-2 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {sensor.value}
            </span>
            <span className="text-xs font-semibold text-slate-500 ml-1">{sensor.unit}</span>
          </div>
          {sensor.secondaryValue !== undefined && (
            <span className="text-xs font-semibold text-blue-600 font-mono">
              {sensor.secondaryValue} {sensor.secondaryUnit}
            </span>
          )}
        </div>

        {/* Pin & Hardware info */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono py-1">
          <span className="truncate pr-1">{sensor.hardwareModel}</span>
          <span className="text-blue-600 font-semibold shrink-0">{sensor.pin.split(' ')[0]}</span>
        </div>
      </div>

      {/* 3 Action Buttons */}
      <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-slate-100">
        {/* Check Sensor */}
        <button
          onClick={handleCheck}
          disabled={isChecking}
          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          title="Pindai koneksi & voltase ADC"
        >
          {isChecking ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span>Check</span>
        </button>

        {/* Test Sensor */}
        <button
          onClick={() => onOpenTestModal(sensor)}
          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 rounded-xl text-xs font-semibold transition-all"
          title="Jalankan rangkaian pengujian 5 langkah"
        >
          <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
          <span>Test</span>
        </button>

        {/* Refresh Data */}
        <button
          onClick={handleRefreshSingle}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-600 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          title="Perbarui telemetri sensor ini"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
