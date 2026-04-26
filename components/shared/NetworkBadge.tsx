'use client';

import React from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { Cloud, WifiOff } from 'lucide-react';
import { clsx } from 'clsx';

export const NetworkBadge = () => {
  const { isOnline, mode } = useNetwork();

  return (
    <div className={clsx(
      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium backdrop-blur-md transition-all duration-500",
      isOnline 
        ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
        : "bg-orange-500/10 border-orange-500/20 text-orange-400"
    )}>
      <div className={clsx(
        "w-2 h-2 rounded-full network-pulse",
        isOnline ? "bg-blue-400" : "bg-orange-400"
      )} />
      
      {isOnline ? (
        <div className="flex items-center gap-1.5">
          <Cloud className="w-3 h-3" />
          <span>ONLINE — Cloud Mode</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <WifiOff className="w-3 h-3" />
          <span>OFFLINE — P2P Active</span>
        </div>
      )}
    </div>
  );
};
