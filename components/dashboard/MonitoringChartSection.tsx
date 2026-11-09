'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useSystem } from '@/context/SystemContext';
import {
  LineChart as ChartIcon,
  Layers,
  BarChart3,
} from 'lucide-react';

interface TelemetryPoint {
  timestamp: string;
  timeLabel: string;
  turbidity_inlet: number;
  turbidity_outlet: number;
  turbidity_reduction: number;
  ph_inlet: number;
  ph_outlet: number;
  temp_inlet: number;
  temp_outlet: number;
  flow_inlet: number;
  pressure_inlet: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TelemetryPoint;
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
  activeParameter?: 'turbidity' | 'ph' | 'temp' | 'flow';
}

const CustomTooltip = ({ active, payload, activeParameter = 'turbidity' }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as TelemetryPoint;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700/80 text-xs space-y-1.5 min-w-48">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
          <span>Waktu Sampling</span>
          <span className="font-bold text-slate-200">{data.timeLabel} WIB</span>
        </div>

        {activeParameter === 'turbidity' && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-amber-300">
              <span>Inlet (Baku):</span>
              <span className="font-mono font-bold">{data.turbidity_inlet} NTU</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400 font-bold">
              <span>Outlet (Hasil):</span>
              <span className="font-mono">{data.turbidity_outlet} NTU</span>
            </div>
            <div className="pt-1 border-t border-slate-800 flex justify-between items-center text-[10px] text-cyan-300">
              <span>Efisiensi:</span>
              <span className="font-mono font-bold">-{data.turbidity_reduction}%</span>
            </div>
          </div>
        )}

        {activeParameter === 'ph' && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-purple-300">
              <span>Inlet:</span>
              <span className="font-mono font-bold">{data.ph_inlet} pH</span>
            </div>
            <div className="flex justify-between items-center text-blue-400 font-bold">
              <span>Outlet:</span>
              <span className="font-mono">{data.ph_outlet} pH</span>
            </div>
          </div>
        )}

        {activeParameter === 'temp' && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-amber-300">
              <span>Inlet:</span>
              <span className="font-mono font-bold">{data.temp_inlet} °C</span>
            </div>
            <div className="flex justify-between items-center text-cyan-300 font-bold">
              <span>Outlet:</span>
              <span className="font-mono">{data.temp_outlet} °C</span>
            </div>
          </div>
        )}

        {activeParameter === 'flow' && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-blue-300">
              <span>Debit Pompa:</span>
              <span className="font-mono font-bold">{data.flow_inlet} L/jam</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Tekanan:</span>
              <span className="font-mono font-bold">{data.pressure_inlet} bar</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function MonitoringChartSection() {
  const { historicalRecords } = useSystem();
  const [activeParameter, setActiveParameter] = useState<'turbidity' | 'ph' | 'temp' | 'flow'>('turbidity');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('24h');

  // Convert raw historical telemetry logs into structured time-series data points
  const telemetryMap: Record<string, Partial<TelemetryPoint>> = {};

  historicalRecords.forEach((rec) => {
    if (!telemetryMap[rec.timestamp]) {
      telemetryMap[rec.timestamp] = {
        timestamp: rec.timestamp,
        timeLabel: rec.timestamp.split(' ')[1] || rec.timestamp,
      };
    }

    if (rec.sensorId === 'turbidity_inlet') telemetryMap[rec.timestamp].turbidity_inlet = rec.value;
    if (rec.sensorId === 'turbidity_outlet') telemetryMap[rec.timestamp].turbidity_outlet = rec.value;
    if (rec.sensorId === 'ph_inlet') telemetryMap[rec.timestamp].ph_inlet = rec.value;
    if (rec.sensorId === 'ph_outlet') telemetryMap[rec.timestamp].ph_outlet = rec.value;
    if (rec.sensorId === 'temp_inlet') telemetryMap[rec.timestamp].temp_inlet = rec.value;
    if (rec.sensorId === 'temp_outlet') telemetryMap[rec.timestamp].temp_outlet = rec.value;
    if (rec.sensorId === 'flow_inlet') {
      telemetryMap[rec.timestamp].flow_inlet = rec.value;
      telemetryMap[rec.timestamp].pressure_inlet = 1.82;
    }
  });

  // Calculate reduction metrics and format array
  const fullTimeSeries: TelemetryPoint[] = Object.values(telemetryMap)
    .reverse()
    .map((p) => {
      const turbIn = p.turbidity_inlet ?? 85.0;
      const turbOut = p.turbidity_outlet ?? 2.85;
      const reduction = Number((((turbIn - turbOut) / turbIn) * 100).toFixed(1));

      return {
        timestamp: p.timestamp || '',
        timeLabel: p.timeLabel || '',
        turbidity_inlet: turbIn,
        turbidity_outlet: turbOut,
        turbidity_reduction: reduction,
        ph_inlet: p.ph_inlet ?? 6.32,
        ph_outlet: p.ph_outlet ?? 7.08,
        temp_inlet: p.temp_inlet ?? 27.2,
        temp_outlet: p.temp_outlet ?? 27.8,
        flow_inlet: p.flow_inlet ?? 20.3,
        pressure_inlet: p.pressure_inlet ?? 1.82,
      };
    });

  // Filter by time range
  let displayData = fullTimeSeries;
  if (timeRange === '1h') displayData = fullTimeSeries.slice(-4);
  else if (timeRange === '6h') displayData = fullTimeSeries.slice(-8);
  else displayData = fullTimeSeries; // 24h

  // Compute Statistics
  const getStats = () => {
    let inletVals: number[] = [];
    let outletVals: number[] = [];

    if (activeParameter === 'turbidity') {
      inletVals = displayData.map((d) => d.turbidity_inlet);
      outletVals = displayData.map((d) => d.turbidity_outlet);
    } else if (activeParameter === 'ph') {
      inletVals = displayData.map((d) => d.ph_inlet);
      outletVals = displayData.map((d) => d.ph_outlet);
    } else if (activeParameter === 'temp') {
      inletVals = displayData.map((d) => d.temp_inlet);
      outletVals = displayData.map((d) => d.temp_outlet);
    } else {
      inletVals = displayData.map((d) => d.flow_inlet);
      outletVals = [];
    }

    const allVals = [...inletVals, ...outletVals];
    if (allVals.length === 0) return { min: 0, max: 0, avg: 0, latestIn: 0, latestOut: 0 };

    const min = Math.min(...allVals);
    const max = Math.max(...allVals);
    const avg = Number((allVals.reduce((a, b) => a + b, 0) / allVals.length).toFixed(activeParameter === 'ph' ? 2 : 1));
    const latestIn = inletVals[inletVals.length - 1] ?? 0;
    const latestOut = outletVals.length > 0 ? outletVals[outletVals.length - 1] : 0;

    return { min, max, avg, latestIn, latestOut };
  };

  const stats = getStats();

  return (
    <section id="charts" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <ChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Grafik Telemetri
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tren pembacaan data sensor dari waktu ke waktu.
            </p>
          </div>
        </div>

        {/* Action Controls: Chart Mode, Parameter, Time Range */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Type Toggle: Area vs Bar */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                chartType === 'area'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Area</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                chartType === 'bar'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bar</span>
            </button>
          </div>

          {/* Parameter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveParameter('turbidity')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeParameter === 'turbidity'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kekeruhan
            </button>
            <button
              onClick={() => setActiveParameter('ph')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeParameter === 'ph'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              pH
            </button>
            <button
              onClick={() => setActiveParameter('temp')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeParameter === 'temp'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Suhu
            </button>
            <button
              onClick={() => setActiveParameter('flow')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeParameter === 'flow'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Debit
            </button>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center gap-1 text-xs">
            {(['1h', '6h', '24h'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  timeRange === r
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {r === '1h' ? '1 Jam' : r === '6h' ? '6 Jam' : '24 Jam'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistical Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[10px] text-slate-400 font-medium uppercase">Terendah</div>
          <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">{stats.min}</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[10px] text-slate-400 font-medium uppercase">Rerata</div>
          <div className="text-lg font-bold text-blue-600 font-mono mt-0.5">{stats.avg}</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[10px] text-slate-400 font-medium uppercase">Tertinggi</div>
          <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">{stats.max}</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="text-[10px] text-slate-400 font-medium uppercase">
            {activeParameter === 'flow' ? 'Debit Terkini' : 'Outlet Terkini'}
          </div>
          <div className="text-lg font-bold text-emerald-600 font-mono mt-0.5">
            {activeParameter === 'flow' ? stats.latestIn : stats.latestOut}
          </div>
        </div>
      </div>

      {/* Main Recharts Canvas */}
      <div className="h-72 sm:h-80 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            /* AREA CHART WITH SOFT MINIMALIST TINT */
            <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientTurbIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradientTurbOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>

                <linearGradient id="gradientPhIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradientPhOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1677C8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1677C8" stopOpacity={0.0} />
                </linearGradient>

                <linearGradient id="gradientTempIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradientTempOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>

                <linearGradient id="gradientFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1677C8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1677C8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip activeParameter={activeParameter} />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {activeParameter === 'turbidity' && (
                <>
                  <ReferenceLine
                    y={5.0}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{ value: 'Baku Mutu 5 NTU', fill: '#ef4444', fontSize: 10, position: 'top' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="turbidity_inlet"
                    name="Inlet (Air Baku NTU)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientTurbIn)"
                  />
                  <Area
                    type="monotone"
                    dataKey="turbidity_outlet"
                    name="Outlet (Hasil Olahan NTU)"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientTurbOut)"
                  />
                </>
              )}

              {activeParameter === 'ph' && (
                <>
                  <ReferenceLine
                    y={6.5}
                    stroke="#94a3b8"
                    strokeDasharray="3 3"
                    label={{ value: 'Min 6.5', fill: '#94a3b8', fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={8.5}
                    stroke="#94a3b8"
                    strokeDasharray="3 3"
                    label={{ value: 'Maks 8.5', fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ph_inlet"
                    name="pH Inlet"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientPhIn)"
                  />
                  <Area
                    type="monotone"
                    dataKey="ph_outlet"
                    name="pH Outlet"
                    stroke="#1677C8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientPhOut)"
                  />
                </>
              )}

              {activeParameter === 'temp' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="temp_inlet"
                    name="Suhu Inlet (°C)"
                    stroke="#f97316"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientTempIn)"
                  />
                  <Area
                    type="monotone"
                    dataKey="temp_outlet"
                    name="Suhu Outlet (°C)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientTempOut)"
                  />
                </>
              )}

              {activeParameter === 'flow' && (
                <>
                  <ReferenceLine
                    y={20.0}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    label={{ value: 'Target 20 L/j', fill: '#10b981', fontSize: 10 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="flow_inlet"
                    name="Laju Alir (L/jam)"
                    stroke="#1677C8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientFlow)"
                  />
                </>
              )}
            </AreaChart>
          ) : (
            /* BAR COMPARATIVE CHART */
            <BarChart data={displayData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip activeParameter={activeParameter} />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {activeParameter === 'turbidity' && (
                <>
                  <Bar
                    dataKey="turbidity_inlet"
                    name="Inlet (NTU)"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="turbidity_outlet"
                    name="Outlet (NTU)"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                </>
              )}

              {activeParameter === 'ph' && (
                <>
                  <Bar
                    dataKey="ph_inlet"
                    name="pH Inlet"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="ph_outlet"
                    name="pH Outlet"
                    fill="#1677C8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                </>
              )}

              {activeParameter === 'temp' && (
                <>
                  <Bar
                    dataKey="temp_inlet"
                    name="Suhu Inlet (°C)"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="temp_outlet"
                    name="Suhu Outlet (°C)"
                    fill="#06b6d4"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                </>
              )}

              {activeParameter === 'flow' && (
                <Bar
                  dataKey="flow_inlet"
                  name="Debit (L/jam)"
                  fill="#1677C8"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
