'use client';

/**
 * @fileoverview UI Component for page
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Alert } from '@/lib/types/app.types';
import { AlertMap } from '@/components/alert/AlertMap';
import { StatusPill } from '@/components/shared/StatusPill';
import { broadcastResponderLocation } from '@/hooks/useSupabaseRealtime';
import { toast } from 'react-hot-toast';
import { Navigation, CheckCircle, Clock, MapPin, Phone, MessageSquare, AlertTriangle, ChevronLeft } from 'lucide-react';
import { 
  formatDateTime, formatRelativeTime, 
  calculateDistance, formatDistance, 
  calculateETA, formatETA, 
  getCompassDirection 
} from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function MissionPage() {
  const searchParams = useSearchParams();
  const alertId = searchParams.get('id');
  const router = useRouter();
  const { profile } = useAuth();
  const supabase = createClient();

  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState('00:00');
  const [currentPos, setCurrentPos] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (!alertId) {
      router.push('/responder');
      return;
    }

    const fetchAlert = async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*, triggered_by:profiles!alerts_triggered_by_fkey(*)')
        .eq('id', alertId)
        .single();

      if (!error && data) {
        setAlert(data as any);
      }
      setLoading(false);
    };

    fetchAlert();

    // Mission Timer
    const interval = setInterval(() => {
      if (alert?.accepted_at) {
        const start = new Date(alert.accepted_at).getTime();
        const now = new Date().getTime();
        const diff = now - start;
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimer(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);

    // Watch location and broadcast
    const watchId = navigator.geolocation.watchPosition((pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setCurrentPos(coords);
      broadcastResponderLocation(alertId!, coords.lat, coords.lng);
    });

    return () => {
      clearInterval(interval);
      navigator.geolocation.clearWatch(watchId);
    };
  }, [alertId, alert?.accepted_at, supabase, router]);

  const updateStatus = async (status: 'en_route' | 'resolved') => {
    try {
      const res = await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status,
          responder_lat: currentPos?.lat,
          responder_lng: currentPos?.lng
        }),
      });
      
      if (res.ok) {
        setAlert(prev => prev ? { ...prev, status } : null);
        toast.success(status === 'resolved' ? 'Mission completed!' : 'Status updated');
        if (status === 'resolved') router.push('/responder');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Clock className="w-10 h-10 animate-spin text-sos" /></div>;
  if (!alert) return <div>Alert not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => router.push('/responder')}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-bold"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Alerts
      </button>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-blue-500/10 p-6 border-b border-blue-500/20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                 <Navigation className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="font-extrabold font-syne uppercase tracking-wider text-sm">Active Mission: {alert.alert_code}</h2>
                 <div className="flex items-center gap-2 mt-1">
                    <StatusPill status={alert.status} />
                    <span className="text-[10px] text-[var(--text-muted)] font-bold flex items-center gap-1">
                       <Clock className="w-3 h-3" /> Duration: {timer}
                    </span>
                 </div>
              </div>
           </div>
           <div className="text-right">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Priority</div>
              <div className="text-sos font-extrabold font-syne">HIGH</div>
           </div>
        </div>

        <div className="p-8 space-y-8">
            {/* Map */}
            <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden h-[300px] shadow-inner relative">
               <AlertMap 
                 userLocation={{ lat: alert.location_lat, lng: alert.location_lng }}
                 responderLocation={currentPos}
                 size="large"
               />
               
               {/* Floating Route Info */}
               {currentPos && (
                 <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-4 pointer-events-none">
                    <div className="bg-[var(--bg-secondary)]/90 backdrop-blur-md p-3 rounded-2xl border border-[var(--border-default)] shadow-xl flex items-center gap-4 pointer-events-auto">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Distance</span>
                          <span className="text-sm font-extrabold text-sos flex items-center gap-1">
                             <Navigation className="w-3.5 h-3.5" /> {formatDistance(calculateDistance(alert.location_lat, alert.location_lng, currentPos.lat, currentPos.lng))}
                          </span>
                       </div>
                       <div className="w-px h-8 bg-[var(--border-default)]" />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">ETA</span>
                          <span className="text-sm font-extrabold text-blue-400">
                             {formatETA(calculateETA(calculateDistance(alert.location_lat, alert.location_lng, currentPos.lat, currentPos.lng)))}
                          </span>
                       </div>
                       <div className="w-px h-8 bg-[var(--border-default)]" />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Dir</span>
                          <span className="text-sm font-extrabold text-orange-400">
                             {getCompassDirection(currentPos.lat, currentPos.lng, alert.location_lat, alert.location_lng)}
                          </span>
                       </div>
                    </div>
                    <div className="bg-sos/90 backdrop-blur-md p-3 rounded-2xl border border-sos/20 shadow-xl pointer-events-auto flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                       <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Routing</span>
                    </div>
                 </div>
               )}

               <div className="absolute bottom-4 right-4 bg-[var(--bg-primary)]/80 backdrop-blur-md p-3 rounded-xl border border-[var(--border-default)] text-[10px] font-bold space-y-2">
                  <div className="flex items-center gap-2 text-sos">
                     <div className="w-2 h-2 rounded-full bg-sos" /> Distressed User
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                     <div className="w-2 h-2 rounded-full bg-blue-400" /> You (Live)
                  </div>
               </div>
            </div>

           {/* User & Mission Details */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                 <div className="bg-[var(--bg-tertiary)] p-6 rounded-2xl border border-[var(--border-default)]">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Distressed Person</h4>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-sos/10 flex items-center justify-center font-bold text-sos">
                          {(alert.triggered_by as any)?.name?.charAt(0) || 'U'}
                       </div>
                       <div>
                          <div className="font-bold">{(alert.triggered_by as any)?.name}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{(alert.triggered_by as any)?.email}</div>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-6">
                       <button className="flex items-center justify-center gap-2 py-2 bg-blue-500/10 text-blue-400 rounded-xl text-xs font-bold border border-blue-500/20">
                          <Phone className="w-3 h-3" /> Call
                       </button>
                       <button className="flex items-center justify-center gap-2 py-2 bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-xl text-xs font-bold border border-[var(--border-default)]">
                          <MessageSquare className="w-3 h-3" /> Message
                       </button>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-[var(--bg-tertiary)] p-6 rounded-2xl border border-[var(--border-default)]">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Emergency Context</h4>
                    <div className="flex items-center gap-3 mb-4">
                       <span className="text-2xl">{alert.emergency_type === 'medical' ? '🏥' : '🔥'}</span>
                       <span className="font-bold text-sm uppercase">{alert.emergency_type}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] p-4 rounded-xl italic">
                       "{alert.description || 'No additional details provided.'}"
                    </p>
                 </div>
              </div>
           </div>

           {/* Controls */}
           <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[var(--border-default)]">
              {alert.status === 'accepted' && (
                <button 
                  onClick={() => updateStatus('en_route')}
                  className="flex-1 py-4 bg-orange-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <Navigation className="w-5 h-5" /> I'M EN ROUTE
                </button>
              )}
              {alert.status === 'en_route' && (
                <button 
                  onClick={() => updateStatus('resolved')}
                  className="flex-1 py-4 bg-green-500 text-white font-extrabold rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <CheckCircle className="w-5 h-5" /> MARK AS RESOLVED
                </button>
              )}
              <button className="px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl border border-red-500/20 flex items-center justify-center gap-2">
                 <AlertTriangle className="w-5 h-5" /> EMERGENCY HELP
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
