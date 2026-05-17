'use client';

import React from 'react';
import { clsx } from 'clsx';
import { useNetwork } from '@/context/NetworkContext';
import { useMeshPeers } from '@/hooks/useMeshPeers';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, WifiOff, Radio } from 'lucide-react';

export const NetworkBadge = () => {
  const { isOnline, mode } = useNetwork();
  const meshPeers = useMeshPeers(!isOnline || mode === 'p2p');

  return (
    <motion.div
      layout
      className={clsx(
        'flex items-center gap-3 px-4 py-2 rounded-2xl border text-[10px] font-bold uppercase tracking-[0.15em] backdrop-blur-xl transition-all duration-700 shadow-lg',
        isOnline
          ? 'bg-blue-500/5 border-blue-500/20 text-blue-400 shadow-blue-500/5'
          : 'bg-orange-500/5 border-orange-500/20 text-orange-400 shadow-orange-500/5'
      )}
    >
      <div className="relative flex items-center justify-center w-2 h-2">
        <div
          className={clsx(
            'absolute inset-0 rounded-full animate-ping opacity-40',
            isOnline ? 'bg-blue-400' : 'bg-orange-400'
          )}
        />
        <div className={clsx('relative w-2 h-2 rounded-full', isOnline ? 'bg-blue-500' : 'bg-orange-500')} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isOnline ? 'online' : 'offline'}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 5 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          {isOnline ? (
            <>
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud Active</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Mesh Protocol</span>
              {meshPeers > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-[9px]">
                  <Radio className="w-3 h-3" />
                  {meshPeers} peer{meshPeers !== 1 ? 's' : ''}
                </span>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
