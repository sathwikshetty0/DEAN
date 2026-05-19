'use client';

/**
 * @fileoverview UI Component for page
 * Implements functionality related to the D-EAN platform's presentation layer.
 */

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Download, Clock, Filter, Terminal, User as UserIcon, Zap, Navigation } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';

export default function AdminLogs() {
  const supabase = createClient();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    let query = supabase
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (actionFilter !== 'all') {
      query = query.ilike('action', `%${actionFilter}%`);
    }

    const { data, error } = await query.limit(100);
    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => 
    log.alert_code?.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.actor_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-2xl bg-sos/10 flex items-center justify-center text-sos border border-sos/20 shadow-lg shadow-sos/10">
              <Terminal className="w-5 h-5" />
           </div>
           <div>
              <h2 className="text-2xl font-extrabold font-syne">System Logs</h2>
              <p className="text-[var(--text-secondary)] text-sm">Audit trail of all critical system actions.</p>
           </div>
        </div>
        <button 
          onClick={() => toast.success('Exporting logs...')}
          className="px-6 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="relative lg:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-sos/50 transition-colors"
              placeholder="Search by alert code, action, or actor..."
            />
         </div>
         <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <select 
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-sos/50 transition-colors appearance-none font-bold"
            >
               <option value="all">All Actions</option>
               <option value="ALERT">Alert Operations</option>
               <option value="STATUS">Status Updates</option>
               <option value="SYNC">P2P Syncs</option>
               <option value="AUTH">Auth Events</option>
            </select>
         </div>
         <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-2.5 px-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Showing</span>
            <span className="text-xs font-bold text-sos">{filteredLogs.length} Entries</span>
         </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-default)]">
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Timestamp</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Action</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Actor</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Role</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Alert Code</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Mode</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-default)] font-mono">
                  {loading ? (
                    [1,2,3,4,5].map(i => <tr key={i} className="animate-pulse h-12"><td colSpan={6} className="bg-white/[0.01]" /></tr>)
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group text-[11px]">
                        <td className="px-6 py-4 text-[var(--text-muted)] whitespace-nowrap">
                           <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(log.created_at).toLocaleString()}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={clsx(
                             "px-2 py-0.5 rounded border font-bold uppercase tracking-tighter",
                             log.action.includes('CREATED') ? "bg-sos/10 text-sos border-sos/20" :
                             log.action.includes('SYNC') ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                             "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-default)]"
                           )}>
                              {log.action}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <UserIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                              <span className="truncate max-w-[120px]">{log.actor_id}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 uppercase font-bold text-[var(--text-muted)]">{log.actor_role || '—'}</td>
                        <td className="px-6 py-4 font-bold text-sos">{log.alert_code || '—'}</td>
                        <td className="px-6 py-4">
                           {log.routing_mode ? (
                             <div className={clsx(
                               "inline-flex items-center gap-1 font-bold",
                               log.routing_mode === 'cloud' ? "text-blue-400" : "text-orange-400"
                             )}>
                                {log.routing_mode === 'cloud' ? <Zap className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
                                {log.routing_mode.toUpperCase()}
                             </div>
                           ) : '—'}
                        </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
