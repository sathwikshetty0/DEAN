'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, WifiOff, Globe, Zap } from 'lucide-react';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
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

  return (
    <>
      <div className={`fixed top-6 right-6 z-[50] flex items-center gap-3 px-4 py-2 bg-[#0A0E1A]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl transition-all duration-500 ${!isOnline ? 'border-amber-500/50 shadow-amber-500/10' : ''}`}>
        <div className="relative">
          {isOnline ? (
            <Globe className="w-4 h-4 text-blue-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-amber-500" />
          )}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isOnline ? 'bg-blue-500' : 'bg-amber-500'}`}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Network Mode</span>
          <span className={`text-[10px] font-bold uppercase transition-colors duration-500 ${isOnline ? 'text-blue-400' : 'text-amber-400'}`}>
            {isOnline ? 'Cloud Active' : 'P2P Mesh Only'}
          </span>
        </div>
        {!isOnline && (
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-amber-500"
          />
        )}
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOnline ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>
              {isOnline ? <Cloud className="w-5 h-5 text-blue-500" /> : <WifiOff className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {isOnline ? 'System Online' : 'Internet Disconnected'}
              </div>
              <div className="text-xs text-white/60">
                {isOnline ? 'Cloud synchronization resumed.' : 'Switching to P2P local broadcast mode.'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
