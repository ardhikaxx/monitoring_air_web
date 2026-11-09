'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import HistoryTelemetryChart from '@/components/history/HistoryTelemetryChart';
import HistoryTable from '@/components/history/HistoryTable';
import { useSystem } from '@/context/SystemContext';
import { LineChart } from 'lucide-react';

export default function HistoryPage() {
  const { historicalRecords } = useSystem();

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <LineChart className="w-3.5 h-3.5 text-blue-600" />
            <span>Analisis Historis &amp; Big Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Grafik dan Histori Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Eksplorasi visualisasi data multi-parameter sensor kekeruhan, pH, temperatur, dan laju alir air. Analisis tren jangka pendek maupun jangka panjang.
          </p>
        </div>
      </div>

      {/* Main Interactive Charts Component */}
      <HistoryTelemetryChart records={historicalRecords} />

      {/* Historical Data Table with Search & Export */}
      <HistoryTable records={historicalRecords} />
    </AppLayout>
  );
}
