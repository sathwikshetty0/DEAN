'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface GlobalLoaderProps {
  show: boolean;
  message?: string;
}

export const GlobalLoader = ({ show, message = 'Loading...' }: GlobalLoaderProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[#0A0E1A]/90 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
        >
          {/* Noise Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-20 h-20 border-2 border-sos/20 border-t-sos border-r-sos rounded-[2rem] shadow-[0_0_40px_rgba(255,45,85,0.2)]"
            />
            <Zap className="w-8 h-8 text-sos absolute inset-0 m-auto drop-shadow-[0_0_10px_rgba(255,45,85,0.5)]" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-sos"
            >
              {message}
            </motion.span>
            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-sos to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
