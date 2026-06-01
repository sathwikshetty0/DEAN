'use client';

import React, { useEffect, useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { Database, Radio, Wifi, Server } from 'lucide-react';

type HealthStatus = 'ok' | 'degraded' | 'unknown';

export const SystemStatusBar = () => {
  const { isOnline, mode } = useNetwork();
  const [health, setHealth] = useState<HealthStatus>('unknown');
  const [uptime, setUptime] = useState<string>('â€”');

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setHealth('ok');
          setUptime(data.uptime ?? 'â€”');
        } else {
          setHealth('degraded');
        }
      } catch {
        setHealth('degraded');
      }
    };
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: 'Mesh Sync', value: isOnline ? 'Idle' : 'Pending', icon: Radio, ok: isOnline },
    { label: 'API', value: health === 'ok' ? 'OK' : 'DEGRADED', icon: Server, ok: health === 'ok' },
    { label: 'Uptime', value: uptime, icon: Database, ok: health === 'ok' },
    { label: 'Realtime', value: isOnline ? 'Active' : 'Degraded', icon: Radio, ok: isOnline },
    { label: 'Mode', value: mode === 'cloud' ? 'Cloud' : 'P2P Mesh', icon: Wifi, ok: true },
  ];

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl px-6 py-3 flex items-center gap-6 overflow-x-auto">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 flex-shrink-0">
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


// Added for debugging purposes
SystemStatusBar.displayName = 'SystemStatusBar';
