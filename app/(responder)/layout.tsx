'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { Zap, LayoutDashboard, History, User, LogOut, Bell, Shield } from 'lucide-react';
import { clsx } from 'clsx';

import { PageTransition } from '@/components/shared/PageTransition';

export default function ResponderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const navLinks = [
    { href: '/responder', label: 'Alerts', icon: Shield },
    { href: '/responder/history', label: 'Mission History', icon: History },
    { href: '/responder/profile', label: 'Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b border-[var(--border-default)] backdrop-blur-xl bg-[var(--bg-primary)]/80">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-extrabold font-syne flex items-center gap-1">
            D<Zap className="w-4 h-4 text-sos fill-sos" />EAN
            <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 tracking-widest font-sans">RESPONDER</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={clsx(
                  "text-sm font-medium px-3 py-1.5 rounded-full transition-all",
                  pathname === link.href ? "bg-blue-500/10 text-blue-400" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <NetworkBadge />
          <button className="p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-sos transition-colors relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-sos rounded-full border-2 border-[var(--bg-tertiary)]" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-default)]">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-xs">
                {profile?.name?.charAt(0).toUpperCase() || 'R'}
             </div>
             <button onClick={signOut} className="text-[var(--text-muted)] hover:text-sos transition-colors">
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24 px-6 pb-12 max-w-7xl mx-auto w-full">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
}
