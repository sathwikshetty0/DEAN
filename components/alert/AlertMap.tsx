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
  return (
    <div className={`w-full overflow-hidden rounded-2xl ${props.size === 'small' ? 'h-[150px]' : 'h-[300px]'}`}>
      <AlertMapInner {...props} />
    </div>
  );
};
