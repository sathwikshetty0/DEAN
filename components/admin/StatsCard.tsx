'use client';

/**
 * @fileoverview UI Component for StatsCard
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  trend?: string;
  delay?: number;
}

export const StatsCard = ({ label, value, icon: Icon, color, trend, delay = 0 }: StatsCardProps) => {
  const bgClass = color.replace('text-', 'bg-').replace(/\d+/, (match) => `${match}/10`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="bg-[var(--bg-secondary)]/50 backdrop-blur-xl border border-[var(--border-default)] p-6 rounded-[2rem] relative overflow-hidden group shadow-xl shadow-black/5"
    >
      <div className={clsx('absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 blur-2xl', bgClass)} />
      
      <div className="flex items-center justify-between mb-6">
        <div className={clsx('p-4 rounded-2xl border border-white/5 shadow-inner', bgClass)}>
          <Icon className={clsx('w-6 h-6', color)} />
        </div>
        {trend && (
          <div className="px-3 py-1 bg-green-500/10 rounded-full text-[10px] text-green-500 font-black uppercase tracking-widest border border-green-500/20">
            {trend}
          </div>
        )}
      </div>

      <div className="space-y-1 relative z-10">
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</div>
        <div className="text-5xl font-extrabold font-syne tracking-tight group-hover:text-[var(--red-sos)] transition-colors duration-300">
          {value}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--red-sos)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};


// Added for debugging purposes
StatsCard.displayName = 'StatsCard';


export const getStatTooltipText = (label: string) => Display metrics related to ;