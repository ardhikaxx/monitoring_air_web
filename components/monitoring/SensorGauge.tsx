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

  // Semi-circle math (radius = 40, center = 50,50, arc length = pi * 40)
  const radius = 40;
  const circumference = Math.PI * radius; // ~125.66
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-36 h-22 flex items-end justify-center">
        <svg className="w-36 h-22 overflow-visible" viewBox="0 0 100 56">
          {/* Background Arc */}
          <path
            d="M 10,50 A 40,40 0 0,1 90,50"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Normal/Target Safe Zone Highlight */}
          {targetRange && (
            <path
              d="M 10,50 A 40,40 0 0,1 90,50"
              fill="none"
              stroke="#10b981"
              strokeWidth="7"
              strokeDasharray={`${
                ((targetRange.max - targetRange.min) / (max - min)) * circumference
              } ${circumference}`}
              strokeDashoffset={`${
                circumference - ((targetRange.min - min) / (max - min)) * circumference
              }`}
              opacity="0.35"
              strokeLinecap="round"
            />
          )}

          {/* Active Value Arc */}
          <path
            d="M 10,50 A 40,40 0 0,1 90,50"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Numerical Value */}
        <div className="absolute bottom-1 flex flex-col items-center leading-none">
          <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            {value}
          </span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            {unit}
          </span>
        </div>
      </div>

      {label && <span className="text-xs text-slate-500 font-medium mt-1">{label}</span>}
      <div className="flex justify-between w-32 text-[10px] text-slate-400 font-mono px-0.5 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
