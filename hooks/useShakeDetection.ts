'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom hook to detect a physical shake gesture on mobile devices.
 * Uses the DeviceMotionEvent API to monitor acceleration.
 */
export const useShakeDetection = (onShake: () => void, threshold = 15) => {
  const lastShake = useRef(0);

  useEffect(() => {
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const { x, y, z } = acceleration;
      if (x === null || y === null || z === null) return;

      if (lastX !== null) {
        const deltaX = Math.abs(lastX - x);
        const deltaY = Math.abs(lastY! - y);
        const deltaZ = Math.abs(lastZ! - z);

        if ((deltaX > threshold && deltaY > threshold) || 
            (deltaX > threshold && deltaZ > threshold) || 
            (deltaY > threshold && deltaZ > threshold)) {
          
          const now = Date.now();
          if (now - lastShake.current > 2000) { // Cooldown of 2 seconds
            lastShake.current = now;
            onShake();
          }
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      // Some browsers require permission for DeviceMotion
      // We assume permission is handled or requested elsewhere if needed
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [onShake, threshold]);
};
