'use client';

import React from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { WifiOff, Radio } from 'lucide-react';

export const OfflineBanner = () => {
  const { isOnline, mode } = useNetwork();

  if (isOnline) return null;

  return (
    <div className="offline-banner fixed top-0 left-0 w-full z-[60] bg-[var(--orange-p2p)] text-black px-4 py-2 flex items-center justify-center gap-3 text-sm font-bold shadow-lg">
      <WifiOff className="w-4 h-4" />
      <span>You&apos;re offline — D-EAN is running in</span>
      <span className="flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded-full text-[10px]">
        <Radio className="w-3 h-3" /> P2P MODE
      </span>
      <span>Alerts will sync when connection is restored.</span>
    </div>
  );
};
