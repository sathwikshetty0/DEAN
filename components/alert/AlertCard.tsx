'use client';

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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden hover:border-[var(--red-sos)]/30 transition-all group"
    >
      {/* Header */}
      <div className="p-5 border-b border-[var(--border-default)] bg-gradient-to-r from-[var(--bg-tertiary)] to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getEmergencyIcon(alert.emergency_type)}</span>
          <div>
            <h4 className="font-extrabold font-syne uppercase tracking-wider text-sm">
              {alert.emergency_type} Emergency
            </h4>
            <p className="text-[10px] text-[var(--text-muted)] font-bold">{alert.alert_code}</p>
          </div>
        </div>
        <div className={clsx(
          'flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border',
          alert.routing_mode === 'cloud'
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
        )}>
          {alert.routing_mode === 'cloud' ? <Zap className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
          {alert.routing_mode.toUpperCase()}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
              <MapPin className="w-4 h-4 text-[var(--red-sos)]" />
              <span className="font-bold">{alert.location_address ?? `${alert.location_lat.toFixed(4)}, ${alert.location_lng.toFixed(4)}`}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
              &quot;{alert.description || 'No description provided.'}&quot;
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            {distance !== null && (
              <div className="text-xs font-bold text-[var(--red-sos)]">↔ ~{formatDistance(distance)}</div>
            )}
            <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 justify-end mt-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(alert.created_at)}
            </div>
          </div>
        </div>

        {!compact && (
          <div className="rounded-xl overflow-hidden border border-[var(--border-default)] h-24">
            <AlertMap userLocation={{ lat: alert.location_lat, lng: alert.location_lng }} size="small" />
          </div>
        )}

        {(onAccept || onDecline) && (
          <div className="grid grid-cols-2 gap-3">
            {onAccept && (
              <button
                onClick={() => onAccept(alert.id)}
                className="py-3 rounded-xl bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <Check className="w-4 h-4" /> Accept Alert
              </button>
            )}
            {onDecline && (
              <button
                onClick={() => onDecline(alert.id)}
                className="py-3 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--bg-elevated)] transition-colors"
              >
                <X className="w-4 h-4" /> Decline
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
