'use client';

import { AlertCircle, CheckCircle2, Clock, MapPin, XCircle } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:   { label: 'Pending',  color: '#FF2D55', bg: '#FF2D5520', icon: <AlertCircle className="w-3 h-3" /> },
  accepted:  { label: 'Accepted', color: '#F59E0B', bg: '#F59E0B20', icon: <Clock className="w-3 h-3" /> },
  en_route:  { label: 'En Route', color: '#3B82F6', bg: '#3B82F620', icon: <MapPin className="w-3 h-3" /> },
  resolved:  { label: 'Resolved', color: '#10B981', bg: '#10B98120', icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled: { label: 'Cancelled',color: '#475569', bg: '#47556920', icon: <XCircle className="w-3 h-3" /> },
};

interface StatusPillProps {
  status: AlertStatus;
}

import { motion } from 'framer-motion';

export const StatusPill = ({ status }: StatusPillProps) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.cancelled;
  const isPending = status === 'pending';

  return (
    <motion.span 
      initial={isPending ? { opacity: 0.8, scale: 0.95 } : {}}
      animate={isPending ? { 
        opacity: [0.8, 1, 0.8],
        scale: [0.98, 1, 0.98],
      } : {}}
      transition={isPending ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/5 flex items-center gap-1.5 w-fit shadow-sm"
      style={{ 
        backgroundColor: config.bg,
        color: config.color,
        boxShadow: isPending ? `0 0 12px ${config.color}30` : 'none'
      }}
    >
      {config.icon}
      {config.label}
    </motion.span>
  );
};
