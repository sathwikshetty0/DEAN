'use client';

import React from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { WifiOff, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineBanner = () => {
  const { isOnline, mode } = useNetwork();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          exit={{ y: -50 }}
          className="fixed top-0 left-0 w-full z-[100] bg-gradient-to-r from-amber-500 to-orange-600 text-black px-4 py-2.5 flex items-center justify-center gap-3 text-xs md:text-sm font-black shadow-2xl border-b border-white/20"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span className="tracking-tight">INTERNET DISCONNECTED</span>
          </div>
          <div className="h-4 w-px bg-black/20 hidden md:block" />
          <div className="flex items-center gap-2">
             <span>ACTIVE:</span>
             <span className="flex items-center gap-1.5 bg-black px-3 py-1 rounded-full text-[10px] text-white">
               <Radio className="w-3 h-3 text-amber-500" /> P2P MESH MODE
             </span>
          </div>
          <div className="hidden lg:block text-[10px] opacity-70">
            Alerts are queued for cloud synchronization.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
