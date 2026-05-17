'use client';

import React, { useEffect, useCallback } from 'react';
import { Zap, Shield, Heart, Activity, ArrowRight, Wifi, Radio } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MeshBackground } from '@/components/landing/MeshBackground';
import { LiveNetworkStats } from '@/components/landing/LiveNetworkStats';
import { EmergencyHotlineBar } from '@/components/landing/EmergencyHotlineBar';
import { motion } from 'framer-motion';

const ROLES = [
  {
    role: 'user' as const,
    key: '1',
    title: 'Citizen / User',
    desc: 'I need emergency help or want to trigger an SOS.',
    icon: Heart,
    color: 'var(--red-sos)',
    gradient: 'from-[var(--red-sos)] to-[#CC0033]',
    actionLabel: 'Enter User Dashboard',
  },
  {
    role: 'responder' as const,
    key: '2',
    title: 'Volunteer Responder',
    desc: 'I am here to assist and respond to nearby alerts.',
    icon: Shield,
    color: 'var(--blue-cloud)',
    gradient: 'from-[var(--blue-cloud)] to-blue-700',
    actionLabel: 'Enter Responder Portal',
  },
  {
    role: 'admin' as const,
    key: '3',
    title: 'System Administrator',
    desc: 'I need to oversee the network and export reports.',
    icon: Activity,
    color: 'var(--green-safe)',
    gradient: 'from-[var(--green-safe)] to-emerald-700',
    actionLabel: 'Enter Admin Panel',
  },
];

export default function LandingPage() {
  const { loginAsRole, loading: authLoading } = useAuth();

  const enterRole = useCallback(
    (role: 'user' | 'responder' | 'admin') => {
      if (!authLoading) loginAsRole(role);
    },
    [authLoading, loginAsRole]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const map: Record<string, 'user' | 'responder' | 'admin'> = {
        '1': 'user',
        '2': 'responder',
        '3': 'admin',
      };
      if (map[e.key]) {
        e.preventDefault();
        enterRole(map[e.key]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enterRole]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden relative">
      <MeshBackground />

      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b border-[var(--border-default)] backdrop-blur-xl bg-[var(--bg-primary)]/80">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-2xl font-extrabold font-syne flex items-center scanline relative">
            D<Zap className="w-5 h-5 text-[var(--red-sos)] fill-[var(--red-sos)]" />EAN
          </span>
        </motion.div>
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"
          >
            <motion.div className="w-2 h-2 rounded-full bg-emerald-500 network-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Network Live</span>
          </motion.div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold font-syne leading-tight mb-6">
            Emergency Coordination,
            <br />
            <span className="bg-gradient-to-r from-[var(--red-sos)] to-[#FF8095] bg-clip-text text-transparent">
              Simplified for Everyone.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 font-medium">
            No signups. No passwords. Select your role below — or press{' '}
            <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-xs font-mono">1</kbd>
            ,{' '}
            <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-xs font-mono">2</kbd>
            ,{' '}
            <kbd className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-xs font-mono">3</kbd>
            .
          </p>
        </motion.div>

        <LiveNetworkStats />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {ROLES.map((item, i) => (
            <motion.button
              key={item.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              disabled={authLoading}
              onClick={() => enterRole(item.role)}
              className="group bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-8 text-left hover:border-white/20 transition-all active:scale-[0.98] relative overflow-hidden interactive-hover"
            >
              <div
                className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 bg-gradient-to-br ${item.gradient} transition-opacity duration-500`}
              />

              <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] flex items-center justify-center text-[10px] font-black text-[var(--text-muted)]">
                {item.key}
              </div>

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border"
                style={{ backgroundColor: `${item.color}15`, borderColor: `${item.color}30` }}
              >
                <item.icon className="w-7 h-7" style={{ color: item.color }} />
              </div>

              <h3 className="text-2xl font-extrabold font-syne mb-2 text-[var(--text-primary)]">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">{item.desc}</p>

              <div className="flex items-center gap-2 font-bold text-sm" style={{ color: item.color }}>
                {authLoading ? 'Initializing...' : item.actionLabel}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Wifi className="w-4 h-4 text-[var(--blue-cloud)]" /> Cloud Sync
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Radio className="w-4 h-4 text-[var(--orange-p2p)]" /> P2P Mesh
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Shield className="w-4 h-4 text-[var(--green-safe)]" /> End-to-End Ready
          </div>
        </div>
      </section>

      <EmergencyHotlineBar />

      <footer className="py-12 px-6 pb-24 text-center text-[var(--text-muted)] text-sm border-t border-[var(--border-default)] mt-20">
        <p>
          &copy; {new Date().getFullYear()} D-EAN — Decentralized Emergency Assistance Network. Built for
          Mangaluru.
        </p>
      </footer>
    </div>
  );
}
