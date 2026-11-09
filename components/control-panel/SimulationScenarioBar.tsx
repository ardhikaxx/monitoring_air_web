'use client';

import React from 'react';
import { useSystem } from '@/context/SystemContext';
import { SimulationScenario } from '@/types/sensor';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Thermometer,
  WifiOff,
  Radio,
} from 'lucide-react';

export default function SimulationScenarioBar() {
  const { applyScenario, activeScenario } = useSystem();

  const scenarios: {
    id: SimulationScenario;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      id: 'all_normal',
      label: '1. Semua Normal',
      description: 'Baseline: Air baku 85 NTU, air hasil 2.8 NTU, pH 7.08',
      icon: CheckCircle,
      color: 'hover:border-emerald-400 hover:bg-emerald-50 text-emerald-800',
    },
    {
      id: 'turbidity_spike',
      label: '2. Kekeruhan Naik',
      description: 'Inlet melonjak ke 142 NTU akibat lumpur hujan hulu',
      icon: TrendingUp,
      color: 'hover:border-amber-400 hover:bg-amber-50 text-amber-800',
    },
    {
      id: 'ph_acidic',
      label: '3. pH Outlet Asam',
      description: 'pH keluaran turun ke 5.85 pH (di luar batas aman)',
      icon: AlertTriangle,
      color: 'hover:border-rose-400 hover:bg-rose-50 text-rose-800',
    },
    {
      id: 'flow_drop',
      label: '4. Debit Menurun',
      description: 'Flow rate drop ke 9.2 L/j (filter/pipa tersumbat)',
      icon: TrendingDown,
      color: 'hover:border-blue-400 hover:bg-blue-50 text-blue-800',
    },
    {
      id: 'temp_error',
      label: '5. Suhu Panas',
      description: 'Sensor suhu inlet membaca anomali 38.6 °C',
      icon: Thermometer,
      color: 'hover:border-orange-400 hover:bg-orange-50 text-orange-800',
    },
    {
      id: 'sensor_offline',
      label: '6. Sensor Putus',
      description: 'Sensor kekeruhan outlet disimulasikan offline',
      icon: Radio,
      color: 'hover:border-slate-400 hover:bg-slate-100 text-slate-800',
    },
    {
      id: 'esp32_disconnect',
      label: '7. ESP32 Offline',
      description: 'Koneksi mikrokontroler utama terputus total',
      icon: WifiOff,
      color: 'hover:border-rose-400 hover:bg-rose-50 text-rose-800',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Skenario Pengujian Simulasi Frontend (Demo Scenarios)
            </h3>
            <p className="text-xs text-slate-500">
              Pilih skenario berikut untuk memicu perubahan data telemetri, alert notifikasi, dan respon status sistem:
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isActive = activeScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => applyScenario(sc.id)}
              className={`p-3 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : `bg-slate-50/80 border-slate-200 ${sc.color}`
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${isActive ? 'text-white' : ''}`}>
                  {sc.label}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <p
                className={`text-[10px] leading-tight line-clamp-2 ${
                  isActive ? 'text-blue-100' : 'text-slate-500'
                }`}
              >
                {sc.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
