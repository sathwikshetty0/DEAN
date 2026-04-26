'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from '@/lib/types/app.types';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

interface AlertContextType {
  activeAlert: Alert | null;
  setActiveAlert: (alert: Alert | null) => void;
  loading: boolean;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchActiveAlert = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('triggered_by', user.id)
        .in('status', ['pending', 'accepted', 'en_route'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setActiveAlert(data);
      }
      setLoading(false);
    };

    fetchActiveAlert();
  }, [user, supabase]);

  return (
    <AlertContext.Provider value={{ activeAlert, setActiveAlert, loading }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
