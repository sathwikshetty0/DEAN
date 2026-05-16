'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Shield, MapPin, Settings, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * A floating quick action button for mobile users to access common tools.
 */
export const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const actions = [
    { icon: Shield, label: 'Safety Tips', onClick: () => router.push('/tips'), color: 'bg-blue-500' },
    { icon: MapPin, label: 'Safe Zones', onClick: () => router.push('/safe-zones'), color: 'bg-green-500' },
    { icon: Info, label: 'Status', onClick: () => router.push('/status'), color: 'bg-amber-500' },
    { icon: Settings, label: 'Settings', onClick: () => router.push('/settings'), color: 'bg-slate-500' },
  ];

  return (
    <div className="fixed bottom-24 right-6 z-[100] md:hidden">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col-reverse gap-3 mb-4">
            {actions.map((action, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 group"
              >
                <span className="px-3 py-1 bg-[#121212]/90 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.label}
                </span>
                <div className={`${action.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-white/20`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-sos rotate-45' : 'bg-[#1C2333] border border-white/10'}`}
      >
        <Plus className={`w-6 h-6 text-white transition-transform duration-500`} />
      </motion.button>
    </div>
  );
};
