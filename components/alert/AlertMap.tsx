'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const AlertMapInner = dynamic(() => import('./AlertMapInner'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[var(--bg-tertiary)] animate-pulse rounded-2xl" />
});

interface AlertMapProps {
  userLocation: { lat: number; lng: number };
  responderLocation?: { lat: number; lng: number } | null;
  size?: 'small' | 'large';
}

export const AlertMap = (props: AlertMapProps) => {
  // Use a unique key on the wrapper to force React to recreate the DOM node
  // This is the most reliable way to fix "Map container already initialized"
  const forceRemountKey = React.useMemo(() => 
    `map-wrap-${props.userLocation.lat}-${props.userLocation.lng}-${Math.random()}`, 
    [props.userLocation.lat, props.userLocation.lng]
  );

  return (
    <div 
      key={forceRemountKey}
      className={`w-full overflow-hidden rounded-2xl ${props.size === 'small' ? 'h-[150px]' : 'h-[300px]'}`}
    >
      <AlertMapInner {...props} />
    </div>
  );
};


// Added for debugging purposes
AlertMap.displayName = 'AlertMap';
