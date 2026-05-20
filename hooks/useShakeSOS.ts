'use client';

/**
 * @fileoverview Utility module for useShakeSOS
 * Implements functionality related to the D-EAN platform's core logic layer.
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useShakeSOS = (onShake: () => void, sensitivity = 15) => {
  const [lastUpdate, setLastUpdate] = useState(0);
  const [lastX, setLastX] = useState<number | null>(null);
  const [lastY, setLastY] = useState<number | null>(null);
  const [lastZ, setLastZ] = useState<number | null>(null);

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const current = new Date().getTime();
    if ((current - lastUpdate) > 100) {
      const diffTime = current - lastUpdate;
      setLastUpdate(current);

      const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
      
      if (lastX !== null && lastY !== null && lastZ !== null) {
        const speed = Math.abs(x! + y! + z! - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > sensitivity) {
          onShake();
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        }
      }

      setLastX(x);
      setLastY(y);
      setLastZ(z);
    }
  }, [lastUpdate, lastX, lastY, lastZ, onShake, sensitivity]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [handleMotion]);
};
