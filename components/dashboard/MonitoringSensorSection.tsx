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
  ShieldCheck,
} from 'lucide-react';

export default function MonitoringSensorSection() {
  const { sensors } = useSystem();
  const [selectedSensor, setSelectedSensor] = useState<SensorReading | null>(null);

  const inletSensors = sensors.filter((s) => s.location === 'inlet');
  const outletSensors = sensors.filter((s) => s.location === 'outlet');

  return (
    <section id="monitoring" className="space-y-7">
      {/* Main Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Monitoring Sensor (Inlet &amp; Outlet)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemantauan instrumentasi telemetri 7 sensor terpasang pada jalur air baku dan air hasil olahan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            4 Sensor Inlet (Air Baku)
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            3 Sensor Outlet (Air Hasil)
          </span>
        </div>
      </div>

      {/* SECTION 1: INLET MONITORING (4 SENSORS IN A 4-COLUMN GRID) */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-blue-950 leading-tight">
                Inlet Monitoring — Parameter Air Baku (Sebelum Filtrasi)
              </h3>
              <p className="text-xs text-blue-700/80">
                Titik pengukuran sensor pada intake air mentah sungai sebelum proses penjernihan multimedia
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white text-blue-800 rounded-xl border border-blue-200 shadow-2xs self-start sm:self-auto shrink-0">
            4 Sensor Terhubung
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {inletSensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              onRunTest={() => setSelectedSensor(sensor)}
            />
          ))}
        </div>
      </div>

      {/* SECTION 2: OUTLET MONITORING (3 SENSORS IN A 3-COLUMN BALANCED GRID) */}
      <div className="space-y-3.5 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <ArrowUpFromLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-emerald-950 leading-tight">
                Outlet Monitoring — Parameter Air Hasil (Setelah Filtrasi &amp; UV)
              </h3>
              <p className="text-xs text-emerald-700/80">
                Titik pengukuran sensor keluaran air bersih setelah melalui filtrasi 4 lapis dan disinfeksi ultraviolet
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white text-emerald-800 rounded-xl border border-emerald-200 shadow-2xs self-start sm:self-auto shrink-0 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>3 Sensor Terhubung (Lolos Mutu)</span>
          </span>
        </div>

        {/* 3 Cards Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
