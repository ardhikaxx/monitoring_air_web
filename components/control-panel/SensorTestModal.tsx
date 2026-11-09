'use client';

import React, { useState, useEffect } from 'react';
import { SensorReading, SensorTestFullResult } from '@/types/sensor';
import { useSystem } from '@/context/SystemContext';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Loader2,
  Cpu,
} from 'lucide-react';

interface SensorTestModalProps {
  sensor: SensorReading | null;
  onClose: () => void;
}

export default function SensorTestModal({ sensor, onClose }: SensorTestModalProps) {
  const { runSingleSensorTest } = useSystem();
  const [isRunning, setIsRunning] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [result, setResult] = useState<SensorTestFullResult | null>(null);

  useEffect(() => {
    if (!sensor) return;

    let isMounted = true;
    const runSimulation = async () => {
      for (let s = 0; s < 5; s++) {
        if (!isMounted) return;
        setActiveStepIndex(s);
        await new Promise((r) => setTimeout(r, 450));
      }

      if (isMounted) {
        const fullResult = await runSingleSensorTest(sensor.id);
        setResult(fullResult);
        setIsRunning(false);
      }
    };

    runSimulation();

    return () => {
      isMounted = false;
    };
  }, [sensor, runSingleSensorTest]);

  if (!sensor) return null;

  const testSteps = [
    { title: 'Inisialisasi Bus & Pin GPIO', desc: `Pemeriksaan antarmuka ${sensor.pin}` },
    { title: 'Transmisi Frame Ping Telemetri', desc: 'Verifikasi handshake mikrokontroler' },
    { title: 'Sampling Konversi ADC & Voltase', desc: 'Pengukuran nilai tegangan analog-digital' },
    { title: 'Validasi Nilai Ambang Batas', desc: 'Perbandingan terhadap rentang batas aman' },
    { title: 'Evaluasi Rasio Derau & Kalibrasi', desc: 'Pengujian stabilitas 5 sampel berurutan' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Diagnostik Sensor
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {sensor.name}
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

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-600">
              <span>Progres Pengujian Otomatis</span>
              <span className="font-mono text-blue-600">
                {isRunning ? `${(activeStepIndex + 1) * 20}%` : '100%'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: isRunning ? `${(activeStepIndex + 1) * 20}%` : '100%' }}
              />
            </div>
          </div>

          {/* Test steps list */}
          <div className="space-y-2.5 pt-1">
            {testSteps.map((step, idx) => {
              const isCurrent = isRunning && activeStepIndex === idx;
              const isPast = !isRunning || activeStepIndex > idx;
              const isFuture = isRunning && activeStepIndex < idx;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-300 text-blue-900 shadow-xs'
                      : isPast
                      ? 'bg-slate-50/70 border-slate-200 text-slate-800'
                      : 'bg-white border-slate-100 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5">
                      <span className="font-mono text-[11px] text-slate-400">0{idx + 1}.</span>
                      <span>{step.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-4">{step.desc}</div>
                  </div>

                  <div className="shrink-0 pl-2">
                    {isCurrent && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
                    {isPast && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {isFuture && <span className="w-4 h-4 rounded-full border border-slate-300 inline-block" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Outcome Box */}
          {result && (
            <div
              className={`p-4 rounded-2xl border transition-all animate-in fade-in-0 ${
                result.overallStatus === 'passed'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : result.overallStatus === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {result.overallStatus === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {result.overallStatus === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  {result.overallStatus === 'failed' && <AlertOctagon className="w-4 h-4 text-rose-600" />}
                  Hasil Diagnostik: {result.overallStatus.toUpperCase()}
                </span>
                <span className="text-sm font-bold font-mono">
                  {result.readValue} {result.unit}
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{result.diagnosticNotes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-xs"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
