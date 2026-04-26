'use client';

import React from 'react';
import { clsx } from 'clsx';
import { useNetwork } from '@/context/NetworkContext';

interface SOSButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export const SOSButton = ({ onClick, loading }: SOSButtonProps) => {
  const { mode } = useNetwork();

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={clsx(
        "sos-button",
        loading && "loading",
        mode === 'p2p' && "p2p-mode"
      )}
    >
      <span className="mb-1">SOS</span>
      <span className="text-[10px] uppercase tracking-widest opacity-60 font-sans font-medium">
        {loading ? "Sending..." : "Tap to Help"}
      </span>
      
      {mode === 'p2p' && (
        <div className="absolute -top-2 right-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border-2 border-[var(--bg-primary)]">
          P2P
        </div>
      )}
    </button>
  );
};
