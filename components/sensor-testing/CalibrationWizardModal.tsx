'use client';

import React, { useState } from 'react';
import { CalibrationItem, SensorReading } from '@/types/sensor';
import { useSystem } from '@/context/SystemContext';
import {
  X,
  FlaskConical,
  CheckCircle2,
  Loader2,
  Info,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { showToast } from '@/lib/alerts';

interface CalibrationWizardModalProps {
  item: CalibrationItem | null;
  sensor?: SensorReading;
  onClose: () => void;
}

export default function CalibrationWizardModal({
  item,
  sensor,
  onClose,
}: CalibrationWizardModalProps) {
  const { calibrateSensor } = useSystem();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chosenRefValue, setChosenRefValue] = useState<number>(() => {
    if (item?.sensorId.includes('ph')) return 7.0;
    if (item?.sensorId.includes('turbidity')) return item?.location === 'inlet' ? 85.0 : 2.5;
    if (item?.sensorId.includes('flow')) return 20.0;
    return 27.0;
  });

  if (!item) return null;

  const currentReading = sensor?.value ?? item.measuredAfter;
  const calculatedOffset = Number((chosenRefValue - currentReading).toFixed(item.sensorId.includes('ph') ? 2 : 1));

  const handleStartStabilization = async () => {
    setStep(2);
    setIsProcessing(true);
    // Simulated immersion stabilization 1.2s
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);
    setStep(3);
  };

  const handleApplyCalibration = async () => {
    setIsProcessing(true);
    await calibrateSensor(item.sensorId, calculatedOffset, chosenRefValue);
    setIsProcessing(false);
    setStep(4);
    showToast(`Kalibrasi ${item.sensorName} berhasil diterapkan!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Simulasi Kalibrasi Sensor
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {item.sensorName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Navigation Bar */}
        <div className="px-5 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
          <span className={step >= 1 ? 'text-blue-600' : 'text-slate-400'}>1. Larutan Standar</span>
          <span className="text-slate-300">&rarr;</span>
          <span className={step >= 2 ? 'text-blue-600' : 'text-slate-400'}>2. Stabilisasi</span>
          <span className="text-slate-300">&rarr;</span>
          <span className={step >= 3 ? 'text-blue-600' : 'text-slate-400'}>3. Hitung Offset</span>
          <span className="text-slate-300">&rarr;</span>
          <span className={step === 4 ? 'text-emerald-600' : 'text-slate-400'}>4. Selesai</span>
        </div>

        {/* Wizard Step Body */}
        <div className="p-5 space-y-4">
          {/* STEP 1: Select Reference Standard */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-blue-900">Standar Referensi Terpilih:</div>
                <div>{item.referenceStandard}</div>
                <div className="text-[11px] text-slate-500 font-mono">Toleransi pabrik: {item.tolerance}</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Nilai Target Referensi Standar:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step={item.sensorId.includes('ph') ? '0.01' : '0.1'}
                    value={chosenRefValue}
                    onChange={(e) => setChosenRefValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-bold font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                    {sensor?.unit}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Masukkan nilai nominal larutan penyangga buffer atau nilai standar kalibrasi.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
                <span className="text-slate-500">Nilai Pembacaan Saat Ini:</span>
                <span className="font-bold font-mono text-slate-800">
                  {currentReading} {sensor?.unit}
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Stabilization */}
          {step === 2 && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">
                  Stabilisasi Probe Sensor Sedang Berlangsung...
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Menunggu kesetimbangan elektro-kimia / tegangan analog selama 50 sampling berturut-turut pada larutan kalibrasi.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Review Offset Calculation */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nilai Mentah Sebelum Kalibrasi:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {currentReading} {sensor?.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nilai Referensi Standar:</span>
                  <span className="font-mono font-bold text-blue-600">
                    {chosenRefValue} {sensor?.unit}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Kompensasi Offset ADC:</span>
                  <span
                    className={`font-mono font-black text-sm ${
                      calculatedOffset >= 0 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {calculatedOffset >= 0 ? `+${calculatedOffset}` : calculatedOffset}{' '}
                    {sensor?.unit}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Offset kalibrasi berada dalam batas toleransi pabrik ({item.tolerance}).</span>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Verified */}
          {step === 4 && (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  Simulasi Kalibrasi Berhasil Diterapkan!
                </h4>
                <p className="text-xs text-slate-500">
                  Offset baru telah disinkronkan ke pembacaan frontend. Sensor siap memberikan pengukuran presisi.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono inline-block text-slate-700">
                Nilai Baru: <strong>{chosenRefValue} {sensor?.unit}</strong> (Offset {calculatedOffset})
              </div>
            </div>
          )}

          {/* Simulation Disclaimer */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-tight flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <span>
              <strong>Pemberitahuan:</strong> Seluruh fitur kalibrasi hanya berupa simulasi frontend dan tidak mengubah firmware ESP32 fisik secara langsung.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            {step === 4 ? 'Tutup' : 'Batalkan'}
          </button>

          {step === 1 && (
            <button
              onClick={handleStartStabilization}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Lanjut Stabilisasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleApplyCalibration}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan &amp; Terapkan Kalibrasi</span>
            </button>
          )}

          {step === 4 && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
