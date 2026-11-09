'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSystem } from '@/context/SystemContext';
import NotificationDropdown from './NotificationDropdown';
import {
  LayoutDashboard,
  Activity,
  Scale,
  LineChart,
  Clock,
  Radio,
  User,
  ShieldCheck,
  Pause,
  Play,
  Droplets,
  Cpu,
  Wifi,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function Topbar() {
  const {
    deviceStatus,
    isMonitoringActive,
    toggleMonitoring,
    warningCount,
    criticalCount,
  } = useSystem();

  const [currentDateTime, setCurrentDateTime] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live formatted Indonesian date and time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentDateTime(`${formatted}, ${timeStr} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Section navigation links with live badges
  const navItems = useMemo(
    () => [
      {
        id: 'overview',
        label: 'Ringkasan & ESP32',
        icon: LayoutDashboard,
        badge: null,
      },
      {
        id: 'monitoring',
        label: 'Monitoring Sensor',
        icon: Activity,
        badge:
          warningCount + criticalCount > 0 ? (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-300">
              {warningCount + criticalCount} Warning
            </span>
          ) : (
            <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-700">
              7 Sensor
            </span>
          ),
      },
      {
        id: 'comparison',
        label: 'Komparasi Kualitas',
        icon: Scale,
        badge: null,
      },
      {
        id: 'charts',
        label: 'Grafik Telemetri',
        icon: LineChart,
        badge: null,
      },
    ],
    [warningCount, criticalCount]
  );

  // Smooth scroll to section
  const handleScrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scrollspy to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
      {/* Primary Command Bar */}
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleScrollTo('overview')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#123B5D] via-[#163B5C] to-[#1677C8] flex items-center justify-center text-white shadow-md shadow-blue-900/20 relative group-hover:scale-105 transition-transform">
                <Droplets className="w-5 h-5 text-cyan-300" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                    AquaMonitor
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-blue-600 text-white tracking-wider uppercase">
                    IoT SCADA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Water Treatment Monitoring System
                </p>
              </div>
            </button>
          </div>

          {/* Center: Horizontal Navigation Tabs (Pill Container) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/90 border border-slate-200/80 rounded-2xl shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-sm shadow-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge}
                </button>
              );
            })}
          </nav>

          {/* Right: Telemetry Controls & System Indicators */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Auto-Refresh Stream Toggle */}
            <button
              onClick={toggleMonitoring}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isMonitoringActive
                  ? 'bg-blue-50/90 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title={
                isMonitoringActive
                  ? 'Live telemetry streaming aktif. Klik untuk jeda'
                  : 'Streaming dijeda. Klik untuk aktifkan kembali'
              }
            >
              {isMonitoringActive ? (
                <>
                  <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  <span>Live Stream</span>
                  <Pause className="w-3 h-3 text-blue-400 ml-0.5" />
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dijeda</span>
                  <Play className="w-3 h-3 text-amber-600 ml-0.5 fill-amber-600" />
                </>
              )}
            </button>

            {/* ESP32 Hardware Status Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                deviceStatus.status === 'online'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
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

            {/* Current Time in Indonesian Format (WIB) */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-600 bg-slate-50 border border-slate-200/80 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentDateTime || 'Memuat waktu...'}</span>
            </div>

            {/* Notifications Dropdown */}
            <NotificationDropdown />

            {/* User Profile */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#123B5D] to-[#1677C8] flex items-center justify-center text-white shadow-xs font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">Administrator</div>
                <div className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>Super Admin</span>
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Header Industrial Telemetry Ribbon */}
      <div className="border-t border-slate-200/60 bg-slate-50/70 backdrop-blur-xs">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          {/* Micro Telemetry Hardware Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-800">ESP32 NodeMCU-32S</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-[11px] text-slate-600">IP: 192.168.1.105</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-600" /> -62 dBm
              </span>
            </div>
          </div>

          {/* Standards & Sampling Interval */}
          <div className="flex items-center gap-3 text-[11px]">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                Baku Mutu: <strong className="text-slate-800">Permenkes RI No. 2/2023</strong>
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="text-slate-600 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Interval Telemetri: <strong className="text-blue-700">3 Detik</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 py-4 space-y-3 shadow-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Navigasi Seksi Dashboard
          </div>
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">{currentDateTime}</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
              ESP32 Online
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
