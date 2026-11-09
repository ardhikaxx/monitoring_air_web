'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ThresholdForm from '@/components/settings/ThresholdForm';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5 text-blue-600" />
            <span>Konfigurasi Parameter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pengaturan Sistem &amp; Ambang Batas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Atur parameter operasional batas toleransi sensor, kapasitas laju alir sistem, dan interval polling data telemetri. Pengaturan tersimpan secara persisten pada browser lokal.
          </p>
        </div>
      </div>

      {/* Threshold Configuration Form */}
      <ThresholdForm />
    </AppLayout>
  );
}
