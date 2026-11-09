'use client';

import React from 'react';
import { SensorReading } from '@/types/sensor';
import { useSystem } from '@/context/SystemContext';
import SensorGauge from './SensorGauge';
import {
  X,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
} from 'lucide-react';
import { showSensorCheckResult } from '@/lib/alerts';

interface SensorDetailModalProps {
  sensor: SensorReading | null;
  onClose: () => void;
  onRunTest?: (sensorId: SensorReading['id']) => void;
}

export default function SensorDetailModal({ sensor, onClose, onRunTest }: SensorDetailModalProps) {
  const { runSensorCheck, thresholds } = useSystem();

  if (!sensor) return null;

  const handleCheck = async () => {
    const res = await runSensorCheck(sensor.id);
    showSensorCheckResult(res);
  };

  // Determine gauge config based on sensor type
  let gaugeMin = 0;
  let gaugeMax = 100;
  let targetRange: { min: number; max: number } | undefined;

  if (sensor.id === 'turbidity_inlet') {
    gaugeMin = 0;
    gaugeMax = 200;
    targetRange = { min: 0, max: thresholds.turbidity_inlet.warningThreshold };
  } else if (sensor.id === 'turbidity_outlet') {
    gaugeMin = 0;
    gaugeMax = 10;
    targetRange = { min: 0, max: thresholds.turbidity_outlet.warningThreshold };
  } else if (sensor.id === 'ph_inlet') {
    gaugeMin = 0;
    gaugeMax = 14;
    targetRange = { min: thresholds.ph_inlet.min, max: thresholds.ph_inlet.max };
  } else if (sensor.id === 'ph_outlet') {
    gaugeMin = 0;
    gaugeMax = 14;
    targetRange = { min: thresholds.ph_outlet.min, max: thresholds.ph_outlet.max };
  } else if (sensor.id === 'flow_inlet') {
    gaugeMin = 0;
    gaugeMax = 40;
    targetRange = { min: thresholds.flow_inlet.minFlow, max: thresholds.flow_inlet.maxFlow };
  } else {
    // Temperature
    gaugeMin = 0;
    gaugeMax = 50;
    targetRange = { min: 20, max: 35 };
  }

  const getStatusBadge = () => {
    switch (sensor.status) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            Kritis
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Peringatan
          </span>
        );
      case 'offline':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-200 text-slate-800 flex items-center gap-1">
            Offline
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Normal / Optimal
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                {sensor.location === 'inlet' ? 'Stasiun Inlet' : 'Stasiun Outlet'}
              </span>
              <span className="text-xs text-slate-400 font-mono">{sensor.id}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{sensor.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Top Info Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs text-slate-500 font-medium">Pembacaan Telemetri Terkini</div>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                <span className="text-3xl font-black text-slate-900 font-mono">{sensor.value}</span>
                <span className="text-base font-bold text-slate-600">{sensor.unit}</span>
                {sensor.secondaryValue !== undefined && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
                    {sensor.secondaryValue} {sensor.secondaryUnit}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 justify-center sm:justify-start">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Terakhir diperbarui: {sensor.lastUpdated}</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <SensorGauge
                value={sensor.value}
                min={gaugeMin}
                max={gaugeMax}
                unit={sensor.unit}
                targetRange={targetRange}
                color={sensor.status === 'critical' ? '#EF4444' : sensor.status === 'warning' ? '#F59E0B' : '#1677C8'}
              />
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
          </div>

          {/* 24-Hour Statistical Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Min (24 Jam)</div>
              <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                {sensor.min24h} <span className="text-xs font-normal text-slate-500">{sensor.unit}</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Rata-rata</div>
              <div className="text-base font-bold text-blue-600 font-mono mt-0.5">
                {sensor.avg24h} <span className="text-xs font-normal text-slate-500">{sensor.unit}</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Maks (24 Jam)</div>
              <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                {sensor.max24h} <span className="text-xs font-normal text-slate-500">{sensor.unit}</span>
              </div>
            </div>
          </div>

          {/* Hardware & Calibration Specs */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Cpu className="w-4 h-4 text-blue-600" />
              Spesifikasi Hardware &amp; Antarmuka Mikrokontroler
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400">Model Sensor:</span>{' '}
                <span className="font-semibold text-slate-800 font-mono">{sensor.hardwareModel}</span>
              </div>
              <div>
                <span className="text-slate-400">Pin ESP32:</span>{' '}
                <span className="font-semibold text-blue-600 font-mono">{sensor.pin}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400">Fungsi Utama:</span> {sensor.description}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={handleCheck}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-xs"
          >
            Pindai Sinyal (Check Sensor)
          </button>

          <div className="flex items-center gap-2">
            {onRunTest && (
              <button
                onClick={() => {
                  onClose();
                  onRunTest(sensor.id);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
              >
                Jalankan Pengujian (Test)
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
