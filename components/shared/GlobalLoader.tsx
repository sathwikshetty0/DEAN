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
          className="fixed inset-0 z-[9999] bg-[#0A0E1A]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
        >
          {/* Noise Overlay */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
          
          <div className="relative group">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360],
                borderRadius: ["2rem", "3rem", "2rem"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 border border-sos/30 border-t-sos border-r-sos shadow-[0_0_50px_rgba(255,45,85,0.25)] flex items-center justify-center"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <motion.div
                 animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 2, repeat: Infinity }}
               >
                 <Zap className="w-10 h-10 text-sos drop-shadow-[0_0_15px_rgba(255,45,85,0.6)]" />
               </motion.div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-1 overflow-hidden h-4">
              {message.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: i * 0.05,
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1,
                    repeatDelay: 2
                  }}
                  className="text-[11px] font-black uppercase tracking-widest text-sos"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
            
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-sos to-transparent"
              />
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="absolute bottom-12 text-[8px] font-bold text-white/50 tracking-[0.5em] uppercase"
          >
            System Resilient • D-EAN Protocol
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

