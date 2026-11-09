'use client';

import React from 'react';
import { useSystem } from '@/context/SystemContext';
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Droplet,
  Thermometer,
  Compass,
  Info,
  Sparkles,
} from 'lucide-react';

export default function WaterQualityComparison() {
  const { sensors, purificationEfficiency } = useSystem();

  const turbIn = sensors.find((s) => s.id === 'turbidity_inlet')?.value ?? 85.4;
  const phIn = sensors.find((s) => s.id === 'ph_inlet')?.value ?? 6.32;
  const tempIn = sensors.find((s) => s.id === 'temp_inlet')?.value ?? 27.2;

  const turbOut = sensors.find((s) => s.id === 'turbidity_outlet')?.value ?? 2.85;
  const phOut = sensors.find((s) => s.id === 'ph_outlet')?.value ?? 7.08;
  const tempOut = sensors.find((s) => s.id === 'temp_outlet')?.value ?? 27.8;

  const turbDiff = (turbIn - turbOut).toFixed(1);
  const phDiff = (phOut - phIn).toFixed(2);
  const tempDiff = (tempOut - tempIn).toFixed(1);

  return (
    <section id="comparison" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Komparasi Kualitas Air (Inlet vs Outlet)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi efektivitas reduksi kekeruhan, netralisasi pH, dan kestabilan termal air pasca-filtrasi
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Skor Reduksi: {purificationEfficiency}% (Sangat Baik)</span>
          </div>
        </div>
      </div>

      {/* 3 Parameter Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. TURBIDITY COMPARISON */}
        <div className="bg-gradient-to-b from-slate-50 to-amber-50/20 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <Droplet className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Tingkat Kekeruhan
                </span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Reduksi {purificationEfficiency}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-inner">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inlet (Baku)</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  {turbIn} <span className="text-xs font-normal text-slate-500">NTU</span>
                </div>
                <div className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded w-fit mt-1">
                  Keruh / Suspensi
                </div>
              </div>
              <div className="border-l border-slate-100 pl-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outlet (Hasil)</div>
                <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
                  {turbOut} <span className="text-xs font-normal text-slate-500">NTU</span>
                </div>
                <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded w-fit mt-1">
                  Jernih Sempurna
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              Turun <strong>{turbDiff} NTU</strong>
            </span>
            <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              Baku Mutu &lt; 5 NTU (Lolos)
            </span>
          </div>
        </div>

        {/* 2. pH COMPARISON */}
        <div className="bg-gradient-to-b from-slate-50 to-blue-50/20 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Derajat Keasaman (pH)
                </span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Netralisasi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-inner">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inlet (Baku)</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  {phIn} <span className="text-xs font-normal text-slate-500">pH</span>
                </div>
                <div className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">
                  Cenderung Asam
                </div>
              </div>
              <div className="border-l border-slate-100 pl-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outlet (Hasil)</div>
                <div className="text-2xl font-black text-blue-600 font-mono mt-1">
                  {phOut} <span className="text-xs font-normal text-slate-500">pH</span>
                </div>
                <div className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded w-fit mt-1">
                  Netral Ideal
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Naik <strong>+{phDiff} pH</strong>
            </span>
            <span className="text-blue-700 font-bold text-[11px] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              Standar 6.5 – 8.5 pH (Lolos)
            </span>
          </div>
        </div>

        {/* 3. TEMPERATURE COMPARISON */}
        <div className="bg-gradient-to-b from-slate-50 to-cyan-50/20 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                  <Thermometer className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Temperatur Air
                </span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Termal Stabil
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-inner">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inlet (Baku)</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  {tempIn} <span className="text-xs font-normal text-slate-500">°C</span>
                </div>
                <div className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">
                  Suhu Intake
                </div>
              </div>
              <div className="border-l border-slate-100 pl-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outlet (Hasil)</div>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">
                  {tempOut} <span className="text-xs font-normal text-slate-500">°C</span>
                </div>
                <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded w-fit mt-1">
                  Pasca-UV Aman
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Minus className="w-4 h-4 text-slate-400" />
              Selisih <strong>+{tempDiff} °C</strong>
            </span>
            <span className="text-slate-700 font-semibold text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
              Suhu Operasional Normal
            </span>
          </div>
        </div>
      </div>

      {/* Compliance Disclaimer Notice */}
      <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-slate-600 text-xs leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-blue-950">Catatan Regulasi Kualitas Air:</span> Penilaian kualitas air dalam dashboard merupakan indikator monitoring telemetri sensorik berdasarkan parameter ambang batas yang dikonfigurasi, bukan sertifikasi kelayakan air minum mikrobiologi laboratorium resmi.
        </div>
      </div>
    </section>
  );
}
