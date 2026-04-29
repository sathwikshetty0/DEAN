import { Alert } from '@/lib/types/app.types';

const CHANNEL_NAME = 'dean-emergency';
let channel: BroadcastChannel | null = null;

export type P2PMessageType = 'NEW_ALERT' | 'STATUS_UPDATE' | 'HEARTBEAT' | 'ACK';

interface P2PMessage {
  type: P2PMessageType;
  payload: any;
  sender_id?: string;
  timestamp: number;
}

const logP2P = (msg: string, data?: any) => {
  console.log(`%c[P2P] ${msg}`, 'color: #3B82F6; font-weight: bold', data || '');
};

export const initP2PChannel = () => {
  if (typeof window === 'undefined') return;
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    logP2P('Channel Initialized', CHANNEL_NAME);
  }
};

export const broadcastMessage = (type: P2PMessageType, payload: any) => {
  initP2PChannel();
  const message: P2PMessage = {
    type,
    payload,
    timestamp: Date.now(),
  };
  channel?.postMessage(message);
  logP2P(`Broadcast: ${type}`, payload);
};

export const broadcastAlert = (alert: Partial<Alert>) => {
  broadcastMessage('NEW_ALERT', alert);
  queueOfflineAlert(alert);
};

export const listenForP2P = (callback: (message: P2PMessage) => void) => {
  initP2PChannel();
  if (!channel) return;
  
  const handleMessage = (event: MessageEvent<P2PMessage>) => {
    logP2P(`Received: ${event.data.type}`, event.data.payload);
    callback(event.data);
  };

  channel.addEventListener('message', handleMessage);
  return () => channel?.removeEventListener('message', handleMessage);
};

export const queueOfflineAlert = (alert: any) => {
  if (typeof window === 'undefined') return;
  try {
    const queue = JSON.parse(localStorage.getItem('dean-offline-queue') || '[]');
    queue.push({ 
      ...alert, 
      routing_mode: 'p2p', 
      is_synced: false, 
      queued_at: Date.now() 
    });
    localStorage.setItem('dean-offline-queue', JSON.stringify(queue));
    logP2P('Alert Queued Offline', alert);
  } catch (e) {
    console.error('P2P: Failed to queue alert', e);
  }
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
