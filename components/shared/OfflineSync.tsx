'use client';

import { useEffect } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { getUnsyncedAlerts, markAlertAsSynced } from '@/lib/utils/db';
import { toast } from 'react-hot-toast';

export const OfflineSync = () => {
  const { isOnline } = useNetwork();

  useEffect(() => {
    const syncAlerts = async () => {
      if (isOnline) {
        const unsynced = await getUnsyncedAlerts();
        if (unsynced.length > 0) {
          toast.loading(`Syncing ${unsynced.length} offline alerts...`, { id: 'sync' });
          
          for (const alert of unsynced) {
            try {
              // Mocking API call for now. In reality, this would hit /api/alerts
              console.log('Syncing alert:', alert);
              
              // Simulate API delay
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              await markAlertAsSynced(alert.id);
            } catch (error) {
              console.error('Failed to sync alert:', alert.id, error);
            }
          }
          
          toast.success('Offline alerts synchronized!', { id: 'sync' });
        }
      }
    };

    syncAlerts();
  }, [isOnline]);

  return null;
};
