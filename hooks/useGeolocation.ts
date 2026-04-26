'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentPosition, watchPosition, clearWatch, GeoPosition } from '@/lib/utils/geolocation';

export const useGeolocation = (watch = false) => {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pos = await getCurrentPosition();
      setPosition(pos);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to get location';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!watch) return;

    let watchId: number | null = null;
    
    const startWatch = async () => {
      try {
        const pos = await getCurrentPosition();
        setPosition(pos);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to get location';
        setError(message);
      }

      watchId = watchPosition(
        (pos) => setPosition(pos),
        (err) => setError(err.message)
      );
    };

    startWatch();

    return () => {
      clearWatch(watchId);
    };
  }, [watch]);

  return { position, error, loading, requestLocation };
};
