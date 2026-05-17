'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Siren, History, Phone } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/') return null;

  const actions = [
    { icon: Siren, label: 'SOS', onClick: () => router.push('/sos'), color: 'bg-[var(--red-sos)]' },
    { icon: History, label: 'History', onClick: () => router.push('/dashboard/history'), color: 'bg-blue-500' },
    { icon: Phone, label: 'Call 112', onClick: () => { window.location.href = 'tel:112'; }, color: 'bg-green-500' },
  ];

  return (
    <div className="fixed bottom-24 right-6 z-[100] md:hidden">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col-reverse gap-3 mb-4">
            {actions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                type="button"
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 group"
              >
                <span className="px-3 py-1 bg-[var(--bg-secondary)]/95 backdrop-blur-md border border-[var(--border-default)] rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-[var(--red-sos)] rotate-45' : 'bg-[var(--bg-secondary)] border border-[var(--border-default)]'}`}
      >
        <Plus className="w-6 h-6 text-white transition-transform duration-500" />
      </motion.button>
    </div>
  );
};
