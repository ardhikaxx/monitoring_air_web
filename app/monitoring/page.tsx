'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import SensorCard from '@/components/monitoring/SensorCard';
import { useSystem } from '@/context/SystemContext';
import { Activity, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import Link from 'next/link';

export default function MonitoringAllPage() {
  const { sensors } = useSystem();

  const inletSensors = sensors.filter((s) => s.location === 'inlet');
  const outletSensors = sensors.filter((s) => s.location === 'outlet');

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>Telemetri Stasiun Penuh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Monitoring Seluruh Sensor (7 Unit)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Pemantauan lengkap seluruh instrumentasi sensor yang terpasang pada jalur air baku (Inlet) dan jalur air olahan siap pakai (Outlet).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/monitoring/inlet"
            className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
          >
            Fokus Inlet
          </Link>
          <Link
            href="/monitoring/outlet"
            className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
          >
            Fokus Outlet
          </Link>
        </div>
      </div>

      {/* SECTION 1: INLET SENSORS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-950">
                Inlet Sensors (4 Sensor Sebelum Proses Filtrasi)
              </h2>
              <p className="text-xs text-blue-700/90">
                Berfungsi mengukur kondisi air mentah (raw water) dari intake sungai sebelum masuk ke bak pengendapan dan multimedia filter.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white text-blue-800 rounded-xl border border-blue-200 shrink-0">
            4 / 4 Terhubung
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {inletSensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </section>

      {/* SECTION 2: OUTLET SENSORS */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <ArrowUpFromLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-emerald-950">
                Outlet Sensors (3 Sensor Setelah Filtrasi &amp; Disinfeksi UV)
              </h2>
              <p className="text-xs text-emerald-700/90">
                Berfungsi memverifikasi kelayakan air hasil olahan setelah melalui 4 tahap multimedia filter dan chamber radiasi ultraviolet.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white text-emerald-800 rounded-xl border border-emerald-200 shrink-0">
            3 / 3 Terhubung
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {outletSensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
