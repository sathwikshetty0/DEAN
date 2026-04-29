'use client';

import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { useNetwork } from '@/context/NetworkContext';

interface SOSButtonProps {
  onClick: () => void;
  loading?: boolean;
}

import { motion } from 'framer-motion';

export const SOSButton = ({ onClick, loading }: SOSButtonProps) => {
  const { mode } = useNetwork();
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimer = React.useRef<NodeJS.Timeout | null>(null);
  const progressInterval = React.useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (loading) return;
    setIsHolding(true);
    setProgress(0);
    
    holdTimer.current = setTimeout(() => {
      handleSOS();
      endHold();
    }, 1500);

    progressInterval.current = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / 15), 100));
    }, 100);
  };

  const endHold = () => {
    setIsHolding(false);
    setProgress(0);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  const handleSOS = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    onClick();
  };

  return (
    <div className="relative">
      {/* Progress Ring */}
      <svg className="absolute inset-0 w-56 h-56 -m-4 -rotate-90 pointer-events-none">
        <circle
          cx="112"
          cy="112"
          r="108"
          fill="none"
          stroke="rgba(255,45,85,0.1)"
          strokeWidth="4"
        />
        <motion.circle
          cx="112"
          cy="112"
          r="108"
          fill="none"
          stroke="#FF2D55"
          strokeWidth="4"
          strokeDasharray="678"
          animate={{ strokeDashoffset: 678 - (678 * progress) / 100 }}
          transition={{ duration: 0.1 }}
          strokeLinecap="round"
        />
      </svg>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        disabled={loading}
        className={clsx(
          "relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_50px_rgba(255,45,85,0.3)]",
          loading ? "bg-gray-800" : isHolding ? "bg-[#CC0033]" : "bg-gradient-to-br from-[#FF2D55] to-[#CC0033]",
          "border-8 border-white/10 overflow-hidden group z-10"
        )}
      >
        {/* Ripple Effect Background */}
        {!loading && !isHolding && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white"
          />
        )}

        <span className="text-5xl font-black text-white mb-1 drop-shadow-lg tracking-tighter">
          {isHolding ? "HOLD" : "SOS"}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-bold px-4 text-center">
          {loading ? "Transmitting..." : isHolding ? "Keep Holding" : "Hold to help"}
        </span>
        
        {mode === 'p2p' && (
          <div className="absolute top-8 right-8 bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full border-2 border-white/20 shadow-lg animate-pulse">
            MESH
          </div>
        )}

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </motion.button>
    </div>
  );
};
