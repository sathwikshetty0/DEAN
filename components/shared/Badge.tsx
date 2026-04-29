'use client';

import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
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
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-1 text-[10px]',
    lg: 'px-3 py-1.5 text-[11px]',
  };

  const dotColors = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-emerald-500',
    danger: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    outline: 'bg-white/40',
  };

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 font-black uppercase tracking-wider rounded-full border',
      variants[variant],
      sizes[size],
      className
    )}>
      {dot && (
        <span className={clsx('w-1 h-1 rounded-full animate-pulse', dotColors[variant])} />
      )}
      {children}
    </span>
  );
};
