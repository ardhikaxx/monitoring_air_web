'use client';

import React, { useState, useEffect } from 'react';
import { useSystem } from '@/context/SystemContext';
import { SensorTestFullResult } from '@/types/sensor';
import {
  X,
  Loader2,
  Layers,
} from 'lucide-react';
import { showTestAllReport } from '@/lib/alerts';

interface TestAllModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TestAllModal({ isOpen, onClose }: TestAllModalProps) {
  const { runTestAllSensors, sensors } = useSystem();
  const [isRunning, setIsRunning] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentSensorName, setCurrentSensorName] = useState('');
  const [results, setResults] = useState<SensorTestFullResult[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const execute = async () => {
      const fullResults = await runTestAllSensors((curr) => {
        if (!isMounted) return;
        setCurrentProgress(curr);
        setCurrentSensorName(sensors[curr - 1]?.name || '');
      });

      if (isMounted) {
        setResults(fullResults);
        setIsRunning(false);
      }
    };

    execute();

    return () => {
      isMounted = false;
    };
  }, [isOpen, runTestAllSensors, sensors]);

  if (!isOpen) return null;

  const passedCount = results.filter((r) => r.overallStatus === 'passed').length;
  const warningCount = results.filter((r) => r.overallStatus === 'warning').length;
  const failedCount = results.filter((r) => r.overallStatus === 'failed').length;

  const handleOpenReport = () => {
    onClose();
    showTestAllReport(results);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Pemeriksaan Komprehensif
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Pengujian Seluruh 7 Sensor IoT
              </h3>
            </div>
          </div>
          {!isRunning && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Progress Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                {isRunning && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />}
                <span>
                  {isRunning
                    ? `Menguji: ${currentSensorName}`
                    : 'Pengujian Selesai'}
                </span>
              </span>
              <span className="font-mono text-blue-600 font-bold">
                {currentProgress} / {sensors.length} Sensor
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(currentProgress / sensors.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-[11px] font-semibold text-emerald-700">Lolos (Passed)</div>
              <div className="text-xl font-bold text-emerald-800 font-mono mt-0.5">{passedCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-[11px] font-semibold text-amber-700">Peringatan</div>
              <div className="text-xl font-bold text-amber-800 font-mono mt-0.5">{warningCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-[11px] font-semibold text-rose-700">Gagal / Kritis</div>
              <div className="text-xl font-bold text-rose-800 font-mono mt-0.5">{failedCount}</div>
            </div>
          </div>

          {/* Real-time Checklist of Results */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl p-1 bg-slate-50/50">
            {sensors.map((s, idx) => {
              const res = results.find((r) => r.sensorId === s.id);
              const isBeingTested = isRunning && currentProgress === idx + 1;

              return (
                <div
                  key={s.id}
                  className="p-2.5 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">0{idx + 1}.</span>
                    <div>
                      <div className="font-bold text-slate-800 leading-tight">{s.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                        {s.location}
                      </div>
                    </div>
                  </div>

                  <div>
                    {res ? (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          res.overallStatus === 'passed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.overallStatus === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {res.overallStatus.toUpperCase()} ({res.readValue} {res.unit})
                      </span>
                    ) : isBeingTested ? (
                      <span className="text-blue-600 font-semibold flex items-center gap-1 text-[11px]">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Scanning...
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Menunggu...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {isRunning ? 'Sedang mengevaluasi telemetri...' : 'Diagnostik selesai.'}
          </span>
          <div className="flex items-center gap-2">
            {!isRunning && (
              <button
                onClick={handleOpenReport}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
              >
                Lihat Laporan Lengkap
              </button>
            )}
            <button
              onClick={onClose}
              disabled={isRunning}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
