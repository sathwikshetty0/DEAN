'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNetwork } from '@/context/NetworkContext';
import { useAlertStream } from '@/hooks/useSupabaseRealtime';
import { createClient } from '@/lib/supabase/client';
import { Alert, Profile } from '@/lib/types/app.types';
import { StatusPill } from '@/components/shared/StatusPill';
import { AlertMap } from '@/components/alert/AlertMap';
import { toast } from 'react-hot-toast';
import { Activity, Shield, MapPin, Clock, Check, X, Navigation, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

export default function ResponderDashboard() {
  const { profile } = useAuth();
  const { mode } = useNetwork();
  const router = useRouter();
  const supabase = createClient();

  const [isAvailable, setIsAvailable] = useState(profile?.is_available ?? true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 24,
    thisWeek: 5,
    avgResponse: '4m 20s',
    successRate: '98%'
  });

  useEffect(() => {
    const fetchPendingAlerts = async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          triggered_by:profiles!alerts_triggered_by_fkey(name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAlerts(data as any);
      }
      setLoading(false);
    };

    fetchPendingAlerts();
  }, [supabase]);

  // Subscribe to new alerts
  useAlertStream((newAlert) => {
    if (isAvailable) {
      setAlerts(prev => [newAlert, ...prev]);
    }
  });

  const toggleAvailability = async () => {
    const newVal = !isAvailable;
    setIsAvailable(newVal);
    
    try {
      const res = await fetch('/api/auth/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: newVal }),
      });
      if (res.ok) {
        toast.success(newVal ? 'You are now AVAILABLE' : 'Availability paused');
      }
    } catch (err) {
      toast.error('Failed to update status');
      setIsAvailable(!newVal);
    }
  };

  const handleAccept = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      
      if (res.ok) {
        toast.success('Alert Accepted! Starting mission.');
        router.push(`/responder/mission?id=${alertId}`);
      }
    } catch (err) {
      toast.error('Failed to accept alert');
    }
  };

  return (
    <div className="space-y-8">
      {/* Availability Header */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
           <div className={clsx(
             "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
             isAvailable ? "bg-green-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-[var(--bg-tertiary)]"
           )}>
             {isAvailable ? <Zap className="w-6 h-6 text-white fill-white" /> : <Clock className="w-6 h-6 text-[var(--text-muted)]" />}
           </div>
           <div>
             <h2 className="text-xl font-extrabold font-syne">Availability Status</h2>
             <p className="text-xs text-[var(--text-secondary)]">Toggle to receive emergency alerts in your zone.</p>
           </div>
        </div>

        <button 
          onClick={toggleAvailability}
          className={clsx(
            "px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2",
            isAvailable 
              ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20" 
              : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-default)] hover:bg-[var(--bg-elevated)]"
          )}
        >
          {isAvailable ? (
            <><Check className="w-4 h-4" /> ⚡ AVAILABLE</>
          ) : (
            <><Activity className="w-4 h-4" /> ⏸ UNAVAILABLE</>
          )}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Responses', value: stats.total, icon: Shield, color: 'text-blue-400' },
          { label: 'This Week', value: stats.thisWeek, icon: Clock, color: 'text-sos' },
          { label: 'Avg Response', value: stats.avgResponse, icon: Activity, color: 'text-orange-400' },
          { label: 'Success Rate', value: stats.successRate, icon: Award, color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
               <stat.icon className={clsx("w-4 h-4", stat.color)} />
               <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{stat.label}</span>
            </div>
            <div className="text-2xl font-extrabold font-syne">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Incoming Alerts List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-extrabold font-syne flex items-center gap-3">
            Incoming Alerts
            <span className="px-2 py-0.5 rounded-full bg-sos/10 text-sos text-[10px] border border-sos/20">{alerts.length}</span>
          </h3>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Clock className="w-3 h-3" />
            <span>Last updated: just now</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {alerts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-default)]"
              >
                <div className="text-4xl mb-4">✨</div>
                <p className="text-[var(--text-secondary)] font-medium">All quiet in your zone. Great job!</p>
              </motion.div>
            ) : (
              alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden hover:border-sos/30 transition-all group"
                >
                  <div className="p-6 border-b border-[var(--border-default)] bg-gradient-to-r from-[var(--bg-tertiary)] to-transparent flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <span className="text-2xl">{alert.emergency_type === 'medical' ? '🏥' : '🔥'}</span>
                        <div>
                           <h4 className="font-extrabold font-syne uppercase tracking-wider text-sm">{alert.emergency_type} EMERGENCY</h4>
                           <p className="text-[10px] text-[var(--text-muted)] font-bold">{alert.alert_code}</p>
                        </div>
                     </div>
                     <div className={clsx(
                       "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border",
                       alert.routing_mode === 'cloud' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                     )}>
                        {alert.routing_mode === 'cloud' ? <Zap className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
                        {alert.routing_mode.toUpperCase()}
                     </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                             <MapPin className="w-4 h-4 text-sos" />
                             <span className="font-bold">Kodialbail, Mangaluru</span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2">"{alert.description || 'No description provided.'}"</p>
                       </div>
                       <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold text-sos">↔ ~0.8 km</div>
                          <div className="text-[10px] text-[var(--text-muted)]">2 mins ago</div>
                       </div>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-[var(--border-default)] h-24">
                       <AlertMap userLocation={{ lat: alert.location_lat, lng: alert.location_lng }} size="small" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <button 
                         onClick={() => handleAccept(alert.id)}
                         className="py-3 rounded-xl bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                       >
                          <Check className="w-4 h-4" /> Accept Alert
                       </button>
                       <button className="py-3 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--bg-elevated)] transition-colors">
                          <X className="w-4 h-4" /> Decline
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
