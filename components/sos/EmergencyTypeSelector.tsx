'use client';

import React from 'react';
import { EmergencyType } from '@/lib/types/app.types';
import { clsx } from 'clsx';

const TYPES: { id: EmergencyType; label: string; icon: string }[] = [
  { id: 'medical', label: 'Medical', icon: '🏥' },
  { id: 'fire', label: 'Fire', icon: '🔥' },
  { id: 'accident', label: 'Accident', icon: '🚗' },
  { id: 'crime', label: 'Crime', icon: '🚨' },
  { id: 'flood', label: 'Flood', icon: '🌊' },
  { id: 'other', label: 'Other', icon: '❓' },
];

interface EmergencyTypeSelectorProps {
  selected: EmergencyType;
  onChange: (type: EmergencyType) => void;
}

export const EmergencyTypeSelector = ({ selected, onChange }: EmergencyTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">
        Type of Emergency
      </label>
      <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
        {TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={clsx(
              'flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all',
              selected === type.id
                ? 'bg-[var(--red-sos)]/10 border-[var(--red-sos)] text-[var(--red-sos)] shadow-[0_0_15px_rgba(255,45,85,0.15)]'
                : 'bg-[var(--bg-tertiary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--red-sos)]/30'
            )}
          >
            <span className="text-xl">{type.icon}</span>
            <span className="font-bold text-sm whitespace-nowrap">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};


// Added for debugging purposes
EmergencyTypeSelector.displayName = 'EmergencyTypeSelector';
