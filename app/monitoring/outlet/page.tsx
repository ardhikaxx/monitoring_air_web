'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PipelineDiagram from '@/components/monitoring/PipelineDiagram';
import SensorCard from '@/components/monitoring/SensorCard';
import WaterQualityComparison from '@/components/dashboard/WaterQualityComparison';
import { useSystem } from '@/context/SystemContext';
import {
  ArrowUpFromLine,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function OutletMonitoringPage() {
  const { sensors, purificationEfficiency } = useSystem();

  const outletSensors = sensors.filter((s) => s.location === 'outlet');
  const turbOut = sensors.find((s) => s.id === 'turbidity_outlet');
  const phOut = sensors.find((s) => s.id === 'ph_outlet');

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <ArrowUpFromLine className="w-3.5 h-3.5 text-emerald-600" />
            <span>Stasiun Pemantauan Pasca-Filtrasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Outlet Water Quality Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Pemantauan 3 parameter sensor utama pada titik keluaran setelah melalui 4 tingkat multimedia filter dan chamber disinfeksi UV menuju penampungan air bersih.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/monitoring/inlet"
            className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
          >
            &larr; Lihat Inlet
          </Link>
        </div>
      </div>

      {/* Interactive Physical Pipeline Diagram for Outlet */}
      <PipelineDiagram mode="outlet" />

      {/* 3 Outlet Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {outletSensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>

      {/* Water Quality Result & Permenkes Assessment Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Water Quality Result &amp; Kepatuhan Baku Mutu Air Bersih
              </h3>
              <p className="text-xs text-slate-500">
                Verifikasi indikator fisik-kimia terhadap standar Permenkes No. 2 Tahun 2023 / Permenkes 32/2017
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            Status: Layak Pakai Sanitasi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Item 1: Turbidity Outlet */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Kekeruhan (Turbidity)</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                Lolos Baku Mutu
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {turbOut?.value} <span className="text-xs font-normal">NTU</span>
            </div>
            <div className="text-xs text-slate-500">
              Batas Maksimum Permenkes: <strong>5.0 NTU</strong>. Reduksi kejernihan mencapai{' '}
              <strong className="text-slate-800">{purificationEfficiency}%</strong>.
            </div>
          </div>

          {/* Item 2: pH Outlet */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Derajat Keasaman (pH)</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800">
                Netral Sempurna
              </span>
            </div>
            <div className="text-2xl font-black text-blue-700 font-mono">
              {phOut?.value} <span className="text-xs font-normal">pH</span>
            </div>
            <div className="text-xs text-slate-500">
              Rentang Baku Mutu: <strong>6.5 – 8.5 pH</strong>. Bebas dari sifat korosif asam atau alkalinitas berlebih.
            </div>
          </div>

          {/* Item 3: Disinfeksi UV */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Disinfeksi Ultraviolet</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-800">
                Chamber Aktif
              </span>
            </div>
            <div className="text-2xl font-black text-purple-700 font-mono flex items-center gap-1.5">
              <Zap className="w-5 h-5 text-purple-600" />
              <span>254 nm</span>
            </div>
            <div className="text-xs text-slate-500">
              Radiasi UV-C kontinu mematikan patogen dan E. coli tanpa meninggalkan residu kimia berbahaya.
            </div>
          </div>
        </div>
      </div>

      {/* Water Quality Comparison Box */}
      <WaterQualityComparison />
    </AppLayout>
  );
}
