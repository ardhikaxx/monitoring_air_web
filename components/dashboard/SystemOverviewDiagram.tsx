'use client';

import React, { useState } from 'react';
import { useSystem } from '@/context/SystemContext';
import {
  Waves,
  Droplets,
  Zap,
  Info,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

interface StageDetail {
  id: string;
  name: string;
  category: 'source' | 'inlet_sensors' | 'sedimentation' | 'filter' | 'uv' | 'outlet_sensors' | 'clean_tank';
  description: string;
  specs: string[];
  status: 'normal' | 'warning' | 'active';
}

export default function SystemOverviewDiagram() {
  const { sensors, purificationEfficiency } = useSystem();
  const [selectedStage, setSelectedStage] = useState<StageDetail | null>(null);

  // Sensor lookups
  const turbIn = sensors.find((s) => s.id === 'turbidity_inlet');
  const phIn = sensors.find((s) => s.id === 'ph_inlet');
  const flowIn = sensors.find((s) => s.id === 'flow_inlet');
  const tempIn = sensors.find((s) => s.id === 'temp_inlet');

  const turbOut = sensors.find((s) => s.id === 'turbidity_outlet');
  const phOut = sensors.find((s) => s.id === 'ph_outlet');
  const tempOut = sensors.find((s) => s.id === 'temp_outlet');

  const stages: StageDetail[] = [
    {
      id: 'source',
      name: 'Sumber Air Baku (Sungai)',
      category: 'source',
      description: 'Intake air permukaan alami dengan kandungan partikel suspensi, sedimen tanah, dan mikroorganisme.',
      specs: ['Debit Pompa Intake: ~20 L/jam', 'Tingkat Kekeruhan: 80 - 100 NTU', 'Sumber: Air Permukaan Alami'],
      status: 'active',
    },
    {
      id: 'raw_tank',
      name: 'Tangki Air Baku',
      category: 'source',
      description: 'Penampung sementara sebelum didistribusikan ke stasiun sensor inlet dan bak pengendapan awal.',
      specs: ['Kapasitas: 50 Liter', 'Level Air: 85% Optimal', 'Bahan: Food-Grade HDPE'],
      status: 'normal',
    },
    {
      id: 'inlet_sensors',
      name: 'Stasiun Sensor Inlet',
      category: 'inlet_sensors',
      description: 'Titik pengukuran awal kualitas air baku sebelum melalui proses reduksi kekeruhan dan filtrasi fisik-kimia.',
      specs: [
        `Kekeruhan: ${turbIn?.value ?? 85} NTU`,
        `pH Air Baku: ${phIn?.value ?? 6.3} pH`,
        `Laju Aliran: ${flowIn?.value ?? 20} L/jam (${flowIn?.secondaryValue ?? 1.8} bar)`,
        `Suhu: ${tempIn?.value ?? 27.2} °C`,
      ],
      status: 'normal',
    },
    {
      id: 'sedimentation',
      name: 'Bak Pengendapan',
      category: 'sedimentation',
      description: 'Pemisahan gravitasi untuk partikel makro dan sedimen lumpur kasar sebelum memasuki media filter bertingkat.',
      specs: ['Waktu Retensi: 20 menit', 'Reduksi Partikel Kasar: ~40%', 'Drain Otomatis: Setiap 8 jam'],
      status: 'normal',
    },
    {
      id: 'filter_gravel',
      name: 'Filter Kerikil (Gravel)',
      category: 'filter',
      description: 'Penyaring partikel besar, daun, kerikil halus, dan kotoran makro.',
      specs: ['Ukuran Media: 5 - 10 mm', 'Material: Silika Granit Alami', 'Efisiensi: Partikel > 500 µm'],
      status: 'normal',
    },
    {
      id: 'filter_sand',
      name: 'Filter Pasir Silika',
      category: 'filter',
      description: 'Menyaring partikel lumpur halus, endapan suspensi, dan kekeruhan sekunder.',
      specs: ['Ukuran Mesh: 20 - 40 mesh', 'Kemurnian SiO2: > 98%', 'Reduksi Kekeruhan: ~60%'],
      status: 'normal',
    },
    {
      id: 'filter_zeolite',
      name: 'Filter Zeolit Alam',
      category: 'filter',
      description: 'Menyerap logam berat, mereduksi kadar amonia, dan menstabilkan keasaman (pH) air.',
      specs: ['Kapasitas Tukar Kation: 120 meq/100g', 'Aktivasi: Termal Kimiawi', 'Fungsi: Ion Exchange & Adsorption'],
      status: 'normal',
    },
    {
      id: 'filter_carbon',
      name: 'Filter Karbon Aktif',
      category: 'filter',
      description: 'Menghilangkan bau, warna kekuningan, zat organik terlarut, dan residu klorin.',
      specs: ['Iodine Number: > 900 mg/g', 'Bahan Dasar: Tempurung Kelapa', 'Efisiensi Bau & Rasa: 99%'],
      status: 'normal',
    },
    {
      id: 'uv_sterilizer',
      name: 'Unit Disinfeksi UV',
      category: 'uv',
      description: 'Sterilisasi germisida dengan radiasi Ultraviolet-C panjang gelombang 254 nm untuk membasmi bakteri & patogen.',
      specs: ['Daya Lampu: 16 Watt UV-C', 'Dosis Iradiasi: > 30 mJ/cm²', 'Efektivitas Bakterisida: 99.9%'],
      status: 'active',
    },
    {
      id: 'outlet_sensors',
      name: 'Stasiun Sensor Outlet',
      category: 'outlet_sensors',
      description: 'Pengukuran final kualitas air hasil olahan untuk memverifikasi kesesuaian dengan baku mutu air bersih.',
      specs: [
        `Kekeruhan Hasil: ${turbOut?.value ?? 2.8} NTU (Standar < 5 NTU)`,
        `pH Air Olahan: ${phOut?.value ?? 7.08} pH (Netral)`,
        `Suhu Hasil: ${tempOut?.value ?? 27.8} °C`,
      ],
      status: 'normal',
    },
    {
      id: 'clean_tank',
      name: 'Tangki Air Hasil',
      category: 'clean_tank',
      description: 'Reservoir air bersih siap guna untuk distribusi kebutuhan sanitasi atau filtrasi lanjutan.',
      specs: ['Kapasitas: 100 Liter', 'Kualitas: Lolos Standar Permenkes', 'Status Aliran: Kontinu'],
      status: 'normal',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              System Overview & Skema Alur Filtrasi Air
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualisasi terintegrasi dari sumber air baku, stasiun sensor inlet, 4 tahap filtrasi multimedia, disinfeksi UV, hingga stasiun sensor outlet.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Efektivitas Reduksi: {purificationEfficiency}%</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Horizontal Process Diagram */}
      <div className="relative overflow-x-auto pb-4 pt-1">
        <div className="min-w-[980px] p-2">
          {/* Legend and Flow Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="font-medium text-slate-600">Air Baku Keruh (Inlet)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="font-medium text-slate-600">Air Jernih Terfiltrasi (Outlet)</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Arah Aliran Air: Kiri ke Kanan</span>
            </div>
          </div>

          {/* Process Flow Cards with Flow Connecting Pipeline */}
          <div className="relative flex items-center justify-between gap-2.5">
            {/* SVG Connecting Flow Pipe in Background */}
            <svg
              className="absolute top-1/2 left-4 right-4 -translate-y-1/2 w-full h-4 z-0 pointer-events-none"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="#cbd5e1"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="#1677C8"
                strokeWidth="3"
                className="animate-water-flow"
              />
            </svg>

            {/* STAGE 1: Intake & Raw Tank */}
            <div
              onClick={() => setSelectedStage(stages[0])}
              className="relative z-10 w-28 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 rounded-2xl p-2.5 text-center cursor-pointer transition-all hover:scale-105 shadow-xs"
            >
              <div className="w-8 h-8 mx-auto rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center mb-1.5 shadow-inner">
                <Waves className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">Sungai / Baku</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Tangki 50L</div>
              <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] bg-slate-200 text-slate-700 font-semibold">
                Intake
              </span>
            </div>

            {/* STAGE 2: INLET SENSOR STATION (Highlighted) */}
            <div
              onClick={() => setSelectedStage(stages[2])}
              className="relative z-10 w-44 bg-gradient-to-b from-blue-50 to-indigo-50/70 border-2 border-blue-400 rounded-2xl p-2.5 cursor-pointer transition-all hover:scale-105 shadow-md shadow-blue-500/10"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-blue-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                  Sensor Inlet
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-200/80 text-blue-900 font-bold">
                  4 Sensor
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px] bg-white/90 p-1.5 rounded-xl border border-blue-200/80 font-mono">
                <div>
                  <div className="text-[8px] text-slate-400">KEKERUHAN</div>
                  <div className="font-bold text-slate-800">{turbIn?.value} NTU</div>
                </div>
                <div>
                  <div className="text-[8px] text-slate-400">PH AIR</div>
                  <div className="font-bold text-slate-800">{phIn?.value} pH</div>
                </div>
                <div>
                  <div className="text-[8px] text-slate-400">DEBIT</div>
                  <div className="font-bold text-slate-800">{flowIn?.value} L/j</div>
                </div>
                <div>
                  <div className="text-[8px] text-slate-400">TEMPERATUR</div>
                  <div className="font-bold text-slate-800">{tempIn?.value} °C</div>
                </div>
              </div>
            </div>

            {/* STAGE 3: Sedimentation */}
            <div
              onClick={() => setSelectedStage(stages[3])}
              className="relative z-10 w-24 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-2 text-center cursor-pointer transition-all hover:scale-105 shadow-xs"
            >
              <div className="w-7 h-7 mx-auto rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-1">
                <span className="text-[10px] font-bold">SED</span>
              </div>
              <div className="text-[10px] font-bold text-slate-800 leading-tight">Bak Endap</div>
              <div className="text-[8px] text-slate-400 mt-0.5">Gravitasi</div>
            </div>

            {/* STAGE 4: MULTIMEDIA FILTRATION 4 COLUMNS */}
            <div className="relative z-10 bg-slate-900 text-white rounded-2xl p-2 border border-slate-700 shadow-md flex items-center gap-1.5">
              {/* Filter 1: Kerikil */}
              <div
                onClick={() => setSelectedStage(stages[4])}
                className="w-20 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-xl text-center cursor-pointer transition-colors border border-slate-700"
              >
                <div className="w-5 h-5 mx-auto rounded-md bg-stone-700 text-[9px] font-bold flex items-center justify-center text-stone-200 mb-1">
                  1
                </div>
                <div className="text-[9px] font-bold text-slate-200 leading-tight">Kerikil</div>
                <div className="text-[8px] text-slate-400">Kotoran Besar</div>
              </div>

              {/* Filter 2: Pasir Silika */}
              <div
                onClick={() => setSelectedStage(stages[5])}
                className="w-20 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-xl text-center cursor-pointer transition-colors border border-slate-700"
              >
                <div className="w-5 h-5 mx-auto rounded-md bg-amber-800 text-[9px] font-bold flex items-center justify-center text-amber-200 mb-1">
                  2
                </div>
                <div className="text-[9px] font-bold text-slate-200 leading-tight">Silika</div>
                <div className="text-[8px] text-slate-400">Lumpur Halus</div>
              </div>

              {/* Filter 3: Zeolit */}
              <div
                onClick={() => setSelectedStage(stages[6])}
                className="w-20 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-xl text-center cursor-pointer transition-colors border border-slate-700"
              >
                <div className="w-5 h-5 mx-auto rounded-md bg-emerald-800 text-[9px] font-bold flex items-center justify-center text-emerald-200 mb-1">
                  3
                </div>
                <div className="text-[9px] font-bold text-slate-200 leading-tight">Zeolit</div>
                <div className="text-[8px] text-slate-400">Tukar Kation</div>
              </div>

              {/* Filter 4: Karbon Aktif */}
              <div
                onClick={() => setSelectedStage(stages[7])}
                className="w-20 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-xl text-center cursor-pointer transition-colors border border-slate-700"
              >
                <div className="w-5 h-5 mx-auto rounded-md bg-slate-700 text-[9px] font-bold flex items-center justify-center text-slate-200 mb-1">
                  4
                </div>
                <div className="text-[9px] font-bold text-slate-200 leading-tight">Karbon</div>
                <div className="text-[8px] text-slate-400">Bau & Warna</div>
              </div>
            </div>

            {/* STAGE 5: UV DISINFECTION */}
            <div
              onClick={() => setSelectedStage(stages[8])}
              className="relative z-10 w-24 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 rounded-2xl p-2 text-center cursor-pointer transition-all hover:scale-105 shadow-xs"
            >
              <div className="w-7 h-7 mx-auto rounded-lg bg-purple-200 text-purple-700 flex items-center justify-center mb-1">
                <Zap className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-[10px] font-bold text-purple-900 leading-tight">Unit UV</div>
              <div className="text-[8px] text-purple-600 mt-0.5">Sterilisasi 254nm</div>
            </div>

            {/* STAGE 6: OUTLET SENSOR STATION (Highlighted) */}
            <div
              onClick={() => setSelectedStage(stages[9])}
              className="relative z-10 w-44 bg-gradient-to-b from-cyan-50 to-emerald-50/70 border-2 border-emerald-400 rounded-2xl p-2.5 cursor-pointer transition-all hover:scale-105 shadow-md shadow-emerald-500/10"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Sensor Outlet
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-200/80 text-emerald-900 font-bold">
                  3 Sensor
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px] bg-white/90 p-1.5 rounded-xl border border-emerald-200/80 font-mono">
                <div>
                  <div className="text-[8px] text-slate-400">KEKERUHAN</div>
                  <div className="font-bold text-emerald-700">{turbOut?.value} NTU</div>
                </div>
                <div>
                  <div className="text-[8px] text-slate-400">PH HASIL</div>
                  <div className="font-bold text-emerald-700">{phOut?.value} pH</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[8px] text-slate-400">TEMPERATUR AIR</div>
                  <div className="font-bold text-slate-800">{tempOut?.value} °C</div>
                </div>
              </div>
            </div>

            {/* STAGE 7: Clean Water Tank */}
            <div
              onClick={() => setSelectedStage(stages[10])}
              className="relative z-10 w-28 bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-400 rounded-2xl p-2.5 text-center cursor-pointer transition-all hover:scale-105 shadow-xs"
            >
              <div className="w-8 h-8 mx-auto rounded-xl bg-cyan-200 text-cyan-800 flex items-center justify-center mb-1.5 shadow-inner">
                <Droplets className="w-4 h-4 text-cyan-700" />
              </div>
              <div className="text-[11px] font-bold text-cyan-900 leading-tight">Tangki Hasil</div>
              <div className="text-[9px] text-cyan-700 mt-0.5">Air Bersih 100L</div>
              <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold">
                Layak Pakai
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Stage Detail Inspector Popover / Card */}
      {selectedStage ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all animate-in fade-in-0 slide-in-from-top-1">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">{selectedStage.name}</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 rounded-full">
                  Komponen Aktif
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {selectedStage.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedStage(null)}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-200/70"
            >
              Tutup
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Spesifikasi Operasional:</span>
            {selectedStage.specs.map((spec, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-2 text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          <span>Klik salah satu komponen atau stasiun sensor di atas untuk melihat spesifikasi detail dan peran operasionalnya.</span>
        </div>
      )}
    </div>
  );
}
