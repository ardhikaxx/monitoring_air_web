'use client';

import React from 'react';
import { useSystem } from '@/context/SystemContext';
import {
  Scale,
  Droplet,
  Compass,
  Thermometer,
} from 'lucide-react';

export default function WaterQualityComparison() {
  const { sensors, purificationEfficiency } = useSystem();

  const turbIn = sensors.find((s) => s.id === 'turbidity_inlet')?.value ?? 85.4;
  const phIn = sensors.find((s) => s.id === 'ph_inlet')?.value ?? 6.32;
  const tempIn = sensors.find((s) => s.id === 'temp_inlet')?.value ?? 27.2;

  const turbOut = sensors.find((s) => s.id === 'turbidity_outlet')?.value ?? 2.85;
  const phOut = sensors.find((s) => s.id === 'ph_outlet')?.value ?? 7.08;
  const tempOut = sensors.find((s) => s.id === 'temp_outlet')?.value ?? 27.8;

  const phDiff = (phOut - phIn).toFixed(2);
  const tempDiff = (tempOut - tempIn).toFixed(1);

  return (
    <section id="comparison" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Komparasi Kualitas Air
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbandingan parameter air sebelum (inlet) dan setelah (outlet) filtrasi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            Efisiensi Reduksi {purificationEfficiency}%
          </span>
        </div>
      </div>

      {/* 3 Parameter Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. TURBIDITY COMPARISON */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                Tingkat Kekeruhan
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700">
              -{purificationEfficiency}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Inlet (Baku)</div>
              <div className="text-xl font-black text-slate-800 font-mono mt-0.5">
                {turbIn} <span className="text-xs font-normal text-slate-500">NTU</span>
              </div>
            </div>
            <div className="border-l border-slate-100 pl-2.5">
              <div className="text-[10px] text-slate-400 font-medium">Outlet (Hasil)</div>
              <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">
                {turbOut} <span className="text-xs font-normal text-slate-500">NTU</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Baku Mutu: ≤ 5 NTU</span>
            <span className="text-emerald-700 font-semibold">Memenuhi Syarat</span>
          </div>
        </div>

        {/* 2. pH COMPARISON */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-800">
                Derajat Keasaman (pH)
              </span>
            </div>
            <span className="text-[11px] font-bold text-blue-700">
              Netralisasi
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Inlet (Baku)</div>
              <div className="text-xl font-black text-slate-800 font-mono mt-0.5">
                {phIn} <span className="text-xs font-normal text-slate-500">pH</span>
              </div>
            </div>
            <div className="border-l border-slate-100 pl-2.5">
              <div className="text-[10px] text-slate-400 font-medium">Outlet (Hasil)</div>
              <div className="text-xl font-black text-blue-600 font-mono mt-0.5">
                {phOut} <span className="text-xs font-normal text-slate-500">pH</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Standar: 6.5 – 8.5</span>
            <span className="text-blue-700 font-semibold">Netral (+{phDiff})</span>
          </div>
        </div>

        {/* 3. TEMPERATURE COMPARISON */}
        <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-800">
                Suhu Air
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              Stabil
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Inlet (Baku)</div>
              <div className="text-xl font-black text-slate-800 font-mono mt-0.5">
                {tempIn} <span className="text-xs font-normal text-slate-500">°C</span>
              </div>
            </div>
            <div className="border-l border-slate-100 pl-2.5">
              <div className="text-[10px] text-slate-400 font-medium">Outlet (Hasil)</div>
              <div className="text-xl font-black text-slate-800 font-mono mt-0.5">
                {tempOut} <span className="text-xs font-normal text-slate-500">°C</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Suhu Kamar (25°–28°C)</span>
            <span className="text-slate-700 font-semibold">Selisih {tempDiff} °C</span>
          </div>
        </div>
      </div>
    </section>
  );
}
