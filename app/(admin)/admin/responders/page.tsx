'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types/app.types';
import { Shield, MapPin, Award, CheckCircle2, XCircle, Search, MoreVertical, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';

export default function AdminResponders() {
  const supabase = createClient();
  const [responders, setResponders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchResponders();
  }, []);

  const fetchResponders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'responder')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setResponders(data);
    }
    setLoading(false);
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !current })
        .eq('id', id);
      
      if (error) throw error;
      
      setResponders(prev => prev.map(r => r.id === id ? { ...r, is_active: !current } : r));
      toast.success(`Responder ${current ? 'deactivated' : 'activated'}`);
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  const filteredResponders = responders.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.zone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-syne">Responder Network</h2>
          <p className="text-[var(--text-secondary)]">Manage your volunteer force and monitor availability.</p>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-sos/50 transition-colors"
            placeholder="Search by name, zone, or skills..."
          />
        </div>
      </div>

      {/* Responder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-[var(--bg-secondary)] rounded-3xl animate-pulse border border-[var(--border-default)]" />)
        ) : filteredResponders.length === 0 ? (
          <div className="col-span-full py-20 text-center">
             <div className="text-4xl mb-4">🦺</div>
             <p className="text-[var(--text-secondary)] font-medium">No responders found matching your search.</p>
          </div>
        ) : (
          filteredResponders.map((r) => (
            <div key={r.id} className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden flex flex-col group">
               <div className="p-6 pb-4 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center font-bold text-blue-500 text-lg border border-blue-500/20">
                        {r.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                        <h4 className="font-bold text-[var(--text-primary)] leading-tight">{r.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                           <div className={clsx(
                             "w-2 h-2 rounded-full",
                             r.is_active ? (r.is_available ? "bg-green-500 shadow-[0_0_8px_#10B981]" : "bg-orange-500") : "bg-[var(--text-muted)]"
                           )} />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                              {r.is_active ? (r.is_available ? 'Available' : 'Busy/Away') : 'Inactive'}
                           </span>
                        </div>
                     </div>
                  </div>
                  <button className="text-[var(--text-muted)] hover:text-sos transition-colors">
                     <MoreVertical className="w-5 h-5" />
                  </button>
               </div>

               <div className="px-6 py-4 flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                     <MapPin className="w-3.5 h-3.5 text-blue-400" />
                     <span className="font-medium">{r.zone || 'No zone assigned'}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                     {r.skills.length > 0 ? r.skills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[9px] font-bold text-[var(--text-secondary)]">
                           {s}
                        </span>
                     )) : <span className="text-[10px] italic text-[var(--text-muted)]">No skills listed</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-default)]">
                     <div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Responses</div>
                        <div className="text-sm font-extrabold font-syne">{r.total_alerts_responded}</div>
                     </div>
                     <div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Success Rate</div>
                        <div className="text-sm font-extrabold font-syne text-green-400">98%</div>
                     </div>
                  </div>
               </div>

               <div className="p-4 bg-[var(--bg-tertiary)]/50 border-t border-[var(--border-default)] flex gap-2">
                  <button 
                    onClick={() => toggleStatus(r.id, r.is_active)}
                    className={clsx(
                      "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                      r.is_active ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                    )}
                  >
                     {r.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--bg-elevated)] transition-colors">
                     History
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
