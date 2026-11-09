'use client';

import React from 'react';
import Topbar from './Topbar';
import { Droplets } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col font-sans text-slate-800">
      {/* Clean Topbar */}
      <Topbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {children}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#123B5D] flex items-center justify-center text-white">
              <Droplets className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <span className="font-semibold text-slate-800">AquaMonitor</span>
            <span className="text-slate-400">Water Treatment IoT System</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            ESP32 Sensor Telemetry • Real-time Monitoring
          </div>
        </div>
      </footer>
    </div>
  );
}
