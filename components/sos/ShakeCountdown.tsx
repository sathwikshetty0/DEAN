'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X } from 'lucide-react';

interface ShakeCountdownProps {
  seconds: number | null;
  onCancel: () => void;
}

export const ShakeCountdown = ({ seconds, onCancel }: ShakeCountdownProps) => {
  return (
    <AnimatePresence>
      {seconds !== null && seconds > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="text-center max-w-sm px-8"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--red-sos)]/20 flex items-center justify-center border border-[var(--red-sos)]/40">
              <Smartphone className="w-8 h-8 text-[var(--red-sos)] animate-pulse" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-2">
              Shake detected
            </p>
            <motion.p
              key={seconds}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-black font-syne text-[var(--red-sos)] drop-shadow-[0_0_40px_var(--red-glow)]"
            >
              {seconds}
            </motion.p>
            <p className="text-sm text-[var(--text-secondary)] mt-4 mb-8">
              SOS will broadcast automatically unless you cancel
            </p>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-sm font-bold hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
