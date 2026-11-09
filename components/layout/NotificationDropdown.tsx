'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSystem } from '@/context/SystemContext';
import { Bell, CheckCheck, Trash2, AlertTriangle, AlertOctagon, CheckCircle2, Info } from 'lucide-react';

export default function NotificationDropdown() {
  const { activities, markActivityAsRead, markAllActivitiesAsRead, clearActivities } = useSystem();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = activities.filter((a) => !a.read).length;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        title="Notifikasi & Peringatan Sistem"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/80 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 text-sm">Notifikasi Telemetri</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-rose-100 text-rose-700 rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllActivitiesAsRead}
                  className="p-1 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Tandai semua dibaca"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {activities.length > 0 && (
                <button
                  onClick={clearActivities}
                  className="p-1 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Hapus semua notifikasi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {activities.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Tidak ada riwayat notifikasi baru.
              </div>
            ) : (
              activities.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markActivityAsRead(item.id)}
                  className={`p-3 text-xs cursor-pointer transition-colors flex items-start gap-3 hover:bg-slate-50 ${
                    !item.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="mt-0.5">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="font-semibold text-slate-800 truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center text-[11px] text-slate-500 font-medium">
            Simulasi Notifikasi IoT Real-time
          </div>
        </div>
      )}
    </div>
  );
}
