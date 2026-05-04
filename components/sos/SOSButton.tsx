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
    
    // Initial tactile feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    holdTimer.current = setTimeout(() => {
      handleSOS();
      endHold();
    }, 1500);

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + (100 / 15), 100);
        // Increasing vibration intensity as we get closer
        if ('vibrate' in navigator && next % 20 === 0) {
          navigator.vibrate(next / 2);
        }
        return next;
      });
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
      // Urgent triple pulse
      navigator.vibrate([300, 100, 300, 100, 500]);
    }
    onClick();
  };

  return (
    <div className="relative group/sos">
      {/* Background Outer Ring */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -inset-10 rounded-full bg-[#FF2D55]/10 blur-2xl -z-10"
      />

      {/* Progress Ring */}
      <svg className="absolute inset-0 w-56 h-56 -m-4 -rotate-90 pointer-events-none drop-shadow-[0_0_15px_rgba(255,45,85,0.5)]">
        <circle
          cx="112"
          cy="112"
          r="108"
          fill="none"
          stroke="rgba(255,45,85,0.05)"
          strokeWidth="6"
        />
        <motion.circle
          cx="112"
          cy="112"
          r="108"
          fill="none"
          stroke="#FF2D55"
          strokeWidth="6"
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
          "relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-[0_0_60px_rgba(255,45,85,0.4)]",
          loading ? "bg-gray-800" : isHolding ? "bg-[#B8002D]" : "bg-gradient-to-br from-[#FF2D55] via-[#E6294D] to-[#CC0033]",
          "border-[10px] border-white/20 overflow-hidden group z-10"
        )}
      >
        {/* Ripple Effect Background */}
        {!loading && (
          <motion.div
            animate={isHolding ? 
              { scale: [1, 1.6, 1], opacity: [0.1, 0.3, 0.1] } : 
              { scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }
            }
            transition={{ duration: isHolding ? 0.3 : 2, repeat: Infinity }}
            className="absolute inset-0 bg-white"
          />
        )}

        <span className="text-5xl font-black text-white mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-tighter">
          {isHolding ? "HOLD" : "SOS"}
        </span>
        <span className="text-[11px] uppercase tracking-[0.25em] text-white font-black px-4 text-center drop-shadow-md">
          {loading ? "Transmitting..." : isHolding ? "Keep Holding" : "Hold to help"}
        </span>
        
        {mode === 'p2p' && (
          <div className="absolute top-8 right-8 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-white/20 shadow-xl animate-pulse">
            MESH
          </div>
        )}

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </motion.button>
    </div>
  );
};
