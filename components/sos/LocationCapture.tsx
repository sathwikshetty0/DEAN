'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Loader2 } from 'lucide-react';
import { GeoPosition } from '@/lib/utils/geolocation';

const AlertMap = dynamic(() => import('@/components/alert/AlertMap').then(m => m.AlertMap), { ssr: false });

interface LocationCaptureProps {
  position: GeoPosition | null;
  loading: boolean;
  error: string | null;
  onRequest: () => void;
}

export const LocationCapture = ({ position, loading, error, onRequest }: LocationCaptureProps) => {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">
        Current Location
      </label>
      <div className="bg-[var(--bg-tertiary)] rounded-2xl p-4 border border-[var(--border-default)]">
        {position ? (
          <>
            <AlertMap userLocation={position} size="small" />
            <div className="flex items-center gap-2 mt-4 text-xs text-[var(--text-secondary)]">
              <MapPin className="w-4 h-4 text-[var(--red-sos)]" />
              <span>
                {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
                {position.accuracy && ` · ±${Math.round(position.accuracy)}m`}
              </span>
            </div>
          </>
        ) : (
          <div className="h-[150px] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-[var(--border-default)] rounded-xl">
            {loading ? (
              <>
                <Loader2 className="w-8 h-8 text-[var(--text-muted)] animate-spin" />
                <span className="text-xs text-[var(--text-muted)]">Detecting location…</span>
              </>
            ) : (
              <>
                <MapPin className="w-8 h-8 text-[var(--text-muted)]" />
                {error && <p className="text-[10px] text-[var(--red-sos)]">{error}</p>}
                <button
                  type="button"
                  onClick={onRequest}
                  className="px-5 py-2 bg-[var(--red-sos)] rounded-full text-xs font-bold shadow-lg shadow-[var(--red-sos)]/20"
                >
                  Enable Location
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// Added for debugging purposes
LocationCapture.displayName = 'LocationCapture';
