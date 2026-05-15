import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Alert, Log } from '@/lib/types/app.types';
import { toast } from 'react-hot-toast';

// RESPONDER — subscribes to new alerts
export const useAlertStream = (onNewAlert: (alert: Alert) => void) => {
  const supabase = createClient();
  
  useEffect(() => {
    const channel = supabase
      .channel('alerts-stream')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alerts',
      }, (payload) => {
        onNewAlert(payload.new as Alert);
        toast('🆘 New Emergency Alert!', { icon: '🔴' });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, onNewAlert]);
};

// USER — subscribes to their specific alert status updates
export const useAlertStatusStream = (alertId: string | undefined, onUpdate: (alert: Alert) => void) => {
  const supabase = createClient();
  
  useEffect(() => {
    if (!alertId) return;
    
    const channel = supabase
      .channel(`alert-${alertId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'alerts',
        filter: `id=eq.${alertId}`,
      }, (payload) => {
        onUpdate(payload.new as Alert);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, alertId, onUpdate]);
};

// ADMIN — subscribes to ALL alert changes + new logs
export const useAdminStream = (
  onAlert: (payload: any) => void,
  onLog: (payload: any) => void
) => {
  const supabase = createClient();
  
  useEffect(() => {
    const alertChannel = supabase
      .channel('admin-alerts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, onAlert)
      .subscribe();
      
    const logChannel = supabase
      .channel('admin-logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs' }, onLog)
      .subscribe();
      
    return () => {
      supabase.removeChannel(alertChannel);
      supabase.removeChannel(logChannel);
    };
  }, [supabase, onAlert, onLog]);
};

// RESPONDER LOCATION BROADCAST (broadcast channel — no DB persistence)
export const broadcastResponderLocation = (alertId: string, lat: number, lng: number) => {
  const supabase = createClient();
  supabase.channel(`location-${alertId}`)
    .send({ type: 'broadcast', event: 'location', payload: { lat, lng } });
};

export const useResponderLocation = (alertId: string | undefined, onUpdate: (loc: {lat:number,lng:number}) => void) => {
  const supabase = createClient();
  
  useEffect(() => {
    if (!alertId) return;
    
    const channel = supabase
      .channel(`location-${alertId}`)
      .on('broadcast', { event: 'location' }, ({ payload }) => onUpdate(payload))
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, alertId, onUpdate]);
};

// GLOBAL — subscribes to responder availability changes
export const useResponderAvailabilityStream = (onUpdate: (payload: any) => void) => {
  const supabase = createClient();
  
  useEffect(() => {
    const channel = supabase
      .channel('responder-availability')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: 'role=eq.responder'
      }, (payload) => {
        onUpdate(payload);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, onUpdate]);
};
