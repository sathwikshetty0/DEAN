'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StatusPill } from '@/components/shared/StatusPill';
import { Alert } from '@/lib/types/app.types';
import { Search, Filter, Download, ExternalLink, MapPin, Zap, Navigation } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';
import { AlertDetailsModal } from '@/components/admin/AlertDetailsModal';

export default function AdminAlerts() {
  const supabase = createClient();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, [filterStatus]);

  const fetchAlerts = async () => {
    setLoading(true);
    let query = supabase
      .from('alerts')
      .select(`
        *,
        triggered_by:profiles!alerts_triggered_by_fkey(name, email),
        assigned_responder:profiles!alerts_assigned_responder_fkey(name)
      `)
      .order('created_at', { ascending: false });

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;
    if (!error && data) {
      setAlerts(data as any);
    }
    setLoading(false);
  };

  const exportCSV = async () => {
    toast.promise(
      fetch('/api/admin/export/alerts').then(async res => {
        if (!res.ok) throw new Error('Failed to export');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dean-alerts-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }),
      {
        loading: 'Generating CSV...',
        success: 'Export successful!',
        error: 'Failed to export CSV',
      }
    );
  };

  const filteredAlerts = alerts.filter(a => 
    a.alert_code.toLowerCase().includes(search.toLowerCase()) ||
    (a.triggered_by as any)?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-sos/50 transition-colors"
              placeholder="Search by alert code or user..."
            />
          </div>
          <div className="flex items-center gap-2">
             <Filter className="w-4 h-4 text-[var(--text-muted)]" />
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
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
        
        <button 
          onClick={exportCSV}
          className="px-6 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Alerts Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-default)]">
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Alert Code</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Type</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">User</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Mode</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Responder</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Created</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-default)]">
                  {loading ? (
                    [1,2,3,4,5].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={8} className="px-6 py-6 h-16 bg-white/[0.01]" />
                      </tr>
                    ))
                  ) : filteredAlerts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm italic">
                        No alerts found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 font-bold text-xs text-sos">{alert.alert_code}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 text-xs font-medium">
                              <span>{alert.emergency_type === 'medical' ? '🏥' : alert.emergency_type === 'fire' ? '🔥' : '🚨'}</span>
                              <span className="capitalize">{alert.emergency_type}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-xs font-bold text-[var(--text-primary)]">{(alert.triggered_by as any)?.name}</div>
                           <div className="text-[10px] text-[var(--text-muted)]">{(alert.triggered_by as any)?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className={clsx(
                             "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border",
                             alert.routing_mode === 'cloud' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                           )}>
                              {alert.routing_mode === 'cloud' ? <Zap className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
                              {alert.routing_mode.toUpperCase()}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <StatusPill status={alert.status} />
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-[var(--text-secondary)]">
                           {(alert.assigned_responder as any)?.name || '—'}
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-xs font-medium">{new Date(alert.created_at).toLocaleDateString()}</div>
                           <div className="text-[10px] text-[var(--text-muted)]">{new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="px-6 py-4">
                           <button 
                             onClick={() => setSelectedAlertId(alert.id)}
                             className="p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-sos hover:border-sos/30 transition-all"
                           >
                              <ExternalLink className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
      <AlertDetailsModal alertId={selectedAlertId} onClose={() => setSelectedAlertId(null)} />
    </div>
  );
}
