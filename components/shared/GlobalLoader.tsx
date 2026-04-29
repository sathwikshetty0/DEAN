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
          className="fixed inset-0 z-[9999] bg-[#121212]/80 backdrop-blur-md flex flex-col items-center justify-center gap-6"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 border-4 border-sos/10 border-t-sos rounded-2xl"
            />
            <Zap className="w-6 h-6 text-sos absolute inset-0 m-auto animate-pulse" />
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
