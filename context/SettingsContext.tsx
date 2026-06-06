'use client';

/**
 * @fileoverview UI Component for SettingsContext
 * Implements functionality related to the Bill platform's presentation layer.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ShopSettings } from '@/lib/types';
import { getSettings, saveSettings } from '@/lib/storage';

interface SettingsContextType {
  settings: ShopSettings | null;
  updateSettings: (newSettings: ShopSettings) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<ShopSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    setSettingsState(getSettings());
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings: ShopSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
