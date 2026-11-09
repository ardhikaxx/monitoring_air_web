'use client';

import React, { useState } from 'react';
import { useSystem } from '@/context/SystemContext';
import { SensorReading } from '@/types/sensor';
import SensorCard from '@/components/monitoring/SensorCard';
import SensorDetailModal from '@/components/monitoring/SensorDetailModal';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity,
} from 'lucide-react';

export default function MonitoringSensorSection() {
  const { sensors } = useSystem();
  const [selectedSensor, setSelectedSensor] = useState<SensorReading | null>(null);

  const inletSensors = sensors.filter((s) => s.location === 'inlet');
  const outletSensors = sensors.filter((s) => s.location === 'outlet');

  return (
    <section id="monitoring" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Sensor Monitoring
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemantauan 4 sensor inlet dan 3 sensor outlet secara real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg font-medium bg-blue-50 text-blue-700 border border-blue-200">
            4 Inlet
          </span>
          <span className="px-2.5 py-1 rounded-lg font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            3 Outlet
          </span>
        </div>
      </div>

      {/* SECTION 1: INLET MONITORING (AIR BAKU) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-100/70 border border-slate-200/80 rounded-xl">
          <div className="flex items-center gap-2">
            <ArrowDownToLine className="w-4 h-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Inlet — Air Baku (Sebelum Filtrasi)
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-slate-600">
            4 Sensor Aktif
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {inletSensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              onRunTest={() => setSelectedSensor(sensor)}
            />
          ))}
        </div>
      </div>

      {/* SECTION 2: OUTLET MONITORING (AIR HASIL) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between p-3 bg-slate-100/70 border border-slate-200/80 rounded-xl">
          <div className="flex items-center gap-2">
            <ArrowUpFromLine className="w-4 h-4 text-emerald-600" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Outlet — Air Hasil (Setelah Filtrasi)
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-emerald-700">
            3 Sensor Aktif
          </span>
        </div>

        {/* 3 Cards Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {outletSensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              onRunTest={() => setSelectedSensor(sensor)}
            />
          ))}
        </div>
      </div>

      {/* Sensor Detail Inspection Modal */}
      <SensorDetailModal
        sensor={selectedSensor}
        onClose={() => setSelectedSensor(null)}
      />
    </section>
  );
}
