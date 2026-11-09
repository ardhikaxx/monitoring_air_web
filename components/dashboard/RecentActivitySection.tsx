'use client';

import React from 'react';
import { useSystem } from '@/context/SystemContext';
import {
  History,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Activity,
} from 'lucide-react';

export default function RecentActivitySection() {
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
    <section id="activity" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Recent Activity (Log Telemetri &amp; Event)
            </h2>
            <p className="text-xs text-slate-500">
              Pencatatan aktivitas pembaruan sensor, aksi control panel, dan trigger event sistem
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Live Dispatcher Event</span>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
        {activities.slice(0, 10).map((act) => {
          const badge = getBadge(act.type);
          return (
            <div key={act.id} className="py-3 first:pt-1 last:pb-1 flex items-start gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors">
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

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Menampilkan 10 aktivitas terbaru</span>
        <span className="font-mono">Log diperbarui secara otomatis</span>
      </div>
    </section>
  );
}
