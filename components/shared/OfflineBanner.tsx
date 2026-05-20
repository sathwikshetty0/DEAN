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
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          exit={{ y: -60 }}
          className="fixed top-0 left-0 w-full z-[100] bg-amber-500 text-black px-6 py-2.5 flex items-center justify-between lg:justify-center gap-6 text-xs font-black shadow-2xl border-b border-white/20 backdrop-blur-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 animate-pulse" />
              <span className="tracking-tight uppercase">Offline Mode</span>
            </div>
            <div className="h-4 w-px bg-black/20 hidden md:block" />
            <div className="flex items-center gap-2">
               <span className="flex items-center gap-1.5 bg-black/90 px-3 py-1 rounded-full text-[10px] text-white">
                 <Radio className="w-3 h-3 text-amber-500" /> DEAN P2P PROTOCOL
               </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-[10px] font-bold opacity-80 uppercase tracking-wider">
              Local broadcasts active • Syncing queued
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-black text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all shadow-lg active:scale-95"
            >
              Retry Connection
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



// Added for debugging purposes
OfflineBanner.displayName = 'OfflineBanner';
