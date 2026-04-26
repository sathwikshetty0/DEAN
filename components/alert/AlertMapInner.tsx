'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + Next.js
const userIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #FF2D55; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #FF2D55;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const responderIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #3B82F6;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

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
  const coords: [number, number][] = [[userLocation.lat, userLocation.lng]];
  if (responderLocation) {
    coords.push([responderLocation.lat, responderLocation.lng]);
  }

  // Use a key based on the initial center to force a fresh container if location changes significantly
  // or on re-mount to avoid "Map container already initialized"
  return (
    <MapContainer 
      key={`map-${userLocation.lat}-${userLocation.lng}`}
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
      {responderLocation && (
        <Marker position={[responderLocation.lat, responderLocation.lng]} icon={responderIcon} />
      )}
      <MapRecenter coords={coords} />
    </MapContainer>
  );
};

export default AlertMapInner;
