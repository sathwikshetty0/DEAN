'use client';

/**
 * @fileoverview UI Component for page
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNetwork } from '@/context/NetworkContext';
import { useAlerts } from '@/context/AlertContext';
import { useAlertStatusStream, useResponderLocation } from '@/hooks/useSupabaseRealtime';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useShakeSOS } from '@/hooks/useShakeSOS';
import { useVoiceSOS } from '@/hooks/useVoiceSOS';
import { useKeyboardSOS } from '@/hooks/useKeyboardSOS';
import { createClient } from '@/lib/supabase/client';
import { SOSButton } from '@/components/sos/SOSButton';
import { EmergencyTypeSelector } from '@/components/sos/EmergencyTypeSelector';
import { LocationCapture } from '@/components/sos/LocationCapture';
import { ShakeCountdown } from '@/components/sos/ShakeCountdown';
import { AlertStatusDisplay } from '@/components/alert/AlertStatus';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmergencyType, Alert } from '@/lib/types/app.types';
import { broadcastAlert } from '@/lib/utils/p2p';
import { getGreeting, getEmergencyIcon, formatRelativeTime, identifyZone } from '@/lib/utils/formatters';
import { toast } from 'react-hot-toast';
import { Shield, Clock, ChevronRight, Info, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { clsx } from 'clsx';

import { getUnsyncedAlerts } from '@/lib/utils/db';

export default function UserDashboard() {
  const { profile, user } = useAuth();
  const { mode } = useNetwork();
  const { activeAlert, setActiveAlert } = useAlerts();
  const { position, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const supabase = createClient();
  const sosRef = useRef<HTMLDivElement>(null);

  const [selectedType, setSelectedType] = useState<EmergencyType>('medical');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [responderPos, setResponderPos] = useState<{ lat: number; lng: number } | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [nearbyResponders, setNearbyResponders] = useState<{ id: string; name: string; zone: string; skills: string[] }[]>([]);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [shakeCountdown, setShakeCountdown] = useState<number | null>(null);
  const [triageHints, setTriageHints] = useState<string[]>([]);

  // Check for unsynced alerts
  useEffect(() => {
    const checkUnsynced = async () => {
      const unsynced = await getUnsyncedAlerts();
      setUnsyncedCount(unsynced.length);
    };
    checkUnsynced();
    // Re-check periodically
    const interval = setInterval(checkUnsynced, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // PWA / quick-link: scroll to SOS panel
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('sos') === '1' && sosRef.current) {
      sosRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

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

  const handleSOS = useCallback(async () => {
    if (!position) {
      toast.error('Location not available. Please enable GPS.');
      return;
    }

    setSending(true);
    setShakeCountdown(null);

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
          if (triageData.severity === 'critical') {
            toast('Critical priority — responders notified immediately', { icon: '⚡' });
          }
          if (triageData.suggestedActions?.length) {
            setTriageHints(triageData.suggestedActions);
          }
        }
      } catch {
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
  }, [position, selectedType, description, mode, profile?.id, setActiveAlert]);

  const startEmergencyCountdown = useCallback(() => {
    if (sending || activeAlert || shakeCountdown !== null) return;
    setShakeCountdown(3);
    toast('Emergency countdown started — cancel or wait', { icon: '⚠️' });
  }, [sending, activeAlert, shakeCountdown]);

  useEffect(() => {
    if (shakeCountdown === null) return;
    if (shakeCountdown === 0) {
      handleSOS();
      return;
    }
    const t = setTimeout(() => setShakeCountdown((c) => (c !== null && c > 0 ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [shakeCountdown, handleSOS]);

  const shakeSensitivity =
    typeof window !== 'undefined'
      ? parseInt(localStorage.getItem('dean_shake_threshold') || '18', 10)
      : 18;
  useShakeSOS(startEmergencyCountdown, shakeSensitivity);
  useKeyboardSOS(startEmergencyCountdown, !activeAlert && !sending);
  const { isListening, toggleListening, supported: voiceSupported } = useVoiceSOS(
    startEmergencyCountdown,
    !activeAlert && !sending
  );

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
      <ShakeCountdown seconds={shakeCountdown} onCancel={() => setShakeCountdown(null)} />
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
              ref={sosRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--red-sos)]/50 to-transparent" />

              <AnimatePresence>
                {unsyncedCount > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-orange-400">Offline Drafts Pending</div>
                          <div className="text-[10px] text-orange-400/60">{unsyncedCount} alerts waiting for sync</div>
                        </div>
                      </div>
                      <Link 
                        href="/dashboard/history" 
                        className="text-[10px] font-black uppercase tracking-widest text-orange-400 hover:underline"
                      >
                        Details
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

                {triageHints.length > 0 && (
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
                    <p className="font-black uppercase tracking-widest text-[10px] text-blue-400">AI suggested actions</p>
                    {triageHints.map((hint) => (
                      <p key={hint}>• {hint}</p>
                    ))}
                  </div>
                )}

                <p className="text-center text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                  Shift+S · Shake phone · Say &quot;SOS&quot; or &quot;help&quot;
                </p>

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
        type="button"
        aria-pressed={isListening}
        aria-label={isListening ? 'Stop voice SOS listening' : 'Start voice SOS listening'}
        className={clsx(
          'fixed bottom-8 left-8 z-[50] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl group transition-all border',
          isListening
            ? 'bg-[var(--red-sos)]/20 border-[var(--red-sos)] animate-pulse'
            : 'bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-[var(--red-sos)]/50',
          !voiceSupported && 'opacity-40 pointer-events-none'
        )}
        onClick={toggleListening}
      >
        <Mic
          className={clsx(
            'w-6 h-6 transition-colors',
            isListening ? 'text-[var(--red-sos)]' : 'text-[var(--text-muted)] group-hover:text-[var(--red-sos)]'
          )}
        />
        <div
          className={clsx(
            'absolute -top-1 -right-1 w-3 h-3 border-2 border-[var(--bg-primary)] rounded-full',
            isListening ? 'bg-[var(--red-sos)]' : 'bg-green-500'
          )}
        />
      </motion.button>
    </div>
  );
}
