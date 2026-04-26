'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import AlertMapInner from './AlertMapInner';

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
