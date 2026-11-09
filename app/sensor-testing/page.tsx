'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CalibrationWizardModal from '@/components/sensor-testing/CalibrationWizardModal';
import SensorTestModal from '@/components/control-panel/SensorTestModal';
import { useSystem } from '@/context/SystemContext';
import { CalibrationItem, SensorReading } from '@/types/sensor';
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  Wrench,
  Info,
  Play,
  FileText,
} from 'lucide-react';
import { showSensorCheckResult } from '@/lib/alerts';

export default function SensorTestingPage() {
  const { calibrations, sensors, runSensorCheck } = useSystem();
  const [filterTab, setFilterTab] = useState<'all' | 'inlet' | 'outlet'>('all');
  const [selectedCalibrationItem, setSelectedCalibrationItem] = useState<CalibrationItem | null>(null);
  const [selectedSensorForTest, setSelectedSensorForTest] = useState<SensorReading | null>(null);

  const filteredItems = calibrations.filter((item) => {
    if (filterTab === 'inlet') return item.location === 'inlet';
    if (filterTab === 'outlet') return item.location === 'outlet';
    return true;
  });

  const handleViewLog = async (item: CalibrationItem) => {
    const s = sensors.find((x) => x.id === item.sensorId);
    if (s) {
      const res = await runSensorCheck(s.id);
      showSensorCheckResult(res);
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
            <span>Laboratorium &amp; Kalibrasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pengujian &amp; Simulasi Kalibrasi Sensor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Pusat verifikasi berkala sensor air baku dan air hasil. Lakukan prosedur uji kestabilan dan simulasi kompensasi offset kalibrasi analog.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              filterTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua (7)
          </button>
          <button
            onClick={() => setFilterTab('inlet')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              filterTab === 'inlet'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inlet (4)
          </button>
          <button
            onClick={() => setFilterTab('outlet')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              filterTab === 'outlet'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Outlet (3)
          </button>
        </div>
      </div>

      {/* Sensor Calibration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const matchedSensor = sensors.find((s) => s.id === item.sensorId);
          return (
            <div
              key={item.sensorId}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {item.location === 'inlet' ? 'Stasiun Inlet' : 'Stasiun Outlet'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {item.sensorName}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Terkalibrasi
                  </span>
                </div>

                {/* Hardware & Location */}
                <div className="space-y-1 text-xs text-slate-600 my-2 py-2 border-y border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Model Sensor:</span>
                    <span className="font-mono font-semibold text-slate-800">{item.hardwareModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Titik Pemasangan:</span>
                    <span className="text-slate-700 text-right truncate max-w-[200px]">{item.physicalLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pin Mikrokontroler:</span>
                    <span className="font-mono text-blue-600 font-semibold">{item.pin}</span>
                  </div>
                </div>

                {/* Values Comparison & Standard */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-500">Nilai Saat Ini:</span>
                    <span className="text-lg font-black text-slate-900 font-mono">
                      {matchedSensor?.value ?? item.measuredAfter}{' '}
                      <span className="text-xs font-normal text-slate-500">{matchedSensor?.unit}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Standar Referensi:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[190px]">{item.referenceStandard}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Toleransi / Offset:</span>
                    <span className="font-mono text-emerald-700 font-semibold">
                      {item.tolerance} (Offset: {item.offset > 0 ? `+${item.offset}` : item.offset})
                    </span>
                  </div>
                </div>

                {/* Last Calibration Date */}
                <div className="text-[11px] text-slate-400 pt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Terakhir: {item.lastCalibrated}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-slate-100">
                {/* Mulai Pengujian */}
                <button
                  onClick={() => matchedSensor && setSelectedSensorForTest(matchedSensor)}
                  className="py-2 px-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all text-center flex items-center justify-center gap-1 active:scale-95"
                >
                  <Play className="w-3 h-3" />
                  <span>Uji Sensor</span>
                </button>

                {/* Simulasi Kalibrasi */}
                <button
                  onClick={() => setSelectedCalibrationItem(item)}
                  className="py-2 px-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-xs active:scale-95"
                >
                  <Wrench className="w-3 h-3" />
                  <span>Kalibrasi</span>
                </button>

                {/* Lihat Hasil / Log */}
                <button
                  onClick={() => handleViewLog(item)}
                  className="py-2 px-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-center flex items-center justify-center gap-1 active:scale-95"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>Log Uji</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calibration Wizard Modal */}
      <CalibrationWizardModal
        item={selectedCalibrationItem}
        sensor={sensors.find((s) => s.id === selectedCalibrationItem?.sensorId)}
        onClose={() => setSelectedCalibrationItem(null)}
      />

      {/* Sensor Test Modal */}
      <SensorTestModal
        sensor={selectedSensorForTest}
        onClose={() => setSelectedSensorForTest(null)}
      />

      {/* Disclaimer Card */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Catatan Simulasi Kalibrasi:</strong> Seluruh fitur pengujian dan simulasi kalibrasi pada website ini berjalan pada antarmuka frontend untuk keperluan demonstrasi operasional IoT. Perubahan nilai offset disimulasikan secara real-time pada memori aplikasi dan tidak memprogram ulang memori flash non-volatile ESP32 fisik secara langsung.
        </div>
      </div>
    </AppLayout>
  );
}
