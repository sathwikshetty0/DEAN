'use client';

/**
 * @fileoverview Utility module for useGeolocation
 * Implements functionality related to the D-EAN platform's core logic layer.
 */

import { useState, useEffect, useCallback } from 'react';
import { getCurrentPosition, watchPosition, clearWatch, GeoPosition, calculateDistance } from '@/lib/utils/geolocation';

export const useGeolocation = (watch = false) => {
  const [position, setPosition] = useState<GeoPosition | null>(() => {
    // Load last known position from localStorage on init
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dean_last_pos');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updatePosition = useCallback((pos: GeoPosition) => {
    setPosition(pos);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dean_last_pos', JSON.stringify(pos));
    }
  }, []);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pos = await getCurrentPosition();
      updatePosition(pos);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to get location';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [updatePosition]);

  useEffect(() => {
    if (!watch) return;

    let watchId: number | null = null;
    let lastPos: GeoPosition | null = position;
    
    const startWatch = async () => {
      try {
        const pos = await getCurrentPosition();
        updatePosition(pos);
        lastPos = pos;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to get location';
        setError(message);
      }

      watchId = watchPosition(
        (pos) => {
          // Only update if moved more than 5 meters or if no last position
          if (!lastPos || calculateDistance(lastPos.lat, lastPos.lng, pos.lat, pos.lng) > 0.005) {
            updatePosition(pos);
            lastPos = pos;
          }
        },
        (err) => setError(err.message)
      );
    };

    startWatch();

    return () => {
      clearWatch(watchId);
    };
  }, [watch, updatePosition]);

  return { position, error, loading, requestLocation };
};
