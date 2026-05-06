'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, WifiOff, Globe, Zap } from 'lucide-react';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnecting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualReconnect = () => {
    if (!isOnline) {
      setIsReconnecting(true);
      setTimeout(() => {
        setIsReconnecting(false);
        if (navigator.onLine) {
          setIsOnline(true);
        }
      }, 1500);
    }
  };

  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleManualReconnect}
        className={`fixed top-6 right-6 z-[50] flex items-center gap-3 px-5 py-2.5 bg-[#0A0E1A]/80 backdrop-blur-xl border border-white/10 rounded-[1.25rem] shadow-2xl transition-all duration-500 cursor-pointer select-none group ${!isOnline ? 'border-amber-500/40 shadow-amber-500/5' : 'hover:border-blue-500/30'}`}
      >
        <div className="relative">
          {isReconnecting ? (
            <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          ) : isOnline ? (
            <Globe className="w-4 h-4 text-blue-500 group-hover:rotate-12 transition-transform" />
          ) : (
            <WifiOff className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          )}
          {!isReconnecting && (
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isOnline ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Network Mode</span>
          <span className={`text-[10px] font-extrabold uppercase transition-colors duration-500 ${isOnline ? 'text-blue-400' : 'text-amber-400'}`}>
            {isReconnecting ? 'Reconnecting...' : isOnline ? 'Cloud Protocol' : 'P2P Mesh Only'}
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 bg-[#121212] border border-white/10 rounded-[1.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex items-center gap-4 min-w-[320px]"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isOnline ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>
              {isOnline ? <Cloud className="w-6 h-6 text-blue-500" /> : <WifiOff className="w-6 h-6 text-amber-500" />}
            </div>
            <div>
              <div className="text-[13px] font-black text-white uppercase tracking-wider">
                {isOnline ? 'Network Restored' : 'Connection Lost'}
              </div>
              <div className="text-[11px] text-white/50 font-medium">
                {isOnline ? 'Cloud synchronization is now active.' : 'Switching to decentralized P2P mode.'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

