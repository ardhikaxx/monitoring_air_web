'use client';

import React from 'react';
import Topbar from './Topbar';
import { Droplets, ShieldCheck, Cpu, Activity } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col font-sans text-slate-800">
      {/* Full-Width Industrial Top Command Bar & Telemetry Ribbon */}
      <Topbar />

      {/* Main Content Area - Full-Width Canvas, Unconstrained by Sidebar */}
      <main className="flex-1 w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        {children}
      </main>

      {/* Industrial Dashboard SCADA Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          {/* Brand & System Definition */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#123B5D] to-[#1677C8] flex items-center justify-center text-white shadow-xs">
              <Droplets className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 tracking-tight">AquaMonitor IoT</span>
              <span className="text-slate-300 mx-1.5">•</span>
              <span>Water Treatment &amp; Quality Telemetry Monitoring System</span>
            </div>
          </div>

          {/* Standards & Telemetry specs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Baku Mutu: Permenkes No. 2/2023</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>ESP32 NodeMCU-32S Architecture</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-600" />
              <span>7 Channel Multi-Sensor Array</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
