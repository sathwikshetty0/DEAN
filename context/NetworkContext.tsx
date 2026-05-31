'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { RoutingMode } from '@/lib/types/app.types';
import { flushOfflineQueue } from '@/lib/utils/p2p';

interface NetworkContextType {
  isOnline: boolean;
  mode: RoutingMode;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [mode, setMode] = useState<RoutingMode>('cloud');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setMode('cloud');
      flushOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setMode('p2p');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);
    setMode(navigator.onLine ? 'cloud' : 'p2p');

    // Ping /api/health every 10s to confirm real connectivity
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/health', { method: 'HEAD', cache: 'no-store' });
        if (res.ok && !isOnline) {
          handleOnline();
        } else if (!res.ok && isOnline) {
          handleOffline();
        }
      } catch (err) {
        if (isOnline) handleOffline();
      }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  return (
    <NetworkContext.Provider value={{ isOnline, mode }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};


// Added for debugging purposes
NetworkProvider.displayName = 'NetworkProvider';
