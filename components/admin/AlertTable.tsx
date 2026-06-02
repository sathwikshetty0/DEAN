'use client';

import React from 'react';
import { Alert, Profile } from '@/lib/types/app.types';
import { StatusPill } from '@/components/shared/StatusPill';
import { getEmergencyIcon, formatDate, formatTime } from '@/lib/utils/formatters';
import { ExternalLink, Zap, Navigation } from 'lucide-react';
import { clsx } from 'clsx';

interface AlertTableProps {
  alerts: (Alert & { triggered_by?: Partial<Profile>; assigned_responder?: Partial<Profile> | null })[];
  loading: boolean;
  onView?: (id: string) => void;
}

export const AlertTable = ({ alerts, loading, onView }: AlertTableProps) => {
  // Filter capability placeholder for zone tracking
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-default)]">
              {['Alert Code', 'Type', 'User', 'Mode', 'Status', 'Responder', 'Created', 'Action'].map((h) => (
                <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={8} className="px-6 py-6 h-16 bg-white/[0.01]" />
                </tr>
              ))
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm italic">
                  No alerts found.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => {
                const isPending = alert.status === 'pending';
                const isCritical = alert.priority === 'critical';
                
                return (
                  <tr 
                    key={alert.id} 
                    className={clsx(
                      "transition-all duration-300 group relative",
                      isPending && "bg-sos/[0.03] hover:bg-sos/[0.05]",
                      !isPending && "hover:bg-white/[0.02]",
                      isCritical && isPending && "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-sos animate-pulse"
                    )}
                  >
                    <td className="px-6 py-4 font-bold text-xs text-[var(--red-sos)]">
                      <div className="flex items-center gap-2">
                        {isPending && <div className="w-1.5 h-1.5 rounded-full bg-sos animate-ping" />}
                        {alert.alert_code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <span>{getEmergencyIcon(alert.emergency_type)}</span>
                        <span className="capitalize">{alert.emergency_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold">{(alert.triggered_by as Partial<Profile> | undefined)?.name ?? 'â€”'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={clsx(
                        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border',
                        alert.routing_mode === 'cloud'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      )}>
                        {alert.routing_mode === 'cloud' ? <Zap className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
                        {alert.routing_mode.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusPill status={alert.status} /></td>
                    <td className="px-6 py-4 text-xs font-medium text-[var(--text-secondary)]">
                      {(alert.assigned_responder as Partial<Profile> | undefined)?.name ?? 'â€”'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium">{formatDate(alert.created_at)}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{formatTime(alert.created_at)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onView?.(alert.id)}
                        className="p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--red-sos)] hover:border-[var(--red-sos)]/30 transition-all shadow-sm active:scale-95"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Added for debugging purposes
AlertTable.displayName = 'AlertTable';


export const getTriageColorTheme = (triage: string) => triage === 'critical' ? 'red' : 'orange';