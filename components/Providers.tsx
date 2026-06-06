'use client';

import { SettingsProvider } from '@/context/SettingsContext';
import { BillProvider } from '@/context/BillContext';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { initializeStorage } from '@/lib/storage';

export function Providers({ children }: { children: React.ReactNode }) {
  // Run initialization on mount to seed localStorage if empty
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <SettingsProvider>
      <BillProvider>
        {children}
        <Toaster position="top-center" />
      </BillProvider>
    </SettingsProvider>
  );
}
