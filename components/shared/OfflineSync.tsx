'use client';

import { useEffect, useRef } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { getUnsyncedAlerts, markAlertAsSynced, clearSyncedAlerts } from '@/lib/utils/db';
import { flushOfflineQueue } from '@/lib/utils/p2p';
import { toast } from 'react-hot-toast';

export const OfflineSync = () => {
  const { isOnline } = useNetwork();
  const syncing = useRef(false);

  useEffect(() => {
    const syncAlerts = async () => {
      if (!isOnline || syncing.current) return;
      syncing.current = true;

      try {
        await flushOfflineQueue();

        const unsynced = await getUnsyncedAlerts();
        if (unsynced.length === 0) return;

        toast.loading(`Syncing ${unsynced.length} offline alert(s)…`, { id: 'sync' });

        let synced = 0;
        for (const alert of unsynced) {
          try {
            const res = await fetch('/api/alerts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location_lat: alert.location.lat,
                location_lng: alert.location.lng,
                emergency_type: alert.type || 'other',
                description: alert.metadata?.description ?? '',
                routing_mode: 'p2p',
              }),
            });

            if (res.ok) {
              await markAlertAsSynced(alert.id);
              synced += 1;
            }
          } catch (err) {
            console.error('Failed to sync alert:', alert.id, err);
          }
        }

        await clearSyncedAlerts();

        if (synced > 0) {
          toast.success(`${synced} offline alert(s) synchronized`, { id: 'sync' });
        } else {
          toast.dismiss('sync');
        }
      } finally {
        syncing.current = false;
      }
    };

    syncAlerts();
  }, [isOnline]);

  return null;
};
