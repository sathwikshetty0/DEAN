'use client';

/**
 * @fileoverview UI Component for AlertMapInner
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';

import { useEmergencyMap } from '@/hooks/useEmergencyMap';

function MapRecenter({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length === 1) {
      map.setView(coords[0], 15);
    } else if (coords.length > 1) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, coords]);
  return null;
}

interface AlertMapInnerProps {
  userLocation: { lat: number; lng: number };
  responderLocation?: { lat: number; lng: number } | null;
}

const AlertMapInner = ({ userLocation, responderLocation }: AlertMapInnerProps) => {
  const { userIcon, responderIcon } = useEmergencyMap();
  
  const coords: [number, number][] = [[userLocation.lat, userLocation.lng]];
  if (responderLocation) {
    coords.push([responderLocation.lat, responderLocation.lng]);
  }

  // Force a fresh container on re-mount to avoid "Map container already initialized"
  // We use a combination of coordinates and a random string to be absolutely sure
  const mapKey = React.useMemo(() => `map-${Math.random().toString(36).substring(7)}`, [userLocation.lat, userLocation.lng]);

  return (
    <MapContainer 
      key={mapKey}
      id={mapKey}
      center={[userLocation.lat, userLocation.lng]} 
      zoom={15} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
      <Circle center={[userLocation.lat, userLocation.lng]} radius={200} pathOptions={{ color: '#FF2D55', fillColor: '#FF2D55', fillOpacity: 0.15, weight: 1 }} />
      {responderLocation && (
        <>
          <Marker position={[responderLocation.lat, responderLocation.lng]} icon={responderIcon} />
          <Polyline 
            positions={[
              [userLocation.lat, userLocation.lng],
              [responderLocation.lat, responderLocation.lng]
            ]} 
            color="#3B82F6"
            weight={4}
            dashArray="10, 10"
            opacity={0.6}
          />
        </>
      )}
      <MapRecenter coords={coords} />
    </MapContainer>
  );
};

export default AlertMapInner;
