'use client';

/**
 * @fileoverview Utility module for useMeshPeers
 * Implements functionality related to the D-EAN platform's core logic layer.
 */

import { useEffect, useState } from 'react';
import { listenForP2P, broadcastMessage } from '@/lib/utils/p2p';

const PEER_TTL_MS = 15000;

export const useMeshPeers = (enabled: boolean) => {
  const [peerCount, setPeerCount] = useState(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const peers = new Map<string, number>();
    const tabId = `tab-${Math.random().toString(36).slice(2)}`;

    const cleanupListen = listenForP2P((msg) => {
      if (msg.type === 'HEARTBEAT' && msg.sender_id) {
        peers.set(msg.sender_id, Date.now());
      }
    });

    broadcastMessage('HEARTBEAT', { status: 'alive' });
    const heartbeat = setInterval(() => {
      broadcastMessage('HEARTBEAT', { status: 'alive' }, tabId);
    }, 5000);

    const prune = setInterval(() => {
      const now = Date.now();
      for (const [id, ts] of peers) {
        if (now - ts > PEER_TTL_MS) peers.delete(id);
      }
      setPeerCount(peers.size);
    }, 2000);

    return () => {
      cleanupListen?.();
      clearInterval(heartbeat);
      clearInterval(prune);
    };
  }, [enabled]);

  return peerCount;
};
