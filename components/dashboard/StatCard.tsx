import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle: string;
  icon: LucideIcon;
  variant?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  badgeText?: string;
  secondaryText?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  variant = 'blue',
  badgeText,
  secondaryText,
}: StatCardProps) {
  const variantStyles = {
    blue: {
      bgIcon: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: 'bg-blue-100 text-blue-800',
      borderHover: 'hover:border-blue-300',
      textAccent: 'text-blue-600',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'bg-emerald-100 text-emerald-800',
      borderHover: 'hover:border-emerald-300',
      textAccent: 'text-emerald-600',
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'bg-amber-100 text-amber-800',
      borderHover: 'hover:border-amber-300',
      textAccent: 'text-amber-600',
    },
    rose: {
      bgIcon: 'bg-rose-50 text-rose-600 border-rose-100',
      badge: 'bg-rose-100 text-rose-800',
      borderHover: 'hover:border-rose-300',
      textAccent: 'text-rose-600',
    },
    slate: {
      bgIcon: 'bg-slate-100 text-slate-600 border-slate-200',
      badge: 'bg-slate-200 text-slate-800',
      borderHover: 'hover:border-slate-300',
      textAccent: 'text-slate-600',
    },
  }[variant];

  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${variantStyles.borderHover} flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-semibold text-slate-500">{unit}</span>
            )}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border ${variantStyles.bgIcon} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 truncate">{subtitle}</span>
        {badgeText ? (
          <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${variantStyles.badge} shrink-0`}>
            {badgeText}
          </span>
        ) : secondaryText ? (
          <span className="text-slate-400 font-mono text-[11px] shrink-0">{secondaryText}</span>
        ) : null}
      </div>
    </div>
  );
}
