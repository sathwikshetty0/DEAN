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
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-syne">SOS History</h1>
          <p className="text-[var(--text-secondary)]">Your past emergency alerts and their outcomes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl text-xs font-bold px-3 py-2.5 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="en_route">En Route</option>
            <option value="resolved">Resolved</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-[var(--bg-secondary)] rounded-2xl animate-pulse border border-[var(--border-default)]" />
          ))
        ) : alerts.length === 0 ? (
          <div className="py-20 text-center bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-default)]">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-[var(--text-secondary)] font-medium">No alerts found.</p>
            <Link href="/dashboard" className="inline-block mt-4 px-6 py-2 bg-[var(--red-sos)] rounded-full text-xs font-bold">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[var(--border-active)] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-2xl border border-[var(--border-default)]">
                  {getEmergencyIcon(alert.emergency_type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[var(--red-sos)]">{alert.alert_code}</span>
                    <StatusPill status={alert.status} />
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] capitalize">{alert.emergency_type} Emergency</div>
                  {alert.description && (
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 line-clamp-1 max-w-xs">&quot;{alert.description}&quot;</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                <div className={clsx(
                  'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border',
                  alert.routing_mode === 'cloud'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                )}>
                  {alert.routing_mode === 'cloud' ? <Zap className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
                  {alert.routing_mode.toUpperCase()}
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium">{formatDate(alert.created_at)}</div>
                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {formatTime(alert.created_at)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
