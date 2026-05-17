'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Shield, Activity, LayoutDashboard, Siren } from 'lucide-react';
const COMMANDS = [
  { id: 'home', label: 'Landing page', href: '/', icon: LayoutDashboard, keys: 'home' },
  { id: 'sos', label: 'Quick SOS', href: '/sos', icon: Siren, keys: 'sos emergency' },
  { id: 'user', label: 'Citizen dashboard', href: '/dashboard', icon: Heart, keys: 'user citizen' },
  { id: 'responder', label: 'Responder portal', href: '/responder', icon: Shield, keys: 'responder volunteer' },
  { id: 'admin', label: 'Admin command center', href: '/admin', icon: Activity, keys: 'admin' },
];

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.keys.includes(query.toLowerCase())
  );

  const run = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery('');
      router.push(href);
    },
    [router]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -8 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-default)]">
              <Search className="w-4 h-4 text-[var(--text-muted)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to… (Ctrl+K)"
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <kbd className="text-[9px] px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">ESC</kbd>
            </div>
            <ul className="max-h-64 overflow-y-auto py-2">
              {filtered.map((cmd) => (
                <li key={cmd.id}>
                  <button
                    type="button"
                    onClick={() => run(cmd.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <cmd.icon className="w-4 h-4 text-[var(--red-sos)]" />
                    <span className="text-sm font-bold">{cmd.label}</span>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center text-xs text-[var(--text-muted)]">No matches</li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
