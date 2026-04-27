'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Alert, Profile } from '@/lib/types/app.types';
import { 
  X, MapPin, User, Shield, Clock, Zap, Navigation, 
  Phone, Mail, Calendar, Info, Activity, Compass,
  CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { StatusPill } from '../shared/StatusPill';
import { 
  formatDateTime, formatRelativeTime, getEmergencyIcon, 
  calculateDistance, formatDistance, getCompassDirection,
  calculateETA, formatETA
} from '@/lib/utils/formatters';
import dynamic from 'next/dynamic';

const AlertMapInner = dynamic(() => import('../alert/AlertMapInner'), { ssr: false });

interface AlertDetailsModalProps {
  alertId: string | null;
  onClose: () => void;
}

export const AlertDetailsModal = ({ alertId, onClose }: AlertDetailsModalProps) => {
  const supabase = createClient();
  const [alert, setAlert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!alertId) return;

    const fetchAlert = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          triggered_by:profiles!alerts_triggered_by_fkey(*),
          assigned_responder:profiles!alerts_assigned_responder_fkey(*),
          timeline:alert_timeline(*)
        `)
        .eq('id', alertId)
        .single();

      if (!error && data) {
        setAlert(data);
      }
      setLoading(false);
    };

    fetchAlert();

    // Real-time updates for this alert
    const channel = supabase
      .channel(`modal-alert-${alertId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts', filter: `id=eq.${alertId}` }, (payload) => {
        setAlert((prev: any) => ({ ...prev, ...payload.new }));
      })
      .on('broadcast', { event: 'location' }, (payload) => {
        setAlert((prev: any) => ({ 
          ...prev, 
          responder_lat: payload.payload.lat, 
          responder_lng: payload.payload.lng 
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [alertId, supabase]);

  const handleResolve = async () => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;
      toast.success('Alert resolved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve alert');
    }
  };

  if (!alertId) return null;

  const distance = alert?.responder_lat && alert?.location_lat 
    ? calculateDistance(alert.location_lat, alert.location_lng, alert.responder_lat, alert.responder_lng)
    : null;

  const direction = alert?.responder_lat && alert?.location_lat
    ? getCompassDirection(alert.responder_lat, alert.responder_lng, alert.location_lat, alert.location_lng)
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Side: Map & Location Info */}
          <div className="w-full md:w-2/3 h-1/2 md:h-full relative border-r border-[var(--border-default)]">
            {alert && (
              <AlertMapInner 
                userLocation={{ lat: alert.location_lat, lng: alert.location_lng }}
                responderLocation={alert.responder_lat ? { lat: alert.responder_lat, lng: alert.responder_lng } : undefined}
              />
            )}
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
              <div className="p-4 bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--border-default)] rounded-2xl flex items-center justify-between shadow-xl">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sos/20 flex items-center justify-center text-sos">
                       <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Emergency Location</div>
                       <div className="text-sm font-bold">{alert?.location_lat.toFixed(5)}, {alert?.location_lng.toFixed(5)}</div>
                    </div>
                 </div>
                 {distance !== null && (
                    <div className="flex flex-col items-end">
                       <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Responder Info</div>
                       <div className="flex items-center gap-2 text-sos font-extrabold">
                          <Compass className="w-4 h-4" />
                          <span>{formatDistance(distance)} · {direction}</span>
                       </div>
                       <div className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-widest">
                          ETA: {formatETA(calculateETA(distance))}
                       </div>
                    </div>
                 )}
              </div>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-sos border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-[var(--text-muted)]">Loading Alert Data...</span>
              </div>
            ) : alert ? (
              <>
                {/* Header */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="text-2xl font-extrabold font-syne text-sos">{alert.alert_code}</div>
                      <StatusPill status={alert.status} />
                   </div>
                   <div className="flex items-center gap-2 p-3 bg-sos/10 border border-sos/20 rounded-2xl">
                      <span className="text-2xl">{getEmergencyIcon(alert.emergency_type)}</span>
                      <div>
                         <div className="text-xs font-bold uppercase tracking-widest text-sos">{alert.emergency_type} Emergency</div>
                         <div className="text-[10px] text-sos/70">Triggered {formatRelativeTime(alert.created_at)}</div>
                      </div>
                   </div>
                </div>

                {/* Victim Info */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2">
                      <User className="w-3 h-3" /> Requester Info
                   </h4>
                   <div className="p-4 bg-[var(--bg-tertiary)]/50 rounded-2xl border border-[var(--border-default)] space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)] flex items-center justify-center font-bold text-xs">
                            {alert.triggered_by?.name?.charAt(0)}
                         </div>
                         <div className="font-bold text-sm">{alert.triggered_by?.name}</div>
                      </div>
                      <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-default)]">
                         <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <Phone className="w-3.5 h-3.5" /> {alert.triggered_by?.phone || 'No phone listed'}
                         </div>
                         <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <Mail className="w-3.5 h-3.5" /> {alert.triggered_by?.email}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Situation Description */}
                <div className="space-y-3">
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2">
                      <Info className="w-3.5 h-3.5" /> Situation Details
                   </h4>
                   <div className="p-5 bg-white/[0.02] border border-[var(--border-default)] rounded-2xl italic text-sm text-[var(--text-secondary)] leading-relaxed">
                      "{alert.description || 'No description provided by the user.'}"
                   </div>
                </div>

                {/* Responder Info */}
                {alert.assigned_responder && (
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-blue-400" /> Responder Assigned
                     </h4>
                     <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center font-bold text-blue-400 border border-blue-500/20">
                              {alert.assigned_responder.name.charAt(0)}
                           </div>
                           <div>
                              <div className="font-bold text-sm text-blue-400">{alert.assigned_responder.name}</div>
                              <div className="text-[10px] text-[var(--text-muted)]">{alert.assigned_responder.zone}</div>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="space-y-4 pt-4">
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" /> Event Timeline
                   </h4>
                   <div className="space-y-4 pl-4 border-l-2 border-[var(--border-default)]">
                      <div className="relative">
                         <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-sos border-4 border-[var(--bg-secondary)]" />
                         <div className="text-xs font-bold">Alert Triggered</div>
                         <div className="text-[10px] text-[var(--text-muted)]">{formatDateTime(alert.created_at)}</div>
                      </div>
                      {alert.accepted_at && (
                        <div className="relative">
                           <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-[var(--bg-secondary)]" />
                           <div className="text-xs font-bold">Responder Assigned</div>
                           <div className="text-[10px] text-[var(--text-muted)]">{formatDateTime(alert.accepted_at)}</div>
                        </div>
                      )}
                      {alert.resolved_at && (
                        <div className="relative">
                           <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-green-500 border-4 border-[var(--bg-secondary)]" />
                           <div className="text-xs font-bold">Emergency Resolved</div>
                           <div className="text-[10px] text-[var(--text-muted)]">{formatDateTime(alert.resolved_at)}</div>
                        </div>
                      )}
                   </div>
                </div>

                {/* Technical Info */}
                <div className="pt-6 border-t border-[var(--border-default)] flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-1.5">
                      {alert.routing_mode === 'cloud' ? <Zap className="w-3 h-3 text-blue-400" /> : <Navigation className="w-3 h-3 text-orange-400" />}
                      {alert.routing_mode} Network
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      ID: {alert.id.slice(0, 8)}
                   </div>
                </div>

                {/* Admin Actions */}
                {alert.status !== 'resolved' && alert.status !== 'cancelled' && (
                  <div className="pt-6">
                    <button 
                      onClick={handleResolve}
                      className="w-full py-4 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Mark as Resolved
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-[var(--text-muted)] italic">
                 Alert not found or has been deleted.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
