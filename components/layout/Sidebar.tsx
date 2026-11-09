'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSystem } from '@/context/SystemContext';
import {
  LayoutDashboard,
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  LineChart,
  Sliders,
  FlaskConical,
  Settings,
  Wifi,
  WifiOff,
  Cpu,
  X,
  Droplets,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { deviceStatus, warningCount, criticalCount } = useSystem();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Monitoring Sensor',
      href: '/monitoring',
      icon: Activity,
      badge:
        warningCount + criticalCount > 0 ? (
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300">
            {warningCount + criticalCount}
          </span>
        ) : null,
    },
    {
      label: 'Inlet Monitoring',
      href: '/monitoring/inlet',
      icon: ArrowDownToLine,
      badge: <span className="text-[10px] text-blue-300 font-mono">4 Sens</span>,
    },
    {
      label: 'Outlet Monitoring',
      href: '/monitoring/outlet',
      icon: ArrowUpFromLine,
      badge: <span className="text-[10px] text-emerald-300 font-mono">3 Sens</span>,
    },
    {
      label: 'Grafik dan Histori',
      href: '/history',
      icon: LineChart,
      badge: null,
    },
    {
      label: 'Control Panel',
      href: '/control-panel',
      icon: Sliders,
      badge: (
        <span className="px-1.5 py-0.2 text-[9px] font-semibold tracking-wider rounded bg-blue-500/30 text-blue-200">
          IOT
        </span>
      ),
    },
    {
      label: 'Pengujian Sensor',
      href: '/sensor-testing',
      icon: FlaskConical,
      badge: null,
    },
    {
      label: 'Pengaturan',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) {
      return true;
    }
    return pathname === href;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#123B5D] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1677C8] to-blue-400 p-2 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight leading-none text-white flex items-center gap-1.5">
                Water Treatment <span className="text-cyan-400 font-extrabold text-xs">IoT</span>
              </h1>
              <p className="text-[10px] text-blue-200 tracking-wider font-semibold uppercase mt-1">
                Industrial Monitoring
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-blue-300 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            <span>Menu Navigasi</span>
          </div>

          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#1677C8] text-white shadow-md shadow-blue-900/30 font-semibold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4.5 h-4.5 transition-colors ${
                      active ? 'text-white' : 'text-blue-300 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </Link>
            );
          })}
        </div>

        {/* Bottom Hardware Info Box */}
        <div className="p-3.5 border-t border-white/10 bg-[#0e2b44]/60">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5 text-cyan-300" />
                </div>
                <div>
                  <div className="font-semibold text-white leading-tight">ESP32 Master</div>
                  <div className="text-[10px] text-blue-200 font-mono">{deviceStatus.deviceId}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {deviceStatus.status === 'online' ? (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                ) : (
                  <span className="inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                )}
              </div>
            </div>

            <div className="pt-1.5 border-t border-white/10 grid grid-cols-2 gap-1 text-[11px] text-blue-200">
              <div className="flex items-center gap-1">
                {deviceStatus.status === 'online' ? (
                  <Wifi className="w-3 h-3 text-cyan-300" />
                ) : (
                  <WifiOff className="w-3 h-3 text-rose-300" />
                )}
                <span>{deviceStatus.status === 'online' ? `${deviceStatus.wifiQuality}% Signal` : 'Offline'}</span>
              </div>
              <div className="text-right font-mono text-[10px] text-blue-100">
                {deviceStatus.status === 'online' ? deviceStatus.ipAddress : 'Disconnected'}
              </div>
            </div>
          </div>

          <div className="mt-2.5 px-1 flex items-center justify-between text-[10px] text-blue-300/80">
            <span>Water Treatment IoT</span>
            <span className="font-mono">v1.2.0-iot</span>
          </div>
        </div>
      </aside>
    </>
  );
}
