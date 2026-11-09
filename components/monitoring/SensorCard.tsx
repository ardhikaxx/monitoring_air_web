'use client';

import React, { useState } from 'react';
import { SensorReading } from '@/types/sensor';
import { useSystem } from '@/context/SystemContext';
import SensorDetailModal from './SensorDetailModal';
import {
  Clock,
  ExternalLink,
  Cpu,
  Search,
  Droplet,
  Compass,
  Gauge,
  Thermometer,
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

  const isInlet = sensor.location === 'inlet';

  const getStatusBadge = () => {
    switch (sensor.status) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800 flex items-center gap-1 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Kritis
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Warning
          </span>
        );
      case 'offline':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 text-slate-700 border border-slate-300">
            Offline
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Normal
          </span>
        );
    }
  };

  // Sparkline gradient SVG
  const sparkline = sensor.sparkline || [sensor.value];
  const minVal = Math.min(...sparkline);
  const maxVal = Math.max(...sparkline);
  const range = maxVal - minVal || 1;
  const width = 130;
  const height = 32;

  const points = sparkline
    .map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = isInlet ? '#1677C8' : '#059669';

  // Specific visual gauge/meter based on parameter type
  const renderParameterMeter = () => {
    if (sensor.id.includes('turbidity')) {
      const maxNTU = isInlet ? 150 : 10;
      const pct = Math.min(100, Math.max(0, (sensor.value / maxNTU) * 100));
      return (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Kejernihan</span>
            <span className={sensor.value <= 5 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
              {sensor.value <= 5 ? 'Jernih (Lolos Mutu)' : 'Keruh (Baku)'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                sensor.value <= 5 ? 'bg-emerald-500' : sensor.value <= 100 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>0 NTU</span>
            <span>{maxNTU} NTU</span>
          </div>
        </div>
      );
    }

    if (sensor.id.includes('ph')) {
      const pct = Math.min(100, Math.max(0, (sensor.value / 14) * 100));
      const isNeutral = sensor.value >= 6.5 && sensor.value <= 8.5;
      return (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Rentang Skala pH (0–14)</span>
            <span className={isNeutral ? 'text-blue-600 font-bold' : 'text-amber-600 font-bold'}>
              {isNeutral ? 'Netral Ideal' : sensor.value < 6.5 ? 'Asam' : 'Basa'}
            </span>
          </div>
          {/* Calibrated pH spectrum bar */}
          <div className="relative w-full h-2 rounded-full overflow-hidden bg-gradient-to-r from-rose-400 via-emerald-400 via-blue-400 to-purple-500">
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-slate-900 border border-white shadow-xs -translate-x-1/2 transition-all duration-500"
              style={{ left: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>0 (Asam)</span>
            <span className="text-emerald-600 font-bold">7.0 (Netral)</span>
            <span>14 (Basa)</span>
          </div>
        </div>
      );
    }

    if (sensor.id.includes('flow')) {
      const pct = Math.min(100, Math.max(0, (sensor.value / 30) * 100));
      return (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Debit Laju Alir</span>
            <span className="text-blue-600 font-bold">Nominal ~20 L/j</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>0 L/j</span>
            <span>Tekanan: {sensor.secondaryValue ?? 1.82} bar</span>
            <span>30 L/j</span>
          </div>
        </div>
      );
    }

    // Temperature
    const pct = Math.min(100, Math.max(0, ((sensor.value - 15) / 25) * 100));
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>Kestabilan Termal</span>
          <span className="text-slate-600 font-bold">Normal (Kamar)</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
          <span>15°C</span>
          <span>Target 25°–28°C</span>
          <span>40°C</span>
        </div>
      </div>
    );
  };

  const getParameterIcon = () => {
    if (sensor.id.includes('turbidity')) return <Droplet className={`w-4 h-4 ${isInlet ? 'text-amber-500' : 'text-emerald-500'}`} />;
    if (sensor.id.includes('ph')) return <Compass className="w-4 h-4 text-purple-500" />;
    if (sensor.id.includes('flow')) return <Gauge className="w-4 h-4 text-blue-500" />;
    return <Thermometer className="w-4 h-4 text-rose-500" />;
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-4">
        <div>
          {/* Card Top Pill & Status */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <div className={`p-1.5 rounded-lg ${isInlet ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {getParameterIcon()}
              </div>
              <div>
                <span
                  className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isInlet ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isInlet ? 'Stasiun Inlet' : 'Stasiun Outlet'}
                </span>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* Sensor Title */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{sensor.name}</h3>
            <p className="text-[11px] text-slate-400">{sensor.category}</p>
          </div>

          {/* Main Reading & Mini Sparkline */}
          <div className="flex items-end justify-between gap-2 py-2.5 my-1.5 border-y border-slate-100">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {sensor.value}
                </span>
                <span className="text-xs font-bold text-slate-500">{sensor.unit}</span>
              </div>
              {sensor.secondaryValue !== undefined && (
                <div className="text-[11px] font-semibold text-blue-600 font-mono mt-0.5">
                  {sensor.secondaryValue} {sensor.secondaryUnit} (Tekanan Pipa)
                </div>
              )}
            </div>

            {/* Sparkline curve */}
            <div className="shrink-0 flex flex-col items-end">
              <svg width={width} height={height} className="overflow-visible">
                <polyline
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5">Live Sparkline</span>
            </div>
          </div>

          {/* Parameter Gauge Scale */}
          <div className="py-1">
            {renderParameterMeter()}
          </div>

          {/* 24h Min, Avg, Max Callout */}
          <div className="grid grid-cols-3 gap-1.5 py-1.5 px-2 text-center text-xs bg-slate-50/80 rounded-xl my-2 border border-slate-100">
            <div>
              <div className="text-[8px] text-slate-400 uppercase font-semibold">Min 24j</div>
              <div className="font-mono font-bold text-slate-800 text-[11px]">{sensor.min24h}</div>
            </div>
            <div>
              <div className="text-[8px] text-slate-400 uppercase font-semibold">Rerata</div>
              <div className={`font-mono font-bold text-[11px] ${isInlet ? 'text-blue-600' : 'text-emerald-600'}`}>
                {sensor.avg24h}
              </div>
            </div>
            <div>
              <div className="text-[8px] text-slate-400 uppercase font-semibold">Maks 24j</div>
              <div className="font-mono font-bold text-slate-800 text-[11px]">{sensor.max24h}</div>
            </div>
          </div>

          {/* Pin & Update info */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span className="flex items-center gap-1 font-mono">
              <Cpu className="w-3 h-3 text-slate-400" />
              {sensor.pin.split(' ')[0]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {sensor.lastUpdated}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={handleQuickCheck}
            className="flex-1 py-1.5 px-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl transition-all text-center flex items-center justify-center gap-1"
          >
            <Search className="w-3 h-3 text-slate-500" />
            <span>Pindai</span>
          </button>
          <button
            onClick={() => setIsDetailOpen(true)}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1 active:scale-95 ${
              isInlet
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            <span>Detail</span>
            <ExternalLink className="w-3 h-3" />
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
