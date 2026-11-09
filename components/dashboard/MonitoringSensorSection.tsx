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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Monitoring Sensor (Inlet &amp; Outlet)
            </h2>
            <p className="text-xs text-slate-500">
              Total 7 sensor telemetri yang terbagi sebelum (Inlet) dan setelah proses filtrasi (Outlet)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            4 Sensor Inlet
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            3 Sensor Outlet
          </span>
        </div>
      </div>

      {/* Two Column Panels: Inlet & Outlet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 1: INLET MONITORING (4 Sensors) */}
        <div className="bg-blue-50/40 rounded-3xl p-5 sm:p-6 border border-blue-100/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-blue-200/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <ArrowDownToLine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-blue-950">
                  Inlet Monitoring (Air Baku)
                </h3>
                <p className="text-xs text-blue-700/80">
                  Parameter air mentah sebelum bak sedimentasi dan multimedia filter
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white text-blue-800 rounded-lg border border-blue-200 shadow-2xs">
              4 Sensor
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {inletSensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                onRunTest={() => setSelectedSensor(sensor)}
              />
            ))}
          </div>
        </div>

        {/* PANEL 2: OUTLET MONITORING (3 Sensors) */}
        <div className="bg-emerald-50/40 rounded-3xl p-5 sm:p-6 border border-emerald-100/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <ArrowUpFromLine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  Outlet Monitoring (Air Hasil)
                </h3>
                <p className="text-xs text-emerald-700/80">
                  Parameter air bersih terfiltrasi pasca-chamber disinfeksi UV
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white text-emerald-800 rounded-lg border border-emerald-200 shadow-2xs">
              3 Sensor
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {outletSensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                onRunTest={() => setSelectedSensor(sensor)}
              />
            ))}

            {/* Expansion placeholder card for optional outlet pressure */}
            <div className="bg-white/80 rounded-2xl p-5 border border-dashed border-slate-300 flex flex-col justify-between text-slate-400">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  Port Ekspansi
                </span>
                <h4 className="text-sm font-bold text-slate-600 mt-2">
                  Tekanan Pipa Outlet
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Titik tap transducer opsional (Tidak dihitung dalam 7 sensor utama)
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                Status: Standby Cadangan
              </div>
            </div>
          </div>
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
