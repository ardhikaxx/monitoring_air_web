'use client';

import React, { useState } from 'react';
import { useSystem } from '@/context/SystemContext';
import { ThresholdConfig, SystemGeneralConfig } from '@/types/sensor';
import {
  Save,
  RotateCcw,
  Sliders,
  Cpu,
  Droplet,
  Compass,
  Thermometer,
  Gauge,
} from 'lucide-react';
import { showConfirm, showSuccess } from '@/lib/alerts';

export default function ThresholdForm() {
  const {
    thresholds,
    generalConfig,
    updateThresholds,
    updateGeneralConfig,
    resetToDefaults,
  } = useSystem();

  const [formThresholds, setFormThresholds] = useState<ThresholdConfig>(thresholds);
  const [formGeneral, setFormGeneral] = useState<SystemGeneralConfig>(generalConfig);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds(formThresholds);
    updateGeneralConfig(formGeneral);
    showSuccess(
      'Konfigurasi Disimpan!',
      'Pengaturan ambang batas sensor dan parameter umum sistem berhasil diperbarui dan disimpan ke penyimpanan lokal.'
    );
  };

  const handleResetDefaults = async () => {
    const confirmed = await showConfirm(
      'Kembalikan ke Pengaturan Default?',
      'Seluruh ambang batas sensor dan parameter sistem akan direset ke konfigurasi standar pabrik.',
      'Ya, Reset Default',
      'Batal'
    );
    if (confirmed) {
      resetToDefaults();
      // refresh local state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      {/* SECTION 1: GENERAL SYSTEM CONFIGURATION */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Informasi Umum &amp; Parameter Perangkat IoT
            </h3>
            <p className="text-xs text-slate-500">
              Identitas unit controller ESP32, frekuensi sinkronisasi telemetri, dan kapasitas kerja
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* System Name */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-bold text-slate-700">Nama Sistem Monitoring:</label>
            <input
              type="text"
              value={formGeneral.systemName}
              onChange={(e) => setFormGeneral({ ...formGeneral, systemName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Device Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nama Perangkat ESP32:</label>
            <input
              type="text"
              value={formGeneral.deviceName}
              onChange={(e) => setFormGeneral({ ...formGeneral, deviceName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Update Interval */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Interval Telemetri (detik):</label>
            <input
              type="number"
              min={1}
              max={60}
              value={formGeneral.updateIntervalSec}
              onChange={(e) =>
                setFormGeneral({ ...formGeneral, updateIntervalSec: parseInt(e.target.value) || 3 })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* System Capacity */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Kapasitas Sistem (L/jam):</label>
            <input
              type="number"
              value={formGeneral.capacityLph}
              onChange={(e) =>
                setFormGeneral({ ...formGeneral, capacityLph: parseInt(e.target.value) || 20 })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Location Tag */}
          <div className="space-y-1.5 sm:col-span-3">
            <label className="font-bold text-slate-700">Lokasi / Stasiun Fisik Unit:</label>
            <input
              type="text"
              value={formGeneral.locationTag}
              onChange={(e) => setFormGeneral({ ...formGeneral, locationTag: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: SENSOR THRESHOLD CONFIGURATIONS */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Konfigurasi Ambang Batas Sensor (Thresholds)
            </h3>
            <p className="text-xs text-slate-500">
              Menentukan batas nilai Normal, Warning, dan Kritis untuk memicu alert dan indikator LED
            </p>
          </div>
        </div>

        {/* Sensor Thresholds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Kekeruhan Inlet */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Droplet className="w-4 h-4 text-amber-500" />
              <span>Sensor Kekeruhan Inlet (NTU)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Ambang Warning (&gt; NTU):</label>
                <input
                  type="number"
                  value={formThresholds.turbidity_inlet.warningThreshold}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      turbidity_inlet: {
                        ...formThresholds.turbidity_inlet,
                        warningThreshold: parseFloat(e.target.value) || 100,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Ambang Kritis (&gt; NTU):</label>
                <input
                  type="number"
                  value={formThresholds.turbidity_inlet.criticalThreshold}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      turbidity_inlet: {
                        ...formThresholds.turbidity_inlet,
                        criticalThreshold: parseFloat(e.target.value) || 150,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* 2. Kekeruhan Outlet */}
          <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Droplet className="w-4 h-4 text-emerald-600" />
              <span>Sensor Kekeruhan Outlet (Hasil Olahan NTU)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Batas Warning (&gt; NTU):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formThresholds.turbidity_outlet.warningThreshold}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      turbidity_outlet: {
                        ...formThresholds.turbidity_outlet,
                        warningThreshold: parseFloat(e.target.value) || 4.0,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Batas Mutu Maks (&gt; NTU):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formThresholds.turbidity_outlet.criticalThreshold}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      turbidity_outlet: {
                        ...formThresholds.turbidity_outlet,
                        criticalThreshold: parseFloat(e.target.value) || 5.0,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* 3. pH Inlet */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Compass className="w-4 h-4 text-purple-500" />
              <span>Sensor pH Inlet (Air Mentah)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">pH Minimum Normal:</label>
                <input
                  type="number"
                  step="0.1"
                  value={formThresholds.ph_inlet.min}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      ph_inlet: {
                        ...formThresholds.ph_inlet,
                        min: parseFloat(e.target.value) || 6.0,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">pH Maksimum Normal:</label>
                <input
                  type="number"
                  step="0.1"
                  value={formThresholds.ph_inlet.max}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      ph_inlet: {
                        ...formThresholds.ph_inlet,
                        max: parseFloat(e.target.value) || 8.5,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* 4. pH Outlet */}
          <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Sensor pH Outlet (Baku Mutu Air Bersih)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Batas Min Permenkes:</label>
                <input
                  type="number"
                  step="0.1"
                  value={formThresholds.ph_outlet.min}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      ph_outlet: {
                        ...formThresholds.ph_outlet,
                        min: parseFloat(e.target.value) || 6.5,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Batas Maks Permenkes:</label>
                <input
                  type="number"
                  step="0.1"
                  value={formThresholds.ph_outlet.max}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      ph_outlet: {
                        ...formThresholds.ph_outlet,
                        max: parseFloat(e.target.value) || 8.5,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* 5. Flow Sensor & Tekanan */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Gauge className="w-4 h-4 text-blue-600" />
              <span>Flow Sensor &amp; Tekanan Pipa Inlet</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Debit Min (L/jam):</label>
                <input
                  type="number"
                  value={formThresholds.flow_inlet.minFlow}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      flow_inlet: {
                        ...formThresholds.flow_inlet,
                        minFlow: parseFloat(e.target.value) || 15,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Debit Maks (L/jam):</label>
                <input
                  type="number"
                  value={formThresholds.flow_inlet.maxFlow}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      flow_inlet: {
                        ...formThresholds.flow_inlet,
                        maxFlow: parseFloat(e.target.value) || 25,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Tekanan Min (bar):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formThresholds.flow_inlet.minPressure}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      flow_inlet: {
                        ...formThresholds.flow_inlet,
                        minPressure: parseFloat(e.target.value) || 1.0,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Tekanan Maks (bar):</label>
                <input
                  type="number"
                  step="0.1"
                  value={formThresholds.flow_inlet.maxPressure}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      flow_inlet: {
                        ...formThresholds.flow_inlet,
                        maxPressure: parseFloat(e.target.value) || 2.5,
                      },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* 6. Suhu Inlet & Outlet */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span>Sensor Suhu Operasional (°C)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Suhu Min Operasional (°C):</label>
                <input
                  type="number"
                  value={formThresholds.temp_inlet.min}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      temp_inlet: { ...formThresholds.temp_inlet, min: parseFloat(e.target.value) || 20 },
                      temp_outlet: { ...formThresholds.temp_outlet, min: parseFloat(e.target.value) || 20 },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Suhu Maks Operasional (°C):</label>
                <input
                  type="number"
                  value={formThresholds.temp_inlet.max}
                  onChange={(e) =>
                    setFormThresholds({
                      ...formThresholds,
                      temp_inlet: { ...formThresholds.temp_inlet, max: parseFloat(e.target.value) || 35 },
                      temp_outlet: { ...formThresholds.temp_outlet, max: parseFloat(e.target.value) || 35 },
                    })
                  }
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Submit Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold transition-all"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Kembalikan Pengaturan Default</span>
        </button>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Konfigurasi</span>
        </button>
      </div>
    </form>
  );
}
