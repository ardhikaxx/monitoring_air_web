'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts';
import { HistoricalRecord } from '@/types/sensor';
import { Calendar } from 'lucide-react';

interface HistoryTelemetryChartProps {
  records: HistoricalRecord[];
}

interface ChartPoint {
  timestamp: string;
  fullTimestamp: string;
  turbidity_inlet?: number;
  turbidity_outlet?: number;
  ph_inlet?: number;
  ph_outlet?: number;
  temp_inlet?: number;
  temp_outlet?: number;
  flow_inlet?: number;
}

export default function HistoryTelemetryChart({ records }: HistoryTelemetryChartProps) {
  const [activeParameter, setActiveParameter] = useState<'turbidity' | 'ph' | 'temp' | 'flow'>('turbidity');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '12h' | '24h' | '7d' | '30d'>('24h');

  // Filter records based on time range and prepare unified chart data
  const timestampsMap: Record<string, ChartPoint> = {};

  records.forEach((rec) => {
    if (!timestampsMap[rec.timestamp]) {
      timestampsMap[rec.timestamp] = {
        timestamp: rec.timestamp.split(' ')[1] || rec.timestamp,
        fullTimestamp: rec.timestamp,
      };
    }

    if (rec.sensorId === 'turbidity_inlet') timestampsMap[rec.timestamp].turbidity_inlet = rec.value;
    if (rec.sensorId === 'turbidity_outlet') timestampsMap[rec.timestamp].turbidity_outlet = rec.value;
    if (rec.sensorId === 'ph_inlet') timestampsMap[rec.timestamp].ph_inlet = rec.value;
    if (rec.sensorId === 'ph_outlet') timestampsMap[rec.timestamp].ph_outlet = rec.value;
    if (rec.sensorId === 'temp_inlet') timestampsMap[rec.timestamp].temp_inlet = rec.value;
    if (rec.sensorId === 'temp_outlet') timestampsMap[rec.timestamp].temp_outlet = rec.value;
    if (rec.sensorId === 'flow_inlet') timestampsMap[rec.timestamp].flow_inlet = rec.value;
  });

  const chartData = Object.values(timestampsMap).reverse();

  let displayData = chartData;
  if (timeRange === '1h') displayData = chartData.slice(-3);
  else if (timeRange === '6h') displayData = chartData.slice(-7);
  else if (timeRange === '12h') displayData = chartData.slice(-13);
  else displayData = chartData;

  const getStats = () => {
    let inletVals: number[] = [];
    let outletVals: number[] = [];

    if (activeParameter === 'turbidity') {
      inletVals = displayData.map((d) => d.turbidity_inlet).filter((v): v is number => v !== undefined);
      outletVals = displayData.map((d) => d.turbidity_outlet).filter((v): v is number => v !== undefined);
    } else if (activeParameter === 'ph') {
      inletVals = displayData.map((d) => d.ph_inlet).filter((v): v is number => v !== undefined);
      outletVals = displayData.map((d) => d.ph_outlet).filter((v): v is number => v !== undefined);
    } else if (activeParameter === 'temp') {
      inletVals = displayData.map((d) => d.temp_inlet).filter((v): v is number => v !== undefined);
      outletVals = displayData.map((d) => d.temp_outlet).filter((v): v is number => v !== undefined);
    } else {
      inletVals = displayData.map((d) => d.flow_inlet).filter((v): v is number => v !== undefined);
      outletVals = [];
    }

    const allVals = [...inletVals, ...outletVals];
    if (allVals.length === 0) return { min: 0, max: 0, avg: 0 };

    const min = Math.min(...allVals);
    const max = Math.max(...allVals);
    const avg = Number((allVals.reduce((a, b) => a + b, 0) / allVals.length).toFixed(activeParameter === 'ph' ? 2 : 1));

    return { min, max, avg };
  };

  const stats = getStats();

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
      {/* Chart Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        {/* Parameter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveParameter('turbidity')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeParameter === 'turbidity'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kekeruhan (NTU)
          </button>
          <button
            onClick={() => setActiveParameter('ph')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeParameter === 'ph'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Derajat Keasaman (pH)
          </button>
          <button
            onClick={() => setActiveParameter('temp')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeParameter === 'temp'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Suhu (°C)
          </button>
          <button
            onClick={() => setActiveParameter('flow')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeParameter === 'flow'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Debit Air (L/jam)
          </button>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold text-slate-500">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Rentang:
          </span>
          {(['1h', '6h', '12h', '24h', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                timeRange === r
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {r === '1h'
                ? '1 Jam'
                : r === '6h'
                ? '6 Jam'
                : r === '12h'
                ? '12 Jam'
                : r === '24h'
                ? '24 Jam'
                : r === '7d'
                ? '7 Hari'
                : '30 Hari'}
            </button>
          ))}
        </div>
      </div>

      {/* Statistical Summary Callouts */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Nilai Terendah (Min)</div>
          <div className="text-lg font-extrabold text-slate-800 font-mono mt-0.5">{stats.min}</div>
        </div>
        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
          <div className="text-[10px] text-blue-600 font-semibold uppercase">Rata-Rata Periode</div>
          <div className="text-lg font-extrabold text-blue-700 font-mono mt-0.5">{stats.avg}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Nilai Tertinggi (Maks)</div>
          <div className="text-lg font-extrabold text-slate-800 font-mono mt-0.5">{stats.max}</div>
        </div>
      </div>

      {/* Main Interactive Recharts Graph */}
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeParameter === 'turbidity' ? (
            <AreaChart data={displayData}>
              <defs>
                <linearGradient id="colorTurbIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTurbOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <ReferenceLine y={5.0} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Baku Mutu 5 NTU', fill: '#ef4444', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="turbidity_inlet"
                name="Kekeruhan Inlet (Air Baku NTU)"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTurbIn)"
              />
              <Area
                type="monotone"
                dataKey="turbidity_outlet"
                name="Kekeruhan Outlet (Hasil Filter NTU)"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorTurbOut)"
              />
            </AreaChart>
          ) : activeParameter === 'ph' ? (
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[5, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <ReferenceLine y={6.5} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Batas Min 6.5', fill: '#94a3b8', fontSize: 10 }} />
              <ReferenceLine y={8.5} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Batas Maks 8.5', fill: '#94a3b8', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="ph_inlet"
                name="pH Inlet (Air Mentah)"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="ph_outlet"
                name="pH Outlet (Air Hasil)"
                stroke="#1677C8"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          ) : activeParameter === 'temp' ? (
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[20, 35]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="temp_inlet"
                name="Suhu Inlet (°C)"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="temp_outlet"
                name="Suhu Outlet (°C)"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          ) : (
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[10, 30]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <ReferenceLine y={20.0} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Kapasitas Nominal 20 L/jam', fill: '#10b981', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="flow_inlet"
                name="Laju Alir Masuk (L/jam)"
                stroke="#1677C8"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
