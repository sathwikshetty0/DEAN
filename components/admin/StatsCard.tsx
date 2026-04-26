'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

export const StatsCard = ({ label, value, icon: Icon, color, trend }: StatsCardProps) => {
  const bgClass = color.replace('text-', 'bg-').replace(/\d+/, '$&/10');

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 rounded-3xl relative overflow-hidden group">
      <div className={clsx('absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-125 transition-transform', bgClass)} />
      <div className="flex items-center gap-3 mb-4">
        <div className={clsx('p-2 rounded-xl border border-white/5', bgClass)}>
          <Icon className={clsx('w-5 h-5', color)} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
      </div>
      <div className="text-4xl font-extrabold font-syne">{value}</div>
      {trend && (
        <div className="flex items-center gap-1.5 mt-4 text-[10px] text-green-500 font-bold">
          {trend}
        </div>
      )}
    </div>
  );
};
