import { Alert } from '@/lib/types/app.types';

const CHANNEL_NAME = 'dean-emergency';
let channel: BroadcastChannel | null = null;

export const initP2PChannel = () => {
  if (typeof window === 'undefined') return;
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
};

export const broadcastAlert = (alert: Partial<Alert>) => {
  initP2PChannel();
  channel?.postMessage({ type: 'NEW_ALERT', payload: alert, timestamp: Date.now() });
  queueOfflineAlert(alert);
};

export const listenForAlerts = (callback: (alert: any) => void) => {
  initP2PChannel();
  if (!channel) return;
  channel.onmessage = (event) => {
    if (event.data.type === 'NEW_ALERT') callback(event.data.payload);
  };
};

export const queueOfflineAlert = (alert: any) => {
  if (typeof window === 'undefined') return;
  const queue = JSON.parse(localStorage.getItem('dean-offline-queue') || '[]');
  queue.push({ ...alert, routing_mode: 'p2p', is_synced: false, queued_at: Date.now() });
  localStorage.setItem('dean-offline-queue', JSON.stringify(queue));
};

export const flushOfflineQueue = async () => {
  if (typeof window === 'undefined') return;
  const queue = JSON.parse(localStorage.getItem('dean-offline-queue') || '[]');
  if (!queue.length) return;
  
  try {
    const res = await fetch('/api/alerts/sync-p2p', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alerts: queue }),
    });
    
    if (res.ok) {
      localStorage.removeItem('dean-offline-queue');
    }
  } catch (err) {
    console.error('Failed to sync offline queue:', err);
  }
};
