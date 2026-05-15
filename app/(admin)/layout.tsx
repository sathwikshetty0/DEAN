'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { Zap, LayoutDashboard, AlertCircle, Shield, Users, ScrollText, Settings, LogOut } from 'lucide-react';
import { PageTransition } from '@/components/shared/PageTransition';
import { clsx } from 'clsx';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/alerts', label: 'Alert Monitor', icon: AlertCircle },
    { href: '/admin/responders', label: 'Responders', icon: Shield },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/logs', label: 'System Logs', icon: ScrollText },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-default)] flex flex-col fixed h-screen z-50">
        <div className="p-6 border-b border-[var(--border-default)]">
          <Link href="/" className="text-2xl font-extrabold font-syne flex items-center gap-2">
            D<Zap className="w-5 h-5 text-sos fill-sos" />EAN
          </Link>
          <div className="mt-1 text-[10px] text-sos font-bold tracking-[0.2em] uppercase">Control Center</div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                pathname === link.href 
                  ? "bg-sos/10 text-sos border border-sos/20" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              )}
            >
              <link.icon className={clsx("w-5 h-5", pathname === link.href ? "text-sos" : "text-[var(--text-muted)] group-hover:text-sos transition-colors")} />
              {link.label}
              {link.label === 'Alert Monitor' && (
                <span className="ml-auto w-2 h-2 rounded-full bg-sos animate-ping" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)]/50 rounded-2xl border border-[var(--border-default)] mb-4">
             <div className="w-8 h-8 rounded-lg bg-sos/20 flex items-center justify-center font-bold text-sos text-xs">
                {profile?.name?.charAt(0).toUpperCase() || 'A'}
             </div>
             <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{profile?.name}</div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">System Admin</div>
             </div>
             <button onClick={signOut} className="text-[var(--text-muted)] hover:text-sos transition-colors">
                <LogOut className="w-4 h-4" />
             </button>
          </div>
          <div className="px-2 flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold">
             <span>v1.0.4-stable</span>
             <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> 12ms
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="h-20 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
           <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">
              {navLinks.find(l => l.href === pathname)?.label || 'Admin'}
           </div>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--text-muted)] border-r border-[var(--border-default)] pr-6">
                 <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> SYSTEM ONLINE</div>
                 <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> DB CONNECTED</div>
              </div>
              <NetworkBadge />
              <button className="p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-sos transition-colors">
                <Settings className="w-5 h-5" />
              </button>
           </div>
        </header>
        
        <div className="p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
