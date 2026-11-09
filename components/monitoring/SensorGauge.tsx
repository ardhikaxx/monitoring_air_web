'use client';

import React from 'react';

interface SensorGaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label?: string;
  targetRange?: { min: number; max: number };
  color?: string;
}

export default function SensorGauge({
  value,
  min,
  max,
  unit,
  label,
  targetRange,
  color = '#1677C8',
}: SensorGaugeProps) {
  // Normalize percentage 0 - 100
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  // Semi-circle math (radius = 42, circumference ~ 132 for 180 deg)
  const radius = 42;
  const circumference = Math.PI * radius; // half circle arc length ~ 131.95
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-20 flex items-end justify-center">
        <svg className="w-32 h-20 overflow-visible" viewBox="0 0 100 55">
          {/* Background Arc */}
          <path
            d="M 10,50 A 40,40 0 0,1 90,50"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Normal Range Highlight if provided */}
          {targetRange && (
            <path
              d="M 10,50 A 40,40 0 0,1 90,50"
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeDasharray={`${
                ((targetRange.max - targetRange.min) / (max - min)) * circumference
              } ${circumference}`}
              strokeDashoffset={`${
                circumference - ((targetRange.min - min) / (max - min)) * circumference
              }`}
              opacity="0.3"
            />
          )}

          {/* Active Value Arc */}
          <path
            d="M 10,50 A 40,40 0 0,1 90,50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Value */}
        <div className="absolute bottom-0 flex flex-col items-center leading-none">
          <span className="text-xl font-extrabold text-slate-800 font-mono tracking-tight">
            {value}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">{unit}</span>
        </div>
      </div>

      {label && <span className="text-xs text-slate-500 font-medium mt-1">{label}</span>}
      <div className="flex justify-between w-28 text-[9px] text-slate-400 font-mono px-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
