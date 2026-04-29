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
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="relative bg-[#121212] border border-white/10 rounded-[2rem] p-8 max-w-md w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 left-0 w-full h-1 ${
              variant === 'danger' ? 'bg-red-500' : 'bg-blue-500'
            }`} />

            <button
              onClick={onCancel}
              className="absolute top-6 right-6 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-4">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${
                variant === 'danger' 
                  ? 'bg-red-500/10 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
                  : 'bg-blue-500/10 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
              }`}>
                <AlertTriangle className={`w-10 h-10 ${variant === 'danger' ? 'text-red-500' : 'text-blue-500'}`} />
              </div>

              <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">{title}</h3>
              <p className="text-white/60 leading-relaxed mb-10">{description}</p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={onCancel}
                  className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 font-semibold text-sm text-white hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-4 rounded-2xl font-semibold text-sm text-white transition-all active:scale-[0.98] shadow-lg ${
                    variant === 'danger'
                      ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                      : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
