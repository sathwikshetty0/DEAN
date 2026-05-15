'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmModal = ({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  // Use a ref to prevent interactions during loading
  const isActionDisabled = loading;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !isActionDisabled) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel, isActionDisabled]);

  return (
    <AnimatePresence>
      {open && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={!isActionDisabled ? onCancel : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 350,
              damping: 30
            }}
            className="relative bg-[#0F1117] border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${
              variant === 'danger' ? 'bg-sos' : 'bg-blue-500'
            }`} />

            {!isActionDisabled && (
              <button
                onClick={onCancel}
                aria-label="Close modal"
                className="absolute top-6 right-6 p-2.5 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center mb-8 ${
                variant === 'danger' 
                  ? 'bg-sos/10 border border-sos/20 shadow-[0_0_30px_rgba(255,45,85,0.15)]' 
                  : 'bg-blue-500/10 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
              }`}>
                <AlertTriangle className={`w-10 h-10 ${variant === 'danger' ? 'text-sos' : 'text-blue-500'}`} />
              </div>

              <h3 id="modal-title" className="text-3xl font-black font-syne tracking-tight mb-3 text-white">{title}</h3>
              <p id="modal-description" className="text-white/50 leading-relaxed text-[13px] font-medium mb-12 px-2">{description}</p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={onCancel}
                  disabled={isActionDisabled}
                  className="flex-1 py-4.5 rounded-2xl bg-white/5 border border-white/10 font-bold text-[13px] text-white hover:bg-white/10 transition-all active:scale-[0.98] outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  autoFocus
                  disabled={isActionDisabled}
                  className={`flex-1 py-4.5 rounded-2xl font-black text-[13px] text-white transition-all active:scale-[0.98] shadow-xl outline-none focus:ring-2 flex items-center justify-center gap-2 ${
                    variant === 'danger'
                      ? 'bg-sos hover:bg-[#CC0033] shadow-sos/30 focus:ring-sos/50'
                      : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30 focus:ring-blue-500/50'
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                  {loading ? 'Processing...' : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

