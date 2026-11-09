'use client';

import React, { useState } from 'react';
import { SensorReading } from '@/types/sensor';
import SensorDetailModal from './SensorDetailModal';
import {
  ExternalLink,
  Droplet,
  Compass,
  Gauge,
  Thermometer,
} from 'lucide-react';

interface SensorCardProps {
  sensor: SensorReading;
  onRunTest?: (sensorId: SensorReading['id']) => void;
}

export default function SensorCard({ sensor, onRunTest }: SensorCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isInlet = sensor.location === 'inlet';

  const getStatusBadge = () => {
    switch (sensor.status) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Kritis
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Warning
          </span>
        );
      case 'offline':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Offline
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Normal
          </span>
        );
    }
  };

  // Sparkline SVG
  const sparkline = sensor.sparkline || [sensor.value];
  const minVal = Math.min(...sparkline);
  const maxVal = Math.max(...sparkline);
  const range = maxVal - minVal || 1;
  const width = 110;
  const height = 28;

  const points = sparkline
    .map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor = isInlet ? '#1677C8' : '#059669';

  // Clean, flat parameter bar
  const renderSimpleMeter = () => {
    if (sensor.id.includes('turbidity')) {
      const maxNTU = isInlet ? 150 : 10;
      const pct = Math.min(100, Math.max(0, (sensor.value / maxNTU) * 100));
      return (
        <div className="space-y-1">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                sensor.value <= 5 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Baku Mutu: ≤ 5 NTU</span>
            <span>{sensor.value <= 5 ? 'Aman' : 'Keruh'}</span>
          </div>
        </div>
      );
    }

    if (sensor.id.includes('ph')) {
      const pct = Math.min(100, Math.max(0, (sensor.value / 14) * 100));
      const isNeutral = sensor.value >= 6.5 && sensor.value <= 8.5;
      return (
        <div className="space-y-1">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isNeutral ? 'bg-blue-600' : 'bg-amber-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Standar: 6.5 – 8.5</span>
            <span className={isNeutral ? 'text-blue-600 font-medium' : 'text-amber-600 font-medium'}>
              {isNeutral ? 'Netral' : 'Non-Netral'}
            </span>
          </div>
        </div>
      );
    }

    if (sensor.id.includes('flow')) {
      const pct = Math.min(100, Math.max(0, (sensor.value / 30) * 100));
      return (
        <div className="space-y-1">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Tekanan: {sensor.secondaryValue ?? 1.82} bar</span>
            <span>Kapasitas 30 L/j</span>
          </div>
        </div>
      );
    }

    // Temperature
    const pct = Math.min(100, Math.max(0, ((sensor.value - 15) / 25) * 100));
    return (
      <div className="space-y-1">
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-slate-600 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>Target: 25°–28°C</span>
          <span>Normal</span>
        </div>
      </div>
    );
  };

  const getParameterIcon = () => {
    if (sensor.id.includes('turbidity'))
      return <Droplet className={`w-4 h-4 ${isInlet ? 'text-amber-600' : 'text-emerald-600'}`} />;
    if (sensor.id.includes('ph'))
      return <Compass className="w-4 h-4 text-purple-600" />;
    if (sensor.id.includes('flow'))
      return <Gauge className="w-4 h-4 text-blue-600" />;
    return <Thermometer className="w-4 h-4 text-rose-600" />;
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between space-y-3.5">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-100">
                {getParameterIcon()}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {sensor.name}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  {sensor.pin.split(' ')[0]}
                </span>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* Value & Sparkline */}
          <div className="flex items-baseline justify-between gap-2 pt-1 pb-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {sensor.value}
                </span>
                <span className="text-xs font-bold text-slate-500">{sensor.unit}</span>
              </div>
            </div>

            {/* Sparkline */}
            <div className="shrink-0 flex items-center">
              <svg width={width} height={height} className="overflow-visible">
                <polyline
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
            </div>
          </div>

          {/* Simple Meter */}
          <div className="pt-1">
            {renderSimpleMeter()}
          </div>

          {/* Min, Avg, Max Callout */}
          <div className="grid grid-cols-3 gap-1 py-1.5 px-2 text-center text-xs bg-slate-50 rounded-xl my-2.5 border border-slate-100">
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-medium">Min</div>
              <div className="font-mono font-bold text-slate-800 text-[11px]">{sensor.min24h}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-medium">Rata</div>
              <div className={`font-mono font-bold text-[11px] ${isInlet ? 'text-blue-600' : 'text-emerald-600'}`}>
                {sensor.avg24h}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-medium">Maks</div>
              <div className="font-mono font-bold text-slate-800 text-[11px]">{sensor.max24h}</div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">{sensor.lastUpdated}</span>
          <button
            onClick={() => setIsDetailOpen(true)}
            className="py-1 px-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-lg transition-all flex items-center gap-1"
          >
            <span>Detail</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
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
