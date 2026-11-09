'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PipelineDiagram from '@/components/monitoring/PipelineDiagram';
import SensorCard from '@/components/monitoring/SensorCard';
import { useSystem } from '@/context/SystemContext';
import {
  ArrowDownToLine,
  Waves,
  Gauge,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function InletMonitoringPage() {
  const { sensors } = useSystem();

  const inletSensors = sensors.filter((s) => s.location === 'inlet');
  const turbIn = sensors.find((s) => s.id === 'turbidity_inlet');
  const phIn = sensors.find((s) => s.id === 'ph_inlet');
  const flowIn = sensors.find((s) => s.id === 'flow_inlet');

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <ArrowDownToLine className="w-3.5 h-3.5 text-blue-600" />
            <span>Stasiun Pemantauan Pra-Filtrasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inlet Water Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Pemantauan 4 parameter sensor pada jalur intake air baku sebelum masuk ke proses pengolahan, bak sedimentasi, dan sistem multimedia filter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/monitoring/outlet"
            className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
          >
            Beralih ke Outlet &rarr;
          </Link>
        </div>
      </div>

      {/* Interactive Physical Pipeline Diagram */}
      <PipelineDiagram mode="inlet" />

      {/* 4 Inlet Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {inletSensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>

      {/* Water Intake Information Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Water Intake Information &amp; Karakteristik Air Baku
            </h3>
            <p className="text-xs text-slate-500">
              Analisis kondisi fisik air mentah yang ditarik dari stasiun intake sungai
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Box 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Status Sedimen &amp; Partikel</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px]">
                Sedimen Sedang
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Air baku memiliki beban lumpur dan partikel suspensi alami sebesar{' '}
              <strong className="text-slate-900">{turbIn?.value ?? 85} NTU</strong>. Media filter pasir silika dan zeolit siap melakukan adsorpsi dan penjernihan.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1 font-mono">
              <Clock className="w-3 h-3" />
              Retensi sedimentasi: ~20 menit
            </div>
          </div>

          {/* Box 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Keasaman Alami (pH)</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-[10px]">
                {phIn?.value ?? 6.3} pH
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              pH air baku cenderung agak asam ({phIn?.value ?? 6.32} pH) yang umum pada air sungai akibat dekomposisi organik hulu. Filter zeolit dan karbon akan menetralkannya ke kisaran 7.0–7.2 pH.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Dalam toleransi netralisasi
            </div>
          </div>

          {/* Box 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Laju Alir Pompa &amp; Tekanan</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
                Stabil
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pompa submersible intake beroperasi pada laju{' '}
              <strong className="text-slate-900">{flowIn?.value ?? 20.3} L/jam</strong> dengan tekanan kerja pipa{' '}
              <strong className="text-blue-600">{flowIn?.secondaryValue ?? 1.82} bar</strong>, menjaga tekanan operasional aman multimedia filter.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1 font-mono">
              <Gauge className="w-3 h-3 text-blue-500" />
              Kapasitas nominal: 20 L/jam
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
