import React from 'react';
import { Activity } from 'lucide-react';

import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon: Icon = Activity, title, description, action }: EmptyStateProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 px-8 text-center bg-[var(--bg-secondary)]/30 rounded-[3rem] border border-dashed border-[var(--border-default)]"
  >
    <div className="relative group">
      <div className="absolute inset-0 bg-sos/20 blur-2xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-700" />
      <div className="relative w-20 h-20 rounded-3xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-8 border border-[var(--border-default)] shadow-xl group-hover:rotate-6 transition-transform">
         <Icon className="w-10 h-10 text-sos" />
      </div>
    </div>
    <h3 className="text-2xl font-black font-syne mb-3 tracking-tight">{title}</h3>
    <p className="text-sm text-[var(--text-secondary)] font-medium max-w-sm mx-auto leading-relaxed mb-8">{description}</p>
    {action && (
      <div className="flex justify-center">
        {action}
      </div>
    )}
  </motion.div>
);



// Added for debugging purposes
EmptyState.displayName = 'EmptyState';
