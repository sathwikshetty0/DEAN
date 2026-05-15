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
          className="fixed inset-0 z-[9999] bg-[#0A0E1A]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 overflow-hidden"
        >
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
            <motion.div 
              animate={{ y: ['0%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-full h-1 bg-sos/20 blur-sm"
            />
          </div>

          {/* Noise Overlay */}
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
          
          <div className="relative group">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 90, 180, 270, 360],
                borderRadius: ["2rem", "1.5rem", "2rem"]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-28 h-28 border border-sos/20 border-t-sos border-l-sos shadow-[0_0_80px_rgba(255,45,85,0.15)] flex items-center justify-center relative"
            >
              <div className="absolute inset-0 border border-sos/5 m-2 rounded-[1.5rem]" />
            </motion.div>
            
            <div className="absolute inset-0 flex items-center justify-center">
               <motion.div
                 animate={{ 
                   scale: [1, 1.2, 1], 
                   opacity: [0.7, 1, 0.7],
                   filter: [
                     'drop-shadow(0 0 10px rgba(255,45,85,0.4))',
                     'drop-shadow(0 0 20px rgba(255,45,85,0.8))',
                     'drop-shadow(0 0 10px rgba(255,45,85,0.4))'
                   ]
                 }}
                 transition={{ duration: 2, repeat: Infinity }}
               >
                 <Zap className="w-12 h-12 text-sos" />
               </motion.div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-6 z-20">
            <div className="flex flex-col items-center">
              <div className="flex gap-1.5 overflow-hidden h-5">
                {message.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: i * 0.04,
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 1.5,
                      repeatDelay: 3
                    }}
                    className="text-[12px] font-black uppercase tracking-[0.3em] text-sos"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
              <motion.span 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[9px] font-bold text-white/30 tracking-[0.4em] uppercase mt-2"
              >
                Initializing Handshake
              </motion.span>
            </div>
            
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-sos to-transparent"
              />
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="absolute bottom-16 text-[9px] font-black text-white/40 tracking-[0.6em] uppercase flex items-center gap-3"
          >
            <div className="w-8 h-[1px] bg-white/20" />
            RESILIENT NODE ACTIVE
            <div className="w-8 h-[1px] bg-white/20" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

