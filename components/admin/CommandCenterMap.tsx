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

// Fix for default markers
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (emoji: string, color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 12px; display: flex; items-center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transform: rotate(45deg);"><div style="transform: rotate(-45deg);">${emoji}</div></div>`,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const createResponderIcon = (color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; items-center; justify-content: center; font-size: 16px; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">🦺</div>`,
    className: 'responder-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface MapUpdaterProps {
  center: [number, number];
}

const MapUpdater = ({ center }: MapUpdaterProps) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const CommandCenterMap = () => {
  const supabase = createClient();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [responders, setResponders] = useState<Profile[]>([]);
  const [center, setCenter] = useState<[number, number]>([12.9716, 77.5946]); // Bangalore default

  useEffect(() => {
    const fetchData = async () => {
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

      // Center map on first alert if available
      if (alertData && alertData.length > 0) {
        setCenter([alertData[0].location_lat, alertData[0].location_lng]);
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
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapUpdater center={center} />

        {alerts.map((alert) => (
          <Marker 
            key={alert.id} 
            position={[alert.location_lat, alert.location_lng]}
            icon={createCustomIcon(
              alert.emergency_type === 'medical' ? '🏥' : alert.emergency_type === 'fire' ? '🔥' : '🚨',
              alert.status === 'pending' ? '#FF2D55' : '#F59E0B'
            )}
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
              icon={createResponderIcon(resp.is_available ? '#10B981' : '#3B82F6')}
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
           onClick={() => setCenter([12.9716, 77.5946])}
           className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl text-[var(--text-muted)] hover:text-sos shadow-xl transition-all"
         >
            <NavIcon className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};
