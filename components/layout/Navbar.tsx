'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNetwork } from '@/context/NetworkContext';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { Zap, Bell, LogOut } from 'lucide-react';

interface NavbarProps {
  roleLabel?: string;
  roleColor?: string;
}

export const Navbar = ({ roleLabel, roleColor = 'text-[var(--red-sos)]' }: NavbarProps) => {
  const { profile, signOut } = useAuth();
  const { mode } = useNetwork();

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b border-[var(--border-default)] backdrop-blur-xl bg-[var(--bg-primary)]/80">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-extrabold font-syne flex items-center gap-1">
          D<Zap className="w-4 h-4 text-[var(--red-sos)] fill-[var(--red-sos)]" />EAN
        </Link>
        {roleLabel && (
          <span className={`text-[10px] ${roleColor} bg-white/5 px-2 py-0.5 rounded-full border border-white/10 tracking-widest font-sans font-bold`}>
            {roleLabel}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <NetworkBadge />
        <button className="p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--red-sos)] transition-colors relative">
          <Bell className="w-5 h-5" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--red-sos)] rounded-full border-2 border-[var(--bg-tertiary)]" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-default)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--red-sos)] to-[#CC0033] flex items-center justify-center font-bold text-xs">
            {profile?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <button onClick={signOut} className="text-[var(--text-muted)] hover:text-[var(--red-sos)] transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
