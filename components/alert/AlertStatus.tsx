'use client';

import React from 'react';
import { Alert, Profile } from '@/lib/types/app.types';
import { StatusPill } from '@/components/shared/StatusPill';
import { AlertTimeline } from '@/components/alert/AlertTimeline';
import { AlertMap } from '@/components/alert/AlertMap';
import { getEmergencyIcon } from '@/lib/utils/formatters';
import { Navigation, Shield } from 'lucide-react';

interface AlertStatusDisplayProps {
  alert: Alert;
  responderPosition?: { lat: number; lng: number } | null;
  responderProfile?: Partial<Profile> | null;
  onCancel?: () => void;
}

export const AlertStatusDisplay = ({
  alert,
  responderPosition,
  responderProfile,
  onCancel,
}: AlertStatusDisplayProps) => {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--red-sos)]/20 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[var(--red-sos)]/10 p-6 border-b border-[var(--red-sos)]/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--red-sos)] flex items-center justify-center text-2xl animate-pulse">
            {getEmergencyIcon(alert.emergency_type)}
          </div>
          <div>
            <h3 className="font-extrabold font-syne uppercase tracking-wider">
              {alert.emergency_type} Emergency
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[var(--text-secondary)] font-medium">{alert.alert_code}</span>
              <StatusPill status={alert.status} />
            </div>
          </div>
        </div>
        {alert.routing_mode === 'p2p' && (
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-orange-400">
            <Navigation className="w-3 h-3" /> P2P ACTIVE
          </div>
        )}
      </div>

      <div className="p-8 space-y-8">
        {/* Timeline */}
        <AlertTimeline
          status={alert.status}
          createdAt={alert.created_at}
          acceptedAt={alert.accepted_at}
          enRouteAt={alert.en_route_at}
          resolvedAt={alert.resolved_at}
          cancelledAt={alert.cancelled_at}
        />

        {/* Map */}
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden shadow-inner">
          <AlertMap
            userLocation={{ lat: alert.location_lat, lng: alert.location_lng }}
            responderLocation={
              responderPosition ??
              (alert.responder_lat != null ? { lat: alert.responder_lat, lng: alert.responder_lng! } : null)
            }
            size="large"
          />
        </div>

        {/* Responder Info */}
        {alert.status !== 'pending' && alert.assigned_responder && (
          <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-default)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">
                  Assigned Responder
                </div>
                <div className="font-bold">{responderProfile?.name ?? 'Responder'}</div>
                {responderProfile?.skills && responderProfile.skills.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {responderProfile.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[var(--bg-primary)] rounded text-[9px] text-[var(--text-muted)]">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cancel */}
        {onCancel && alert.status !== 'resolved' && alert.status !== 'cancelled' && (
          <button
            onClick={onCancel}
            className="w-full py-4 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-bold rounded-2xl hover:bg-red-500/10 hover:text-red-400 transition-all border border-[var(--border-default)]"
          >
            Cancel Alert
          </button>
        )}
      </div>
    </div>
  );
};
