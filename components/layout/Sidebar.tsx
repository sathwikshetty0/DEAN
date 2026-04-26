'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, LogOut, LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  links: SidebarLink[];
}

export const Sidebar = ({ links }: SidebarProps) => {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <aside className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-default)] flex flex-col fixed h-screen z-50">
      <div className="p-6 border-b border-[var(--border-default)]">
        <Link href="/" className="text-2xl font-extrabold font-syne flex items-center gap-2">
          D<Zap className="w-5 h-5 text-[var(--red-sos)] fill-[var(--red-sos)]" />EAN
        </Link>
        <div className="mt-1 text-[10px] text-[var(--red-sos)] font-bold tracking-[0.2em] uppercase">Control Center</div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-[var(--red-sos)]/10 text-[var(--red-sos)] border border-[var(--red-sos)]/20'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
              )}
            >
              <link.icon className={clsx('w-5 h-5', isActive ? 'text-[var(--red-sos)]' : 'text-[var(--text-muted)] group-hover:text-[var(--red-sos)] transition-colors')} />
              {link.label}
              {link.badge != null && link.badge > 0 && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[var(--red-sos)] animate-ping" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border-default)]">
        <div className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)]/50 rounded-2xl border border-[var(--border-default)] mb-4">
          <div className="w-8 h-8 rounded-lg bg-[var(--red-sos)]/20 flex items-center justify-center font-bold text-[var(--red-sos)] text-xs">
            {profile?.name?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold truncate">{profile?.name}</div>
            <div className="text-[10px] text-[var(--text-muted)] truncate">System Admin</div>
          </div>
          <button onClick={signOut} className="text-[var(--text-muted)] hover:text-[var(--red-sos)] transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="px-2 flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold">
          <span>v1.0.0</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
          </div>
        </div>
      </div>
    </aside>
  );
};
