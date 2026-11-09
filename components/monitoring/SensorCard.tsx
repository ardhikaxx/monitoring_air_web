'use client';

import React from 'react';
import { SensorReading } from '@/types/sensor';
import SensorGauge from './SensorGauge';
import {
  Droplet,
  Compass,
  Gauge,
  Thermometer,
} from 'lucide-react';

interface SensorCardProps {
  sensor: SensorReading;
}

export default function SensorCard({ sensor }: SensorCardProps) {
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

  const getParameterIcon = () => {
    if (sensor.id.includes('turbidity'))
      return <Droplet className={`w-4 h-4 ${isInlet ? 'text-amber-600' : 'text-emerald-600'}`} />;
    if (sensor.id.includes('ph'))
      return <Compass className="w-4 h-4 text-purple-600" />;
    if (sensor.id.includes('flow'))
      return <Gauge className="w-4 h-4 text-blue-600" />;
    return <Thermometer className="w-4 h-4 text-rose-600" />;
  };

  // Configure gauge scale and target safe range per sensor type
  let gaugeMin = 0;
  let gaugeMax = 100;
  let targetRange: { min: number; max: number } | undefined;

  if (sensor.id === 'turbidity_inlet') {
    gaugeMin = 0;
    gaugeMax = 150;
    targetRange = { min: 0, max: 100 };
  } else if (sensor.id === 'turbidity_outlet') {
    gaugeMin = 0;
    gaugeMax = 10;
    targetRange = { min: 0, max: 5.0 };
  } else if (sensor.id === 'ph_inlet' || sensor.id === 'ph_outlet') {
    gaugeMin = 0;
    gaugeMax = 14;
    targetRange = { min: 6.5, max: 8.5 };
  } else if (sensor.id === 'flow_inlet') {
    gaugeMin = 0;
    gaugeMax = 35;
    targetRange = { min: 15, max: 25 };
  } else {
    // Temperature (temp_inlet, temp_outlet)
    gaugeMin = 10;
    gaugeMax = 45;
    targetRange = { min: 25, max: 28 };
  }

  // Gauge arc color based on status and location
  const gaugeColor =
    sensor.status === 'critical'
      ? '#ef4444'
      : sensor.status === 'warning'
      ? '#f59e0b'
      : isInlet
      ? '#1677C8'
      : '#10b981';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between space-y-3.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 shrink-0">
            {getParameterIcon()}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              {sensor.name}
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              {sensor.pin.split(' ')[0]}
            </span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Center: Radial Gauge Meter */}
      <div className="py-2 flex flex-col items-center justify-center">
        <SensorGauge
          value={sensor.value}
          min={gaugeMin}
          max={gaugeMax}
          unit={sensor.unit}
          targetRange={targetRange}
          color={gaugeColor}
        />

        {sensor.secondaryValue !== undefined && (
          <div className="mt-2 text-[11px] font-mono font-medium text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200">
            Tekanan: {sensor.secondaryValue} {sensor.secondaryUnit}
          </div>
        )}
      </div>

      {/* Bottom: Min, Avg, Max Callouts & Timestamp */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-1 py-1.5 px-2 text-center text-xs bg-slate-50 rounded-xl border border-slate-100">
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

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
          <span>{sensor.id}</span>
          <span>{sensor.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
