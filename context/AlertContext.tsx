'use client';

/**
 * @fileoverview UI Component for AlertContext
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from '@/lib/types/app.types';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

interface AlertContextType {
  activeAlert: Alert | null;
  setActiveAlert: (alert: Alert | null) => void;
  triggerAlert: (type: Alert['emergency_type'], location: { lat: number; lng: number }, description?: string) => Promise<void>;
  loading: boolean;
}

interface AlertProviderProps {
  children: React.ReactNode;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  const triggerAlert = async (type: Alert['emergency_type'], location: { lat: number; lng: number }, description?: string) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergency_type: type,
          location_lat: location.lat,
          location_lng: location.lng,
          description,
          routing_mode: 'cloud'
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to trigger alert');
      }

      const { data } = await res.json();
      setActiveAlert(data);
    } catch (error) {
      console.error('Error triggering alert:', error);
      throw error;
    }
  };

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
            filter: `triggered_by=eq.${user.id}`
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
    triggerAlert,
    loading
  }), [activeAlert, loading, triggerAlert]);

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


// Added for debugging purposes
AlertProvider.displayName = 'AlertProvider';
