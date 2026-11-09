'use client';

import React from 'react';
import Link from 'next/link';
import { useSystem } from '@/context/SystemContext';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  ChevronRight,
  History,
} from 'lucide-react';

export default function RecentActivityFeed() {
  const { activities } = useSystem();

  const getBadge = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />,
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'Kritis',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Peringatan',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Sukses',
        };
      default:
        return {
          icon: <Info className="w-3.5 h-3.5 text-blue-600" />,
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'Informasi',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Aktivitas & Log Telemetri Terbaru
              </h2>
              <p className="text-xs text-slate-500">
                Pencatatan event telemetri, alert ambang batas, dan interaksi ESP32
              </p>
            </div>
          </div>

          <Link
            href="/history"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>Semua Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {activities.slice(0, 6).map((act) => {
            const badge = getBadge(act.type);
            return (
              <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                <div className={`mt-0.5 p-1 rounded-lg border ${badge.bg}`}>
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Menampilkan 6 aktivitas terkini</span>
        <span className="font-mono">Real-time Event Dispatcher</span>
      </div>
    </div>
  );
}
