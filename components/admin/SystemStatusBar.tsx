'use client';

import React from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { Database, Radio, Wifi, Server } from 'lucide-react';

export const SystemStatusBar = () => {
  const { isOnline, mode } = useNetwork();

  const items = [
    { label: 'System', value: 'OPERATIONAL', icon: Server, ok: true },
    { label: 'DB', value: 'Connected', icon: Database, ok: true },
    { label: 'Realtime', value: isOnline ? 'Active' : 'Degraded', icon: Radio, ok: isOnline },
    { label: 'Mode', value: mode === 'cloud' ? 'Cloud' : 'Hybrid', icon: Wifi, ok: true },
  ];

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl px-6 py-3 flex items-center gap-6 overflow-x-auto">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 flex-shrink-0">
          <item.icon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{item.label}:</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${item.ok ? 'bg-green-500' : 'bg-orange-500'}`} />
            <span className={`text-[10px] font-bold ${item.ok ? 'text-green-400' : 'text-orange-400'}`}>{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
