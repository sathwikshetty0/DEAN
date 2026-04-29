'use client';

import React from 'react';
import { clsx } from 'clsx';
import { useNetwork } from '@/context/NetworkContext';

interface SOSButtonProps {
  onClick: () => void;
  loading?: boolean;
}

import { motion } from 'framer-motion';

export const SOSButton = ({ onClick, loading }: SOSButtonProps) => {
  const { mode } = useNetwork();

  const handleSOS = () => {
    if (loading) return;
    
    // Haptic Feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    
    onClick();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleSOS}
      disabled={loading}
      className={clsx(
        "relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_50px_rgba(255,45,85,0.3)]",
        loading ? "bg-gray-800" : "bg-gradient-to-br from-[#FF2D55] to-[#CC0033]",
        "border-8 border-white/10 active:border-white/20 overflow-hidden group"
      )}
    >
      {/* Ripple Effect Background */}
      {!loading && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white"
        />
      )}

      <span className="text-5xl font-black text-white mb-1 drop-shadow-lg tracking-tighter">SOS</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-bold">
        {loading ? "Transmitting..." : "Tap to Help"}
      </span>
      
      {mode === 'p2p' && (
        <div className="absolute top-8 right-8 bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full border-2 border-white/20 shadow-lg animate-pulse">
          MESH
        </div>
      )}

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.button>
  );
};
