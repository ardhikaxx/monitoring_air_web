'use client';

import React from 'react';
import { useSystem } from '@/context/SystemContext';
import { Activity, Zap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PipelineDiagramProps {
  mode: 'inlet' | 'outlet';
  onSelectSensor?: (sensorId: string) => void;
}

export default function PipelineDiagram({ mode, onSelectSensor }: PipelineDiagramProps) {
  const { sensors } = useSystem();

  // Inlet sensors
  const turbIn = sensors.find((s) => s.id === 'turbidity_inlet');
  const phIn = sensors.find((s) => s.id === 'ph_inlet');
  const flowIn = sensors.find((s) => s.id === 'flow_inlet');
  const tempIn = sensors.find((s) => s.id === 'temp_inlet');

  // Outlet sensors
  const turbOut = sensors.find((s) => s.id === 'turbidity_outlet');
  const phOut = sensors.find((s) => s.id === 'ph_outlet');
  const tempOut = sensors.find((s) => s.id === 'temp_outlet');

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'critical':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'offline':
        return '#94A3B8';
      default:
        return '#10B981';
    }
  };

  if (mode === 'inlet') {
    return (
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
                <Activity className="w-4 h-4" />
              </span>
              Skema Fisik Jalur Pipa Inlet &amp; Posisi 4 Sensor
            </h3>
            <p className="text-xs text-slate-500">
              Titik instrumentasi sebelum air masuk ke bak pengendapan dan unit multimedia filter
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Aliran Air Mentah (~20 L/jam)</span>
          </div>
        </div>

        {/* Pipeline SVG Graphic with Sensor Taps */}
        <div className="relative overflow-x-auto py-2">
          <div className="min-w-[760px] p-4 bg-slate-50/70 rounded-2xl border border-slate-200 relative">
            {/* Top Sensor Taps Grid */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              {/* Sensor 1: Flow / Tekanan */}
              <div
                onClick={() => onSelectSensor && onSelectSensor('flow_inlet')}
                className="bg-white p-3 rounded-xl border-2 hover:border-blue-500 cursor-pointer shadow-xs transition-all relative"
                style={{ borderColor: getStatusColor(flowIn?.status) }}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>1. FLOW &amp; TEKANAN</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(flowIn?.status) }}
                  />
                </div>
                <div className="text-lg font-extrabold text-slate-900 font-mono">
                  {flowIn?.value} <span className="text-xs font-normal">L/jam</span>
                </div>
                <div className="text-[10px] text-blue-600 font-mono font-semibold">
                  {flowIn?.secondaryValue} bar • YF-S201
                </div>
                {/* Pointer down to pipe */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-400" />
              </div>

              {/* Sensor 2: Turbidity Inlet */}
              <div
                onClick={() => onSelectSensor && onSelectSensor('turbidity_inlet')}
                className="bg-white p-3 rounded-xl border-2 hover:border-blue-500 cursor-pointer shadow-xs transition-all relative"
                style={{ borderColor: getStatusColor(turbIn?.status) }}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>2. KEKERUHAN INLET</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(turbIn?.status) }}
                  />
                </div>
                <div className="text-lg font-extrabold text-slate-900 font-mono">
                  {turbIn?.value} <span className="text-xs font-normal">NTU</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Gravity v1.0 • GPIO 34</div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-400" />
              </div>

              {/* Sensor 3: pH Inlet */}
              <div
                onClick={() => onSelectSensor && onSelectSensor('ph_inlet')}
                className="bg-white p-3 rounded-xl border-2 hover:border-blue-500 cursor-pointer shadow-xs transition-all relative"
                style={{ borderColor: getStatusColor(phIn?.status) }}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>3. DERAJAT KEASAMAN (PH)</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(phIn?.status) }}
                  />
                </div>
                <div className="text-lg font-extrabold text-slate-900 font-mono">
                  {phIn?.value} <span className="text-xs font-normal">pH</span>
                </div>
                <div className="text-[10px] text-purple-600 font-mono font-semibold">
                  DFRobot Pro • GPIO 35
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-400" />
              </div>

              {/* Sensor 4: Temp Inlet */}
              <div
                onClick={() => onSelectSensor && onSelectSensor('temp_inlet')}
                className="bg-white p-3 rounded-xl border-2 hover:border-blue-500 cursor-pointer shadow-xs transition-all relative"
                style={{ borderColor: getStatusColor(tempIn?.status) }}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>4. TEMPERATUR INLET</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(tempIn?.status) }}
                  />
                </div>
                <div className="text-lg font-extrabold text-slate-900 font-mono">
                  {tempIn?.value} <span className="text-xs font-normal">°C</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">DS18B20 • GPIO 4</div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-400" />
              </div>
            </div>

            {/* Main Industrial Pipe Bar with Water Flow Animation */}
            <div className="relative h-12 bg-slate-300 rounded-xl flex items-center px-4 overflow-hidden border-2 border-slate-400/80 shadow-inner">
              {/* Intake label */}
              <div className="z-10 bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                INTAKE SUNGAI
              </div>

              {/* Water stream inside pipe */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <line
                  x1="0"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                  stroke="#60a5fa"
                  strokeWidth="8"
                  className="animate-water-flow"
                />
              </svg>

              <div className="z-10 ml-auto bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                <span>MENUJU FILTER</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OUTLET MODE
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
            Skema Fisik Jalur Pipa Outlet &amp; Posisi 3 Sensor Utama
          </h3>
          <p className="text-xs text-slate-500">
            Titik pengukuran hasil olahan pasca-chamber disinfeksi UV menuju tangki penampungan akhir
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Air Hasil Olahan (Lolos Baku Mutu)</span>
        </div>
      </div>

      {/* Outlet Pipe Graphic */}
      <div className="relative overflow-x-auto py-2">
        <div className="min-w-[760px] p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/60 relative">
          {/* Top Sensor Taps Grid */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {/* Sensor 1: Turbidity Outlet */}
            <div
              onClick={() => onSelectSensor && onSelectSensor('turbidity_outlet')}
              className="bg-white p-3 rounded-xl border-2 hover:border-emerald-500 cursor-pointer shadow-xs transition-all relative"
              style={{ borderColor: getStatusColor(turbOut?.status) }}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                <span>1. KEKERUHAN OUTLET</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStatusColor(turbOut?.status) }}
                />
              </div>
              <div className="text-lg font-extrabold text-emerald-700 font-mono">
                {turbOut?.value} <span className="text-xs font-normal">NTU</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-mono font-semibold">
                Baku Mutu &lt; 5 NTU • GPIO 32
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-emerald-400" />
            </div>

            {/* Sensor 2: pH Outlet */}
            <div
              onClick={() => onSelectSensor && onSelectSensor('ph_outlet')}
              className="bg-white p-3 rounded-xl border-2 hover:border-emerald-500 cursor-pointer shadow-xs transition-all relative"
              style={{ borderColor: getStatusColor(phOut?.status) }}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                <span>2. PH HASIL OLAHAN</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStatusColor(phOut?.status) }}
                />
              </div>
              <div className="text-lg font-extrabold text-blue-700 font-mono">
                {phOut?.value} <span className="text-xs font-normal">pH</span>
              </div>
              <div className="text-[10px] text-blue-600 font-mono font-semibold">
                Netral (6.5 - 8.5) • GPIO 33
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-emerald-400" />
            </div>

            {/* Sensor 3: Temp Outlet */}
            <div
              onClick={() => onSelectSensor && onSelectSensor('temp_outlet')}
              className="bg-white p-3 rounded-xl border-2 hover:border-emerald-500 cursor-pointer shadow-xs transition-all relative"
              style={{ borderColor: getStatusColor(tempOut?.status) }}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                <span>3. TEMPERATUR OUTLET</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStatusColor(tempOut?.status) }}
                />
              </div>
              <div className="text-lg font-extrabold text-slate-800 font-mono">
                {tempOut?.value} <span className="text-xs font-normal">°C</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">DS18B20 • GPIO 5</div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-emerald-400" />
            </div>

            {/* Optional Expansion Port: Pressure Tap */}
            <div className="bg-slate-100/70 p-3 rounded-xl border border-dashed border-slate-300 relative text-slate-500">
              <div className="flex items-center justify-between text-[10px] font-bold mb-1 text-slate-400">
                <span>PORT EKSPANSI (OPSIONAL)</span>
                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded text-[9px]">Optional</span>
              </div>
              <div className="text-sm font-bold text-slate-600 font-mono">Tekanan Outlet</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Titik tap cadangan (Tidak dihitung dalam 7 sensor utama)
              </div>
            </div>
          </div>

          {/* Clean Water Output Pipeline */}
          <div className="relative h-12 bg-cyan-100 rounded-xl flex items-center px-4 overflow-hidden border-2 border-cyan-400/80 shadow-inner">
            <div className="z-10 bg-purple-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-200" />
              <span>PASCA-UV 254nm</span>
            </div>

            {/* Crystal clean water animation */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="#06b6d4"
                strokeWidth="8"
                className="animate-water-flow"
              />
            </svg>

            <div className="z-10 ml-auto bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
              <span>TANGKI AIR BERSIH</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
