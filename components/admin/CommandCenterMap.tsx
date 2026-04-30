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

// Fix for default markers
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (type: string, status: string) => {
  const color = status === 'pending' ? '#FF2D55' : '#F59E0B';
  const isPending = status === 'pending';
  
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        ${isPending ? `
          <div class="absolute w-12 h-12 bg-[#FF2D55]/30 rounded-full animate-ping opacity-75"></div>
          <div class="absolute w-8 h-8 bg-[#FF2D55]/40 rounded-full animate-pulse"></div>
        ` : ''}
        <div class="relative z-10" style="background-color: ${color}; width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; border: 3px solid #0A0E1A; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); transform: rotate(45deg); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
          <div style="transform: rotate(-45deg); color: white; font-size: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
            ${type === 'medical' ? '🏥' : type === 'fire' ? '🔥' : type === 'accident' ? '🚗' : '🚨'}
          </div>
        </div>
        <div class="absolute -bottom-1 w-2 h-2 bg-[#0A0E1A] rotate-45"></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });
};

const createResponderIcon = (isAvailable: boolean) => {
  const color = isAvailable ? '#10B981' : '#3B82F6';
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div style="background-color: ${color}; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #0A0E1A; box-shadow: 0 6px 15px -3px rgba(0,0,0,0.4); transition: all 0.3s ease;">
          <div style="font-size: 16px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));">🦺</div>
        </div>
        ${isAvailable ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-[#10B981] border-2 border-[#0A0E1A] rounded-full"></div>' : ''}
      </div>
    `,
    className: 'responder-marker',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

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
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [responders, setResponders] = useState<Profile[]>([]);
  const [bounds, setBounds] = useState<L.LatLngBoundsExpression | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

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
            icon={createCustomIcon(alert.emergency_type, alert.status)}
          >
            <Popup className="custom-popup">
               <div className="p-2 min-w-[150px]">
                  <div className="text-xs font-extrabold text-sos mb-1">{alert.alert_code}</div>
                  <div className="text-[10px] font-bold uppercase mb-2">{alert.emergency_type} Emergency</div>
                  <div className="flex items-center gap-2 text-[9px] text-gray-400">
                     <div className={`w-1.5 h-1.5 rounded-full ${alert.status === 'pending' ? 'bg-red-500' : 'bg-orange-500'}`} />
                     {alert.status.toUpperCase()}
                  </div>
               </div>
            </Popup>
          </Marker>
        ))}

        {responders.map((resp) => (
          resp.location_lat && (
            <Marker 
              key={resp.id} 
              position={[resp.location_lat, resp.location_lng]}
              icon={createResponderIcon(resp.is_available)}
            >
              <Popup>
                 <div className="p-1">
                    <div className="text-xs font-bold">{resp.name}</div>
                    <div className="text-[9px] text-gray-400">{resp.is_available ? 'Available' : 'Assigned'}</div>
                 </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute top-6 left-6 z-[1000] p-4 bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--border-default)] rounded-2xl shadow-xl space-y-3">
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
      </div>

      {/* Map Actions */}
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
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
