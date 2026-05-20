'use client';

/**
 * @fileoverview UI Component for AlertCard
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React from 'react';
import { Alert, Profile } from '@/lib/types/app.types';
import { StatusPill } from '@/components/shared/StatusPill';
import { AlertMap } from '@/components/alert/AlertMap';
import { formatRelativeTime, getEmergencyIcon, getModeLabel } from '@/lib/utils/formatters';
import { formatDistance, calculateDistance } from '@/lib/utils/geolocation';
import { MapPin, Clock, Check, X, Zap, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface AlertCardProps {
  alert: Alert & { triggered_by?: Partial<Profile> };
  userPosition?: { lat: number; lng: number } | null;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  compact?: boolean;
}

export const AlertCard = ({ alert, userPosition, onAccept, onDecline, compact }: AlertCardProps) => {
  const distance = userPosition
    ? calculateDistance(userPosition.lat, userPosition.lng, alert.location_lat, alert.location_lng)
    : null;

  const userName = (alert.triggered_by as Partial<Profile> | undefined)?.name ?? 'Unknown User';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-[#121212] border border-white/5 rounded-[2rem] overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all group relative"
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-sos/5 blur-[80px] group-hover:bg-sos/10 transition-all" />

      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 transition-transform">
            {getEmergencyIcon(alert.emergency_type)}
          </div>
          <div>
            <h4 className="font-bold text-white tracking-tight">
              {alert.emergency_type.charAt(0).toUpperCase() + alert.emergency_type.slice(1)} Emergency
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-white/40 font-mono font-bold tracking-widest uppercase">{alert.alert_code}</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-sos">
                 <Clock className="w-2.5 h-2.5" /> {formatRelativeTime(alert.created_at)}
              </div>
            </div>
          </div>
        </div>
        <StatusPill status={alert.status} />
      </div>

      {/* Body */}
      <div className="p-6 space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <div className="w-8 h-8 rounded-full bg-sos/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-sos" />
              </div>
              <span className="font-medium leading-tight">
                {alert.location_address ?? `${alert.location_lat.toFixed(4)}, ${alert.location_lng.toFixed(4)}`}
              </span>
            </div>
            {distance !== null && (
              <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black text-white/60 whitespace-nowrap">
                 ~{formatDistance(distance)} AWAY
              </div>
            )}
          </div>
          
          <p className="text-xs text-white/50 leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5">
            &quot;{alert.description || 'No additional details provided for this emergency.'}&quot;
          </p>
        </div>

        {!compact && (
          <div className="rounded-[1.5rem] overflow-hidden border border-white/5 h-32 relative group/map">
            <AlertMap userLocation={{ lat: alert.location_lat, lng: alert.location_lng }} size="small" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        )}

        {(onAccept || onDecline) && (
          <div className="flex gap-3 pt-2">
            {onDecline && (
              <button
                onClick={() => onDecline(alert.id)}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {onAccept && (
              <button
                onClick={() => onAccept(alert.id)}
                className="flex-1 py-4 rounded-2xl bg-blue-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
              >
                <Check className="w-4 h-4" /> Accept Rescue Mission
              </button>
            )}
          </div>
        )}
      </div>

      {/* Routing Badge */}
      <div className="absolute bottom-4 right-6 flex items-center gap-2">
        {alert.routing_mode === 'p2p' && (
          <div className={clsx(
            'text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-sm border uppercase',
            alert.is_synced ? 'text-green-500 border-green-500/20' : 'text-sos border-sos/20 animate-pulse'
          )}>
            {alert.is_synced ? 'Synced' : 'Local Only'}
          </div>
        )}
        <div className={clsx(
          'text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded-md border',
          alert.routing_mode === 'cloud'
            ? 'text-blue-500 border-blue-500/20'
            : 'text-amber-500 border-amber-500/20'
        )}>
          {alert.routing_mode}
        </div>
      </div>
    </motion.div>
  );
};


// Added for debugging purposes
AlertCard.displayName = 'AlertCard';
