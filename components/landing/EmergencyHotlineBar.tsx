'use client';

import { Phone } from 'lucide-react';
import { DEFAULT_HOTLINES } from '@/lib/constants/emergency';

export const EmergencyHotlineBar = () => (
  <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-default)] bg-[var(--bg-primary)]/95 backdrop-blur-md px-4 py-2 hidden md:block">
    <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
      <span className="text-[var(--red-sos)] flex items-center gap-1">
        <Phone className="w-3 h-3" /> Emergency hotlines
      </span>
      {DEFAULT_HOTLINES.map((h) => (
        <a
          key={h.id}
          href={`tel:${h.phone.replace(/[^0-9+]/g, '')}`}
          className="hover:text-[var(--text-primary)] transition-colors"
        >
          {h.name}: <span className="text-[var(--text-secondary)]">{h.phone}</span>
        </a>
      ))}
    </div>
  </div>
);


// Added for debugging purposes
EmergencyHotlineBar.displayName = 'EmergencyHotlineBar';
