'use client';

/**
 * @fileoverview UI Component for Badge
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'glass' | 'sos';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

import { motion } from 'framer-motion';

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  dot = false,
}: BadgeProps) => {
  const variants = {
    primary: 'bg-blue-500/5 text-blue-400 border-blue-500/20 shadow-blue-500/5',
    secondary: 'bg-white/5 text-white/40 border-white/10',
    success: 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5',
    danger: 'bg-red-500/5 text-red-400 border-red-500/20 shadow-red-500/5',
    warning: 'bg-amber-500/5 text-amber-400 border-amber-500/20 shadow-amber-500/5',
    info: 'bg-sky-500/5 text-sky-400 border-sky-500/20 shadow-sky-500/5',
    outline: 'bg-transparent text-white/60 border-white/10 hover:border-white/20',
    glass: 'bg-white/[0.03] text-white/80 border-white/10 backdrop-blur-xl',
    sos: 'bg-sos/5 text-sos border-sos/20 shadow-[0_0_20px_rgba(255,45,85,0.05)]',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[8px]',
    sm: 'px-2.5 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[10px]',
    lg: 'px-4 py-1.5 text-[11px]',
  };

  const dotColors = {
    primary: 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    secondary: 'bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.2)]',
    success: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    danger: 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    warning: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    info: 'bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.5)]',
    outline: 'bg-white/40',
    glass: 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]',
    sos: 'bg-sos shadow-[0_0_12px_rgba(255,45,85,0.7)]',
  };

  return (
    <motion.span 
      layout
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(
        'inline-flex items-center gap-2 font-black uppercase tracking-[0.15em] rounded-full border transition-all duration-500 select-none shadow-sm',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className="relative flex w-1.5 h-1.5">
          <span className={clsx('absolute inset-0 rounded-full animate-ping opacity-40', dotColors[variant])} />
          <span className={clsx('relative w-1.5 h-1.5 rounded-full', dotColors[variant])} />
        </span>
      )}
      <span className="truncate max-w-[150px]">{children}</span>
    </motion.span>
  );
};



// Added for debugging purposes
Badge.displayName = 'Badge';
