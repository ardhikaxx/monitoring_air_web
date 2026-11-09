'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSystem } from '@/context/SystemContext';
import NotificationDropdown from './NotificationDropdown';
import {
  Menu,
  ChevronRight,
  Clock,
  Radio,
  User,
  ShieldCheck,
  Pause,
  Play,
} from 'lucide-react';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const pathname = usePathname();
  const { deviceStatus, lastUpdatedTime, isMonitoringActive, toggleMonitoring } = useSystem();

  // Get Breadcrumbs & Title
  const getPageInfo = () => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return {
          title: 'Dashboard Monitoring',
          breadcrumbs: ['Sistem', 'Dashboard Utama'],
        };
      case '/monitoring':
        return {
          title: 'Monitoring Sensor Lengkap',
          breadcrumbs: ['Monitoring', 'Semua Sensor'],
        };
      case '/monitoring/inlet':
        return {
          title: 'Inlet Monitoring',
          breadcrumbs: ['Monitoring', 'Inlet (Sebelum Filtrasi)'],
        };
      case '/monitoring/outlet':
        return {
          title: 'Outlet Monitoring',
          breadcrumbs: ['Monitoring', 'Outlet (Setelah Filtrasi)'],
        };
      case '/history':
        return {
          title: 'Grafik & Histori Telemetri',
          breadcrumbs: ['Analisis', 'Grafik & Histori'],
        };
      case '/control-panel':
        return {
          title: 'Pusat Kendali IoT (Control Panel)',
          breadcrumbs: ['Operasional', 'Control Panel'],
        };
      case '/sensor-testing':
        return {
          title: 'Pengujian & Kalibrasi Sensor',
          breadcrumbs: ['Pemeliharaan', 'Pengujian & Kalibrasi'],
        };
      case '/settings':
        return {
          title: 'Pengaturan Sistem',
          breadcrumbs: ['Konfigurasi', 'Ambang Batas & Preferensi'],
        };
      default:
        return {
          title: 'Sistem Monitoring Air',
          breadcrumbs: ['Sistem', 'Monitoring'],
        };
    }
  };

  const { title, breadcrumbs } = getPageInfo();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                  <span className={idx === breadcrumbs.length - 1 ? 'text-blue-600 font-semibold' : ''}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </nav>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Telemetry status, clock, notification, user */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Monitoring Mode Button */}
          <button
            onClick={toggleMonitoring}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isMonitoringActive
                ? 'bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
            title={isMonitoringActive ? 'Klik untuk jeda pembaruan otomatis' : 'Klik untuk aktifkan auto refresh'}
          >
            {isMonitoringActive ? (
              <>
                <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Auto-Refresh Aktif</span>
                <Pause className="w-3 h-3 text-blue-400 ml-1" />
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Monitoring Dijeda</span>
                <Play className="w-3 h-3 text-amber-600 ml-1 fill-amber-600" />
              </>
            )}
          </button>

          {/* Device Online Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border ${
              deviceStatus.status === 'online'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {deviceStatus.status === 'online' ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>ESP32 Online</span>
              </>
            ) : (
              <>
                <span className="inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                <span>ESP32 Offline</span>
              </>
            )}
          </div>

          {/* Last Update Time */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-500 bg-slate-50 border border-slate-200/80 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{lastUpdatedTime}</span>
          </div>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#123B5D] to-[#1677C8] flex items-center justify-center text-white shadow-sm font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">Administrator</div>
              <div className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
