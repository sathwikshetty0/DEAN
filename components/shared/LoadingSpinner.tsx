import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-20">
    <Loader2 className="w-10 h-10 animate-spin text-sos" />
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Initializing Network...</p>
  </div>
);
