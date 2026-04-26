import React from 'react';
import Link from 'next/link';
import { NetworkBadge } from '@/components/shared/NetworkBadge';
import { ArrowRight, Zap, Shield, Users, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b border-[var(--border-default)] backdrop-blur-xl bg-[var(--bg-primary)]/80">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold font-syne flex items-center">
            D<Zap className="w-5 h-5 text-sos fill-sos" />EAN
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sos to-[#CC0033] text-sm font-bold shadow-lg shadow-sos/20 hover:scale-105 transition-transform">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sos/10 blur-[120px] rounded-full -z-10" />
        
        <h1 className="text-6xl md:text-7xl font-extrabold font-syne leading-tight mb-6">
          Emergency Help,<br />
          <span className="bg-gradient-to-r from-sos to-[#FF8095] bg-clip-text text-transparent">
            When Networks Fail.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 font-medium">
          D-EAN connects you to nearby community responders instantly — 
          cloud or peer-to-peer, your SOS always gets through.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-sos text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#CC0033] transition-colors">
            Trigger SOS as User <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/register?role=responder" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-white font-bold text-lg hover:bg-[var(--bg-elevated)] transition-colors">
            Become a Responder
          </Link>
        </div>

        {/* Animated Visual */}
        <div className="relative max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4">
          <div className="bg-[var(--bg-secondary)] border border-blue-500/20 p-8 rounded-3xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="text-4xl mb-4">☁️</div>
            <h3 className="text-xl font-bold font-syne mb-2">Cloud Mode</h3>
            <p className="text-sm text-[var(--text-secondary)]">Internet available. Real-time sync with Supabase global network.</p>
            <div className="mt-6 flex justify-center">
               <div className="flex gap-1">
                 {[1,2,3].map(i => <div key={i} className="w-1.5 h-6 bg-blue-500/40 rounded-full animate-bounce" style={{animationDelay: `${i * 0.1}s`}} />)}
               </div>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-orange-500/20 p-8 rounded-3xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
            </div>
            <div className="text-4xl mb-4">📡</div>
            <h3 className="text-xl font-bold font-syne mb-2">P2P Mode</h3>
            <p className="text-sm text-[var(--text-secondary)]">Internet down. Local broadcast to nearby devices on same origin.</p>
            <div className="mt-6 flex justify-center">
               <div className="flex gap-1 items-end">
                 {[1,2,3,4].map(i => <div key={i} className="w-1.5 bg-orange-500/40 rounded-full animate-pulse" style={{height: `${i * 8}px`, animationDelay: `${i * 0.2}s`}} />)}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Paths Section */}
      <section className="py-20 px-6 bg-[var(--bg-secondary)]/50 border-y border-[var(--border-default)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold font-syne mb-4">Two Paths. One Goal.</h2>
            <p className="text-[var(--text-secondary)]">Resilient architecture for any environment.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { icon: Zap, title: "Trigger SOS", desc: "One tap initiates emergency protocol." },
              { icon: Shield, title: "System Detects", desc: "Automated network availability analysis." },
              { icon: Users, title: "Alert Delivered", desc: "Nearby responders notified instantly." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-sos/10 flex items-center justify-center mb-6 border border-sos/20">
                  <item.icon className="w-8 h-8 text-sos" />
                </div>
                <h4 className="text-xl font-bold font-syne mb-2">{item.title}</h4>
                <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-6 border-b border-[var(--border-default)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Lives Assisted", val: "847+" },
            { label: "Responders", val: "3" },
            { label: "Delivery Rate", val: "99.7%" },
            { label: "Uptime", val: "100%" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-extrabold font-syne text-[var(--text-primary)]">{stat.val}</div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-[var(--text-muted)] text-sm">
        <p>&copy; {new Date().getFullYear()} D-EAN Network. Built for Mangaluru.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">Terms</a>
          <a href="https://github.com/sathwikshetty0/DEAN" className="hover:text-[var(--text-secondary)] transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
