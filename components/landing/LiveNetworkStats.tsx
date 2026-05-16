'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Radio, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthPayload {
  status: string;
  uptime: string;
  network: { cloud: boolean; p2pReady: boolean };
}

export const LiveNetworkStats = () => {
  const [health, setHealth] = useState<HealthPayload | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) setHealth(await res.json());
      } catch {
        /* offline demo */
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { icon: Activity, label: 'API', value: health?.status === 'ok' ? 'Online' : 'Checking…', color: 'var(--green-safe)' },
    { icon: Radio, label: 'P2P Mesh', value: health?.network.p2pReady ? 'Ready' : 'Standby', color: 'var(--orange-p2p)' },
    { icon: Shield, label: 'Uptime', value: health?.uptime ?? '—', color: 'var(--blue-cloud)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto mb-16"
    >
      {items.map((item) => (
        <motion.div
          key={item.label}
          whileHover={{ y: -2 }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--bg-secondary)]/80 border border-[var(--border-default)] backdrop-blur-sm"
        >
          <item.icon className="w-4 h-4" style={{ color: item.color }} />
          <div className="text-left">
            <div className="text-sm font-extrabold font-syne" style={{ color: item.color }}>
              {item.value}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              {item.label}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
