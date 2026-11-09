'use client';

import React from 'react';
import { useSystem } from '@/context/SystemContext';
import {
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  Droplet,
  Thermometer,
  Compass,
  Info,
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
    <div id="quality-comparison" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Komparasi Kualitas Air (Inlet vs Outlet)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Perbandingan langsung efektivitas sebelum (air mentah) dan sesudah pengolahan filtrasi multimedia & UV.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Kualitas Meningkat Signifikan</span>
          </span>
        </div>
      </div>

      {/* 3 Parameter Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Turbidity Comparison */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-blue-500" />
                Tingkat Kekeruhan
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Reduksi {purificationEfficiency}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Inlet (Baku)</div>
                <div className="text-lg font-extrabold text-slate-800 font-mono mt-0.5">{turbIn} <span className="text-xs font-normal">NTU</span></div>
                <div className="text-[10px] text-amber-600 font-medium">Keruh / Bersedimen</div>
              </div>
              <div className="border-l border-slate-100 pl-3">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Outlet (Hasil)</div>
                <div className="text-lg font-extrabold text-emerald-600 font-mono mt-0.5">{turbOut} <span className="text-xs font-normal">NTU</span></div>
                <div className="text-[10px] text-emerald-600 font-medium">Jernih Sempurna</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              Turun {turbDiff} NTU
            </span>
            <span className="text-emerald-700 font-semibold text-[11px]">Baku Mutu &lt; 5 NTU (Lolos)</span>
          </div>
        </div>

        {/* pH Comparison */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-500" />
                Derajat Keasaman (pH)
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Netralisasi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Inlet (Baku)</div>
                <div className="text-lg font-extrabold text-slate-800 font-mono mt-0.5">{phIn} <span className="text-xs font-normal">pH</span></div>
                <div className="text-[10px] text-slate-500 font-medium">Cenderung Asam</div>
              </div>
              <div className="border-l border-slate-100 pl-3">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Outlet (Hasil)</div>
                <div className="text-lg font-extrabold text-blue-600 font-mono mt-0.5">{phOut} <span className="text-xs font-normal">pH</span></div>
                <div className="text-[10px] text-blue-600 font-medium">Netral Ideal</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Naik +{phDiff} pH
            </span>
            <span className="text-blue-700 font-semibold text-[11px]">Standar 6.5 - 8.5 (Optimal)</span>
          </div>
        </div>

        {/* Temperature Comparison */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-rose-500" />
                Suhu Air
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Stabil
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Inlet (Baku)</div>
                <div className="text-lg font-extrabold text-slate-800 font-mono mt-0.5">{tempIn} <span className="text-xs font-normal">°C</span></div>
                <div className="text-[10px] text-slate-500 font-medium">Suhu Lingkungan</div>
              </div>
              <div className="border-l border-slate-100 pl-3">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Outlet (Hasil)</div>
                <div className="text-lg font-extrabold text-slate-800 font-mono mt-0.5">{tempOut} <span className="text-xs font-normal">°C</span></div>
                <div className="text-[10px] text-slate-500 font-medium">Normal Pasca-UV</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Minus className="w-3.5 h-3.5 text-slate-400" />
              Selisih +{tempDiff} °C
            </span>
            <span className="text-slate-600 font-semibold text-[11px]">Suhu Kamar Operasional</span>
          </div>
        </div>
      </div>

      {/* Health & Safety Disclaimer Notice */}
      <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-slate-600 text-[11px] leading-relaxed flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-900">Catatan Kepatuhan Regulasi:</span> Penilaian kualitas air dalam aplikasi merupakan indikator monitoring berbasis sensor telemetri berdasarkan parameter dan ambang batas yang dikonfigurasi, bukan sertifikasi uji mikrobiologi kelayakan air minum laboratorium resmi.
        </div>
      </div>
    </div>
  );
}
