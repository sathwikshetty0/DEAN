'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
}

/**
 * A highly polished glassmorphism card component with motion and hover effects.
 * Uses CSS variables from the global design system for consistent styling.
 */
export const GlassCard = ({ 
  children, 
  className, 
  hover = true, 
  onClick, 
  delay = 0 
}: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      onClick={onClick}
      className={clsx(
        "glass-card p-6 rounded-[2rem] transition-all duration-500",
        hover && "glass-card-hover hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
    </motion.div>
  );
};
