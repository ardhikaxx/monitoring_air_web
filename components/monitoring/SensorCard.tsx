'use client';

import React, { useState } from 'react';
import { SensorReading } from '@/types/sensor';
import { useSystem } from '@/context/SystemContext';
import SensorDetailModal from './SensorDetailModal';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { showSensorCheckResult } from '@/lib/alerts';

interface SensorCardProps {
  sensor: SensorReading;
  onRunTest?: (sensorId: SensorReading['id']) => void;
}

export default function SensorCard({ sensor, onRunTest }: SensorCardProps) {
  const { runSensorCheck } = useSystem();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleQuickCheck = async () => {
    const res = await runSensorCheck(sensor.id);
    showSensorCheckResult(res);
  };

  const getStatusBadge = () => {
    switch (sensor.status) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" />
            Kritis
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Peringatan
          </span>
        );
      case 'offline':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-200 text-slate-800 flex items-center gap-1">
            Offline
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Normal
          </span>
        );
    }
  };

  // Sparkline SVG calculation
  const sparkline = sensor.sparkline || [sensor.value];
  const minVal = Math.min(...sparkline);
  const maxVal = Math.max(...sparkline);
  const range = maxVal - minVal || 1;
  const width = 140;
  const height = 36;
  const points = sparkline
    .map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor =
    sensor.status === 'critical'
      ? '#EF4444'
      : sensor.status === 'warning'
      ? '#F59E0B'
      : '#1677C8';

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {sensor.location === 'inlet' ? 'Inlet' : 'Outlet'}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{sensor.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{sensor.category}</p>
            </div>
            {getStatusBadge()}
          </div>

          {/* Main Value & Sparkline */}
          <div className="flex items-end justify-between gap-4 py-2 my-1 border-y border-slate-100">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {sensor.value}
                </span>
                <span className="text-sm font-semibold text-slate-500">{sensor.unit}</span>
              </div>
              {sensor.secondaryValue !== undefined && (
                <div className="text-xs font-semibold text-blue-600 mt-0.5">
                  {sensor.secondaryValue} {sensor.secondaryUnit} (Tekanan Pipa)
                </div>
              )}
            </div>

            {/* Sparkline */}
            <div className="shrink-0 flex flex-col items-end">
              <svg width={width} height={height} className="overflow-visible">
                <polyline
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
              <span className="text-[9px] text-slate-400 mt-0.5 font-mono">Tren 10 sampling</span>
            </div>
          </div>

          {/* 24h Metrics */}
          <div className="grid grid-cols-3 gap-1.5 py-2 text-center text-xs text-slate-600 bg-slate-50 rounded-xl my-2">
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-semibold">Min (24j)</div>
              <div className="font-mono font-bold text-slate-800">{sensor.min24h}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-semibold">Rata-rata</div>
              <div className="font-mono font-bold text-blue-600">{sensor.avg24h}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-semibold">Maks (24j)</div>
              <div className="font-mono font-bold text-slate-800">{sensor.max24h}</div>
            </div>
          </div>

          {/* Microcontroller Pin Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <Cpu className="w-3 h-3 text-slate-400" />
              {sensor.pin}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {sensor.lastUpdated}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={handleQuickCheck}
            className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
          >
            Pindai Sinyal
          </button>
          <button
            onClick={() => setIsDetailOpen(true)}
            className="flex-1 py-2 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-all text-center flex items-center justify-center gap-1"
          >
            <span>Detail</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal Detail */}
      <SensorDetailModal
        sensor={isDetailOpen ? sensor : null}
        onClose={() => setIsDetailOpen(false)}
        onRunTest={onRunTest}
      />
    </>
  );
}
