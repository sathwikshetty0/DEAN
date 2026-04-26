'use client';

import React from 'react';
import { AlertStatus } from '@/lib/types/app.types';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',  color: '#FF2D55', bg: '#FF2D5520' },
  accepted:  { label: 'Accepted', color: '#F59E0B', bg: '#F59E0B20' },
  en_route:  { label: 'En Route', color: '#3B82F6', bg: '#3B82F620' },
  resolved:  { label: 'Resolved', color: '#10B981', bg: '#10B98120' },
  cancelled: { label: 'Cancelled',color: '#475569', bg: '#47556920' },
};

interface StatusPillProps {
  status: AlertStatus;
}

export const StatusPill = ({ status }: StatusPillProps) => {
  const config = STATUS_CONFIG[status];

  return (
    <span 
      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/5"
      style={{ 
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
};
