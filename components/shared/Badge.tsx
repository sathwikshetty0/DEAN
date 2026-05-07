'use client';

import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'glass' | 'sos';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  dot = false,
}: BadgeProps) => {
  const variants = {
    primary: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    secondary: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    outline: 'bg-transparent text-white/60 border-white/10',
    glass: 'bg-white/5 text-white/80 border-white/10 backdrop-blur-md',
    sos: 'bg-sos/10 text-sos border-sos/20 shadow-[0_0_15px_rgba(255,45,85,0.1)]',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[8px]',
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-1 text-[10px]',
    lg: 'px-3 py-1.5 text-[11px]',
  };

  const dotColors = {
    primary: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    secondary: 'bg-gray-500 shadow-[0_0_8px_rgba(107,114,128,0.5)]',
    success: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    danger: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    warning: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    info: 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]',
    outline: 'bg-white/40',
    glass: 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]',
    sos: 'bg-sos shadow-[0_0_10px_rgba(255,45,85,0.6)]',
  };

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 font-black uppercase tracking-wider rounded-full border transition-all duration-300',
      variants[variant],
      sizes[size],
      className
    )}>
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse shrink-0', dotColors[variant])} />
      )}
      <span className="truncate max-w-[120px]">{children}</span>
    </span>
  );
};

