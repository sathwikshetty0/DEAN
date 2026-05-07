'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Alert } from '@/lib/types/app.types';
import { StatusPill } from '@/components/shared/StatusPill';
import { getEmergencyIcon, formatDate, formatTime, getModeLabel } from '@/lib/utils/formatters';
import { Clock, Filter, ChevronLeft, ChevronRight, Zap, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import Link from 'next/link';

export default function HistoryPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const filteredAlerts = alerts.filter(alert => 
    alert.alert_code.toLowerCase().includes(search.toLowerCase()) ||
    alert.description?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      setLoading(true);
      let query = supabase
        .from('alerts')
        .select('*')
        .eq('triggered_by', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data } = await query;
      setAlerts(data ?? []);
      setLoading(false);
    };
    fetchHistory();
  }, [user, filter, supabase]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-syne tracking-tight">SOS History</h1>
          <p className="text-[var(--text-secondary)] mt-2 text-sm font-medium">Your historical emergency signals and response data.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative group min-w-[240px]">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-sos transition-colors">
                <Filter className="w-4 h-4" />
             </div>
             <input 
               type="text" 
               placeholder="Search alerts..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:border-sos/50 focus:ring-4 focus:ring-sos/10 rounded-2xl text-xs font-bold pl-11 pr-4 py-3.5 outline-none transition-all placeholder:text-[var(--text-muted)]/50"
             />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:border-sos/50 rounded-2xl text-xs font-black px-5 py-3.5 outline-none appearance-none cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <option value="all">ALL ACTIVITY</option>
            <option value="pending">PENDING</option>
            <option value="accepted">ACCEPTED</option>
            <option value="en_route">EN ROUTE</option>
            <option value="resolved">RESOLVED</option>
            <option value="cancelled">CANCELLED</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[100px] bg-[var(--bg-secondary)] rounded-3xl animate-pulse border border-[var(--border-default)] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          ))
        ) : filteredAlerts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 flex flex-col items-center justify-center bg-[var(--bg-secondary)]/50 rounded-[3rem] border border-dashed border-[var(--border-default)] group"
          >
            <div className="w-24 h-24 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">
               📭
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
            <p className="text-[var(--text-secondary)] text-xs font-medium max-w-xs text-center leading-relaxed">
              {search || filter !== 'all' 
                ? "We couldn't find any alerts matching your current filters." 
                : "You haven't triggered any emergency alerts yet. Your history will appear here."}
            </p>
            {(search || filter !== 'all') && (
              <button 
                onClick={() => {setSearch(''); setFilter('all');}}
                className="mt-6 text-xs font-bold text-sos hover:underline"
              >
                Clear all filters
              </button>
            )}
            {!search && filter === 'all' && (
              <Link href="/dashboard" className="mt-8 px-10 py-4 bg-sos hover:bg-sos-hover rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-sos/20 transition-all active:scale-95">
                Go to Dashboard
              </Link>
            )}
          </motion.div>
        ) : (
          filteredAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-sos/30 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:shadow-2xl hover:shadow-sos/5"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--bg-tertiary)] flex items-center justify-center text-3xl border border-[var(--border-default)] group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  {getEmergencyIcon(alert.emergency_type)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-sos bg-sos/10 px-2 py-0.5 rounded-md tracking-tighter">{alert.alert_code}</span>
                    <StatusPill status={alert.status} />
                  </div>
                  <div className="text-sm font-bold text-white capitalize group-hover:text-sos transition-colors">{alert.emergency_type} Emergency</div>
                  {alert.description && (
                    <p className="text-[11px] text-[var(--text-muted)] mt-1.5 line-clamp-1 italic max-w-sm">
                      &quot;{alert.description}&quot;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                <div className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black border transition-colors',
                  alert.routing_mode === 'cloud'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/10 group-hover:border-blue-500/30'
                    : 'bg-orange-500/10 text-orange-400 border-orange-500/10 group-hover:border-orange-500/30'
                )}>
                  {alert.routing_mode === 'cloud' ? <Zap className="w-3.5 h-3.5" /> : <Navigation className="w-3.5 h-3.5" />}
                  {alert.routing_mode.toUpperCase()}
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-[11px] font-black text-white tracking-tight">{formatDate(alert.created_at)}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-bold flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatTime(alert.created_at)}
                  </div>
                </div>

                <Link 
                  href={`/dashboard/history/${alert.id}`}
                  className="w-full lg:w-auto p-3 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-[var(--text-muted)] hover:text-sos hover:border-sos/20 transition-all text-center"
                >
                   <ChevronRight className="w-5 h-5 inline" />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

