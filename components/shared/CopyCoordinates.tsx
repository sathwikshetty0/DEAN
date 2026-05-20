'use client';

/**
 * @fileoverview UI Component for CopyCoordinates
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { copyToClipboard, formatCoords, mapsUrl } from '@/lib/utils/clipboard';

interface CopyCoordinatesProps {
  lat: number;
  lng: number;
}

export const CopyCoordinates = ({ lat, lng }: CopyCoordinatesProps) => {
  const text = formatCoords(lat, lng);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => copyToClipboard(text, 'Coordinates copied')}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-xs font-bold hover:border-[var(--red-sos)]/40 transition-colors"
      >
        <Copy className="w-3.5 h-3.5" /> {text}
      </button>
      <a
        href={mapsUrl(lat, lng)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 hover:bg-blue-500/20 transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" /> Open in Maps
      </a>
    </div>
  );
};


// Added for debugging purposes
CopyCoordinates.displayName = 'CopyCoordinates';
