'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNetwork } from '@/context/NetworkContext';
import { useAlerts } from '@/context/AlertContext';
import { useAlertStatusStream, useResponderLocation } from '@/hooks/useSupabaseRealtime';
import { SOSButton } from '@/components/sos/SOSButton';
import { AlertMap } from '@/components/alert/AlertMap';
import { StatusPill } from '@/components/shared/StatusPill';
import { EmergencyType, Alert } from '@/lib/types/app.types';
import { broadcastAlert } from '@/lib/utils/p2p';
import { toast } from 'react-hot-toast';
import { Activity, Shield, MapPin, Clock, Info, ChevronRight, CheckCircle2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const EMERGENCY_TYPES: { id: EmergencyType; label: string; icon: string; color: string }[] = [
  { id: 'medical', label: 'Medical', icon: '🏥', color: '#FF2D55' },
  { id: 'fire', label: 'Fire', icon: '🔥', color: '#F59E0B' },
  { id: 'accident', label: 'Accident', icon: '🚗', color: '#3B82F6' },
  { id: 'crime', label: 'Crime', icon: '🚨', color: '#94A3B8' },
  { id: 'flood', label: 'Flood', icon: '🌊', color: '#10B981' },
  { id: 'other', label: 'Other', icon: '❓', color: '#475569' },
];

export default function UserDashboard() {
  const { profile } = useAuth();
  const { mode } = useNetwork();
  const { activeAlert, setActiveAlert } = useAlerts();
  
  const [selectedType, setSelectedType] = useState<EmergencyType>('medical');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [responderPos, setResponderPos] = useState<{lat: number, lng: number} | null>(null);

  // Subscribe to status updates if there's an active alert
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

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const handleSOS = async () => {
    if (!location) {
      toast.error('Location not available. Please enable GPS.');
      return;
    }

    setLoading(true);
    
    const alertData = {
      location_lat: location.lat,
      location_lng: location.lng,
      emergency_type: selectedType,
      description: description,
      routing_mode: mode,
    };

    if (mode === 'p2p') {
      broadcastAlert(alertData as any);
      toast.success('P2P Alert Broadcasted Locally!', { icon: '📡' });
      // In P2P mode, we mock the local creation for the UI
      setActiveAlert({
        id: 'local-temp',
        alert_code: 'LOCAL-WAIT',
        triggered_by: profile?.id || '',
        ...alertData,
        status: 'pending',
        is_synced: false,
        created_at: new Date().toISOString(),
      } as any);
      setLoading(false);
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
      } catch (err: any) {
        toast.error(err.message || 'Failed to send alert');
      } finally {
        setLoading(false);
      }
    }
  };

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
    } catch (err) {
      toast.error('Failed to cancel alert');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-syne">Good Morning, {profile?.name?.split(' ')[0]}</h1>
            <p className="text-[var(--text-secondary)]">Stay safe. The network is watching over you.</p>
          </div>
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
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sos/50 to-transparent" />
              
              <div className="space-y-8">
                {/* Emergency Type Selector */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Type of Emergency</label>
                  <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
                    {EMERGENCY_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={clsx(
                          "flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all",
                          selectedType === type.id 
                            ? "bg-sos/10 border-sos text-sos shadow-[0_0_15px_rgba(255,45,85,0.15)]" 
                            : "bg-[var(--bg-tertiary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-sos/30"
                        )}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="font-bold text-sm">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Map */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Current Location</label>
                  <div className="bg-[var(--bg-tertiary)] rounded-2xl p-4 border border-[var(--border-default)]">
                    {location ? (
                      <AlertMap userLocation={location} size="small" />
                    ) : (
                      <div className="h-[150px] flex items-center justify-center text-[var(--text-muted)]">
                        Detecting location...
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-4 text-xs text-[var(--text-secondary)]">
                      <MapPin className="w-4 h-4 text-sos" />
                      <span>{location ? "Precision: High (GPS Active)" : "Waiting for GPS..."}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">Optional Details</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    placeholder="Briefly describe the situation (max 500 chars)..."
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-2xl p-4 text-sm outline-none focus:border-sos/50 transition-colors h-24 resize-none"
                  />
                  <div className="text-right text-[10px] text-[var(--text-muted)]">{description.length}/500</div>
                </div>

                {/* SOS Button */}
                <div className="flex justify-center pt-4">
                  <SOSButton onClick={handleSOS} loading={loading} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="active-alert"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--bg-secondary)] border border-sos/20 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="bg-sos/10 p-6 border-b border-sos/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sos flex items-center justify-center text-2xl animate-pulse">
                    {EMERGENCY_TYPES.find(t => t.id === activeAlert.emergency_type)?.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold font-syne uppercase tracking-wider">{activeAlert.emergency_type} EMERGENCY</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-secondary)] font-medium">{activeAlert.alert_code}</span>
                      <StatusPill status={activeAlert.status} />
                    </div>
                  </div>
                </div>
                {activeAlert.routing_mode === 'p2p' && (
                  <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-orange-400">
                    <Navigation className="w-3 h-3" /> P2P ACTIVE
                  </div>
                )}
              </div>

              <div className="p-8 space-y-8">
                {/* Status Timeline */}
                <div className="flex justify-between relative px-2">
                  <div className="absolute top-4 left-0 w-full h-1 bg-[var(--bg-tertiary)] -z-10" />
                  {[
                    { label: 'Sent', key: 'pending', icon: Activity },
                    { label: 'Found', key: 'accepted', icon: Shield },
                    { label: 'En Route', key: 'en_route', icon: Navigation },
                    { label: 'Help', key: 'resolved', icon: CheckCircle2 }
                  ].map((step, i) => {
                    const isCompleted = ['pending', 'accepted', 'en_route', 'resolved'].indexOf(activeAlert.status) >= i;
                    const isActive = activeAlert.status === step.key;
                    
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className={clsx(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                          isCompleted ? "bg-sos border-sos text-white shadow-lg shadow-sos/30" : "bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-muted)]",
                          isActive && "scale-125 animate-pulse"
                        )}>
                          <step.icon className="w-4 h-4" />
                        </div>
                        <span className={clsx(
                          "text-[10px] font-bold uppercase tracking-widest",
                          isCompleted ? "text-sos" : "text-[var(--text-muted)]"
                        )}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Map */}
                <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden shadow-inner">
                  <AlertMap 
                    userLocation={{ lat: activeAlert.location_lat, lng: activeAlert.location_lng }}
                    responderLocation={responderPos || (activeAlert.responder_lat ? { lat: activeAlert.responder_lat, lng: activeAlert.responder_lng } : null)}
                    size="large"
                  />
                </div>

                {/* Responder Info */}
                {activeAlert.status !== 'pending' && (
                  <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-default)] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                          {activeAlert.assigned_responder ? 'R' : '?'}
                       </div>
                       <div>
                          <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">Assigned Responder</div>
                          <div className="font-bold">Responder Name</div>
                       </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-xl border border-blue-500/20">
                       Contact
                    </button>
                  </div>
                )}

                <div className="flex gap-4">
                  <button 
                    onClick={handleCancel}
                    className="flex-1 py-4 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-bold rounded-2xl hover:bg-red-500/10 hover:text-red-400 transition-all border border-[var(--border-default)]"
                  >
                    Cancel Alert
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Content */}
      <div className="space-y-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-6">
          <h3 className="font-extrabold font-syne mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sos" /> Recent Alerts
          </h3>
          <div className="space-y-4">
            {/* Sample history */}
            <div className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)]/50 rounded-2xl border border-[var(--border-default)] hover:border-sos/20 transition-colors">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-lg">🏥</div>
                  <div>
                    <div className="text-xs font-bold">DEAN-1002</div>
                    <div className="text-[10px] text-[var(--text-muted)]">24 Apr, 10:30</div>
                  </div>
               </div>
               <StatusPill status="resolved" />
            </div>
          </div>
          <button className="w-full mt-6 py-3 text-xs font-bold text-[var(--text-muted)] hover:text-sos transition-colors flex items-center justify-center gap-1 group">
            View All History <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-6">
          <h3 className="font-extrabold font-syne mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" /> Nearby Responders
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-400">
                       R{i}
                    </div>
                    <div>
                       <div className="text-xs font-bold">Responder {i+1}</div>
                       <div className="text-[10px] text-[var(--text-muted)]">First Aid • Mangaluru Central</div>
                    </div>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#10B981]" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-sos to-[#CC0033] rounded-3xl p-6 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <Info className="w-32 h-32" />
          </div>
          <h3 className="font-extrabold font-syne mb-4">Safety Tips</h3>
          <p className="text-sm font-medium mb-4 opacity-90">For Medical Emergencies:</p>
          <ul className="text-xs space-y-2 opacity-80 list-disc pl-4">
            <li>Stay calm and check for breathing.</li>
            <li>If unconscious, place on their side.</li>
            <li>Apply pressure to any bleeding wounds.</li>
            <li>Wait for the responder to arrive.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
