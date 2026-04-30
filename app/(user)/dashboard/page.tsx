'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNetwork } from '@/context/NetworkContext';
import { useAlerts } from '@/context/AlertContext';
import { useAlertStatusStream, useResponderLocation } from '@/hooks/useSupabaseRealtime';
import { useGeolocation } from '@/hooks/useGeolocation';
import { createClient } from '@/lib/supabase/client';
import { SOSButton } from '@/components/sos/SOSButton';
import { EmergencyTypeSelector } from '@/components/sos/EmergencyTypeSelector';
import { LocationCapture } from '@/components/sos/LocationCapture';
import { AlertStatusDisplay } from '@/components/alert/AlertStatus';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmergencyType, Alert } from '@/lib/types/app.types';
import { broadcastAlert } from '@/lib/utils/p2p';
import { getGreeting, getEmergencyIcon, formatRelativeTime, identifyZone } from '@/lib/utils/formatters';
import { toast } from 'react-hot-toast';
import { Shield, Clock, ChevronRight, Info, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function UserDashboard() {
  const { profile, user } = useAuth();
  const { mode } = useNetwork();
  const { activeAlert, setActiveAlert } = useAlerts();
  const { position, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const supabase = createClient();

  const [selectedType, setSelectedType] = useState<EmergencyType>('medical');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [responderPos, setResponderPos] = useState<{ lat: number; lng: number } | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [nearbyResponders, setNearbyResponders] = useState<{ id: string; name: string; zone: string; skills: string[] }[]>([]);

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Fetch recent alerts
  useEffect(() => {
    if (!user) return;
    const fetchRecent = async () => {
      const { data } = await supabase
        .from('alerts')
        .select('*')
        .eq('triggered_by', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setRecentAlerts(data as Alert[]);
    };
    fetchRecent();
  }, [user, supabase]);

  // Fetch nearby responders
  useEffect(() => {
    const fetchResponders = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, zone, skills')
        .eq('role', 'responder')
        .eq('is_available', true)
        .eq('is_active', true)
        .limit(5);
      if (data) setNearbyResponders(data as typeof nearbyResponders);
    };
    fetchResponders();
  }, [supabase]);

  // Subscribe to active alert status
  useAlertStatusStream(activeAlert?.id, (updatedAlert) => {
    setActiveAlert(updatedAlert);
    if (updatedAlert.status === 'accepted') {
      toast.success('Responder assigned! Help is on the way.', { icon: '🦺' });
    } else if (updatedAlert.status === 'resolved') {
      toast.success('Emergency resolved. Glad you are safe!', { icon: '✅' });
      setActiveAlert(null);
    }
  });

  // Subscribe to responder location
  useResponderLocation(activeAlert?.id, (pos) => {
    setResponderPos(pos);
  });

  const handleSOS = async () => {
    if (!position) {
      toast.error('Location not available. Please enable GPS.');
      return;
    }

    setSending(true);

    let finalType = selectedType;

    // AI Triage Pre-processing
    if (description && mode !== 'p2p') {
      try {
        const triageRes = await fetch('/api/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description, originalType: selectedType }),
        });
        const triageData = await triageRes.json();
        if (triageData.suggestedType && triageData.confidence > 0.8) {
          finalType = triageData.suggestedType;
          if (triageData.isOverridden) {
            toast.success(`AI refined alert to: ${finalType.toUpperCase()}`, { icon: '🤖' });
          }
        }
      } catch (e) {
        console.error('Triage failed, using original type');
      }
    }

    const alertData = {
      location_lat: position.lat,
      location_lng: position.lng,
      emergency_type: finalType,
      description,
      routing_mode: mode,
    };

    if (mode === 'p2p') {
      broadcastAlert(alertData as Partial<Alert>);
      toast.success('P2P Alert Broadcasted Locally!', { icon: '📡' });
      setActiveAlert({
        id: 'local-temp',
        alert_code: 'LOCAL-WAIT',
        triggered_by: profile?.id ?? '',
        ...alertData,
        status: 'pending',
        is_synced: false,
        created_at: new Date().toISOString(),
      } as Alert);
      setSending(false);
    } else {
      try {
        const res = await fetch('/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alertData),
        });
        const { data, error } = await res.json();
        if (error) throw new Error(error);

        setActiveAlert(data);
        toast.success('SOS Alert Sent Successfully!', { icon: '🔴' });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to send alert';
        toast.error(message);
      } finally {
        setSending(false);
      }
    }
  };

  // Shake to SOS Detection
  useEffect(() => {
    let lastX: number, lastY: number, lastZ: number;
    let threshold = 15; // adjust as needed
    
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      
      const { x, y, z } = acc;
      if (lastX !== undefined) {
        const delta = Math.abs(x! - lastX) + Math.abs(y! - lastY) + Math.abs(z! - lastZ);
        if (delta > threshold && !sending && !activeAlert) {
           toast.success('Shake detected! Hold SOS to confirm.', { icon: '📳' });
           // Could auto-trigger after a countdown here
        }
      }
      lastX = x!; lastY = y!; lastZ = z!;
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
    }
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [sending, activeAlert]);

  const handleCancel = async () => {
    if (!activeAlert || activeAlert.id === 'local-temp') {
      setActiveAlert(null);
      return;
    }

    try {
      const res = await fetch(`/api/alerts/${activeAlert.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) {
        setActiveAlert(null);
        toast.success('Alert Cancelled');
      }
    } catch {
      toast.error('Failed to cancel alert');
    }
  };

  const SAFETY_TIPS: Record<EmergencyType, string[]> = {
    medical: ['Stay calm and check for breathing.', 'If unconscious, place on their side.', 'Apply pressure to bleeding wounds.', 'Wait for the responder to arrive.'],
    fire: ['Get low and crawl under smoke.', 'Feel doors before opening.', 'Use stairs, never elevators.', 'Meet at a safe gathering point.'],
    accident: ['Do not move the injured person.', 'Call emergency services.', 'Turn off vehicle ignitions if safe.', 'Direct traffic away from the scene.'],
    crime: ['Move to a safe location immediately.', 'Do not confront the perpetrator.', 'Note descriptions if safely possible.', 'Wait for responders in a secure area.'],
    flood: ['Move to higher ground immediately.', 'Never walk through flowing water.', 'Avoid electrical equipment.', 'Stay away from flood channels.'],
    other: ['Assess the situation carefully.', 'Ensure your own safety first.', 'Provide clear details in description.', 'Wait for the responder.'],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-syne">{getGreeting()}, {profile?.name?.split(' ')[0]}</h1>
            <p className="text-[var(--text-secondary)]">Stay safe. The network is watching over you.</p>
          </div>
          {position && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <Shield className="w-4 h-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-400/60">Safety Zone</span>
                <span className="text-xs font-bold text-blue-400">{identifyZone(position.lat, position.lng)}</span>
              </div>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {!activeAlert ? (
            <motion.div
              key="sos-interface"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--red-sos)]/50 to-transparent" />

              <div className="space-y-8">
                <EmergencyTypeSelector selected={selectedType} onChange={setSelectedType} />

                <LocationCapture
                  position={position}
                  loading={geoLoading}
                  error={geoError}
                  onRequest={requestLocation}
                />

                {/* Description */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">
                    Optional Details
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    placeholder="Briefly describe the situation (max 500 chars)..."
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-2xl p-4 text-sm outline-none focus:border-[var(--red-sos)]/50 transition-colors h-24 resize-none"
                  />
                  <div className="text-right text-[10px] text-[var(--text-muted)]">{description.length}/500</div>
                </div>

                {/* SOS Button */}
                <div className="flex justify-center pt-4">
                  <SOSButton onClick={handleSOS} loading={sending} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-alert"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertStatusDisplay
                alert={activeAlert}
                responderPosition={responderPos}
                onCancel={handleCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Content */}
      <div className="space-y-8">
        {/* Recent Alerts */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-6">
          <h3 className="font-extrabold font-syne mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--red-sos)]" /> Recent Alerts
          </h3>
          <div className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-4">No alerts yet.</p>
            ) : (
              recentAlerts.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)]/50 rounded-2xl border border-[var(--border-default)] hover:border-[var(--red-sos)]/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center text-lg border border-[var(--border-default)]">
                      {getEmergencyIcon(a.emergency_type)}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{a.alert_code}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{formatRelativeTime(a.created_at)}</div>
                    </div>
                  </div>
                  <StatusPill status={a.status} />
                </div>
              ))
            )}
          </div>
          <Link href="/dashboard/history" className="w-full mt-6 py-3 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--red-sos)] transition-colors flex items-center justify-center gap-1 group">
            View All History <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Nearby Responders */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-6">
          <h3 className="font-extrabold font-syne mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--blue-cloud)]" /> Nearby Responders
          </h3>
          <div className="space-y-4">
            {nearbyResponders.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-4">No responders nearby.</p>
            ) : (
              nearbyResponders.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--blue-cloud)]/10 flex items-center justify-center font-bold text-[var(--blue-cloud)]">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{r.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {r.skills.slice(0, 2).join(' · ')} {r.zone ? `• ${r.zone}` : ''}
                      </div>
                      <div className="text-[8px] uppercase tracking-tighter text-[var(--text-muted)] mt-1">
                        Last Active: {formatRelativeTime(new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[var(--green-safe)] shadow-[0_0_8px_var(--green-safe)]" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-gradient-to-br from-[var(--red-sos)] to-[#CC0033] rounded-3xl p-6 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Info className="w-32 h-32" />
          </div>
          <h3 className="font-extrabold font-syne mb-4">Safety Tips</h3>
          <p className="text-sm font-medium mb-4 opacity-90">For {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Emergencies:</p>
          <ul className="text-xs space-y-2 opacity-80 list-disc pl-4">
            {SAFETY_TIPS[selectedType].map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Voice SOS Trigger */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 left-8 z-[50] w-14 h-14 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-full flex items-center justify-center shadow-2xl hover:border-sos/50 group transition-all"
        onClick={() => toast.success('Voice SOS listening enabled', { icon: '🎙️' })}
      >
        <Mic className="w-6 h-6 text-[var(--text-muted)] group-hover:text-sos transition-colors" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[var(--bg-primary)] rounded-full" />
      </motion.button>
    </div>
  );
}
