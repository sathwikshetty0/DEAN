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
        .eq('user_id', user.id) // Corrected from triggered_by to match schema in README
        .in('status', ['pending', 'accepted', 'en_route'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error) {
        setActiveAlert(data);
      }
      setLoading(false);
    };

    fetchActiveAlert();

    // Subscribe to changes for this user's alerts
    if (user) {
      const channel = supabase
        .channel(`user-alerts-${user.id}`)
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'alerts',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newAlert = payload.new as Alert;
            if (['pending', 'accepted', 'en_route'].includes(newAlert.status)) {
              setActiveAlert(newAlert);
            } else {
              setActiveAlert(null);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, supabase]);

  const value = React.useMemo(() => ({
    activeAlert,
    setActiveAlert,
    loading
  }), [activeAlert, loading]);

  return (
    <AlertContext.Provider value={value}>
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
