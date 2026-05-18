'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Alert, Profile } from '@/lib/types/app.types';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Shield, AlertCircle, User, Zap, Navigation as NavIcon } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { motion, AnimatePresence } from 'framer-motion';

import { useEmergencyMap } from '@/hooks/useEmergencyMap';

interface MapUpdaterProps {
  bounds?: L.LatLngBoundsExpression;
}

const MapUpdater = ({ bounds }: MapUpdaterProps) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [bounds, map]);
  return null;
};

export const CommandCenterMap = () => {
  const supabase = createClient();
  const { responderMarkerIcon, emergencyMarkerIcon } = useEmergencyMap();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [responders, setResponders] = useState<Profile[]>([]);
  const [bounds, setBounds] = useState<L.LatLngBoundsExpression | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeatmap, setIsHeatmap] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: alertData } = await supabase
          .from('alerts')
          .select('*')
          .in('status', ['pending', 'accepted', 'en_route']);
        
        const { data: respData } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'responder')
          .eq('is_active', true);

        if (alertData) setAlerts(alertData);
        if (respData) setResponders(respData);

        // Calculate bounds
        const points: [number, number][] = [];
        alertData?.forEach(a => points.push([a.location_lat, a.location_lng]));
        respData?.filter(r => r.location_lat && r.location_lng).forEach(r => points.push([r.location_lat!, r.location_lng!]));

        if (points.length > 0) {
          const latLngs = points.map(p => L.latLng(p[0], p[1]));
          setBounds(L.latLngBounds(latLngs));
        } else {
          setBounds([[12.9716, 77.5946], [12.9716, 77.5946]]); // Default Bangalore
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Real-time subscriptions
    const alertChannel = supabase
      .channel('command-center-alerts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => fetchData())
      .subscribe();

    const profileChannel = supabase
      .channel('command-center-profiles')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(alertChannel);
      supabase.removeChannel(profileChannel);
    };
  }, [supabase]);

  return (
    <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-[var(--border-default)] shadow-2xl relative">
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[2000] bg-[var(--bg-secondary)] flex flex-col items-center justify-center gap-4"
          >
            <div className="relative">
               <div className="w-12 h-12 border-4 border-sos/20 border-t-sos rounded-full animate-spin" />
               <Zap className="w-5 h-5 text-sos absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-sos">Initializing Command Center</div>
          </motion.div>
        )}
      </AnimatePresence>

      <MapContainer 
        bounds={bounds || [[12.9716, 77.5946], [12.9716, 77.5946]]}
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapUpdater bounds={bounds} />

        {alerts.map((alert) => (
          <Marker 
            key={alert.id} 
            position={[alert.location_lat, alert.location_lng]}
            icon={isHeatmap ? L.divIcon({
              className: 'heatmap-marker',
              html: `<div class="w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>`,
              iconSize: [80, 80],
              iconAnchor: [40, 40],
            }) : emergencyMarkerIcon!(alert.emergency_type, alert.status)}
          >
            {!isHeatmap && (
              <Popup className="custom-popup" offset={[0, -20]}>
                 <div className="p-3 min-w-[180px] bg-[var(--bg-secondary)] border-0">
                    <div className="flex justify-between items-start mb-2">
                       <div className="text-[10px] font-extrabold text-sos tracking-tighter bg-sos/10 px-1.5 py-0.5 rounded-md">{alert.alert_code}</div>
                       <div className="text-[9px] text-gray-500 font-medium">Active</div>
                    </div>
                    <div className="text-[11px] font-bold text-white mb-3 flex items-center gap-2">
                       {alert.emergency_type === 'medical' ? '🏥' : alert.emergency_type === 'fire' ? '🔥' : alert.emergency_type === 'accident' ? '🚗' : '🚨'}
                       {alert.emergency_type.toUpperCase()} EMERGENCY
                    </div>
                    <div className="space-y-1.5">
                       <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <div className={`w-1.5 h-1.5 rounded-full ${alert.status === 'pending' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                          <span className="font-semibold uppercase">{alert.status}</span>
                       </div>
                       <div className="text-[9px] text-gray-500 line-clamp-2 italic">
                          {alert.description || "No description provided."}
                       </div>
                    </div>
                    <button className="w-full mt-3 py-2 bg-[var(--bg-primary)] hover:bg-sos/10 text-[9px] font-bold uppercase tracking-widest text-sos border border-sos/20 rounded-lg transition-colors">
                       Manage Alert
                    </button>
                 </div>
              </Popup>
            )}

          </Marker>
        ))}

        {!isHeatmap && responders.map((resp) => (
          resp.location_lat && (
            <Marker 
              key={resp.id} 
              position={[resp.location_lat, resp.location_lng]}
              icon={responderMarkerIcon!(resp.is_available)}
            >

              <Popup className="custom-popup">
                 <div className="p-3 min-w-[140px]">
                    <div className="flex items-center gap-2 mb-2">
                       <div className={`w-2 h-2 rounded-full ${resp.is_available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-blue-500'}`} />
                       <div className="text-[11px] font-bold text-white">{resp.name}</div>
                    </div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-2">
                       {resp.is_available ? 'Ready for Dispatch' : 'On Assignment'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[8px] text-gray-400 bg-white/5 px-1.5 py-1 rounded-md">
                       <User className="w-2.5 h-2.5" />
                       ID: {resp.id.slice(0, 8)}
                    </div>
                 </div>
              </Popup>

            </Marker>
          )
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute top-6 left-6 z-[1000] p-4 bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--border-default)] rounded-2xl shadow-xl space-y-3">
         {!isHeatmap ? (
           <>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#FF2D55]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Active Alert</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Available Responder</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Busy Responder</span>
             </div>
           </>
         ) : (
           <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">Density Heatmap</span>
           </div>
         )}
      </div>

      {/* Map Actions */}
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
         <button 
           onClick={() => setIsHeatmap(!isHeatmap)}
           className={`p-3 border rounded-xl shadow-xl transition-all group ${isHeatmap ? 'bg-sos border-sos text-white' : 'bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-muted)]'}`}
           title="Toggle Heatmap"
         >
            <Zap className={`w-5 h-5 group-hover:scale-110 transition-transform ${isHeatmap ? 'animate-pulse' : ''}`} />
         </button>
         <button 
           onClick={() => {
              if (navigator.geolocation) {
                 navigator.geolocation.getCurrentPosition((pos) => {
                    setBounds([[pos.coords.latitude, pos.coords.longitude], [pos.coords.latitude, pos.coords.longitude]]);
                 });
              }
           }}
           className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl text-[var(--text-muted)] hover:text-emerald-500 shadow-xl transition-all group"
           title="Center on my location"
         >
            <div className="relative">
               <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
               <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-[var(--bg-secondary)]" />
            </div>
         </button>
         <button 
           onClick={() => {
              const points: [number, number][] = [];
              alerts.forEach(a => points.push([a.location_lat, a.location_lng]));
              responders.filter(r => r.location_lat && r.location_lng).forEach(r => points.push([r.location_lat!, r.location_lng!]));
              if (points.length > 0) {
                 setBounds(L.latLngBounds(points.map(p => L.latLng(p[0], p[1]))));
              } else {
                 setBounds([[12.9716, 77.5946], [12.9716, 77.5946]]);
              }
           }}
           className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl text-[var(--text-muted)] hover:text-sos shadow-xl transition-all group"
           title="Fit to markers"
         >
            <NavIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
         </button>

      </div>
    </div>
  );
};


// Added for debugging purposes
CommandCenterMap.displayName = 'CommandCenterMap';
