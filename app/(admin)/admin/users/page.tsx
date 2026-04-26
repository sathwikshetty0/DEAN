'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types/app.types';
import { Search, Mail, Calendar, Activity, Shield, User as UserIcon, MoreHorizontal, Ban, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';

export default function AdminUsers() {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      const { error } = await (supabase.from('profiles') as any)
        .update({ is_active: !current })
        .eq('id', id);
      
      if (error) throw error;
      
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !current } : u));
      toast.success(`User ${current ? 'suspended' : 'restored'}`);
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-extrabold font-syne">User Directory</h2>
           <p className="text-[var(--text-secondary)]">Overview of all registered citizens and responders.</p>
        </div>
        <div className="relative w-full max-w-md">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
           <input 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-sos/50 transition-colors"
             placeholder="Search by name or email..."
           />
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-default)]">
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">User</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Role</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Alerts Sent</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Joined</th>
                     <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border-default)]">
                  {loading ? (
                    [1,2,3,4,5].map(i => (
                      <tr key={i} className="animate-pulse h-16"><td colSpan={6} className="bg-white/[0.01]" /></tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)] italic">No users found.</td></tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className={clsx(
                                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                                u.role === 'admin' ? "bg-sos/10 text-sos" : u.role === 'responder' ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                              )}>
                                 {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                 <div className="text-sm font-bold">{u.name}</div>
                                 <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> {u.email}
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className={clsx(
                             "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                             u.role === 'admin' ? "bg-sos/10 text-sos border-sos/20" : u.role === 'responder' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"
                           )}>
                              {u.role === 'admin' ? <Shield className="w-3 h-3" /> : u.role === 'responder' ? <Activity className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                              {u.role}
                           </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-xs">{u.total_alerts_sent}</td>
                        <td className="px-6 py-4">
                           <div className={clsx(
                             "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest",
                             u.is_active ? "text-green-500" : "text-red-500"
                           )}>
                              <div className={clsx("w-1.5 h-1.5 rounded-full", u.is_active ? "bg-green-500" : "bg-red-500")} />
                              {u.is_active ? 'Active' : 'Suspended'}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-xs font-medium flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                              {new Date(u.created_at).toLocaleDateString()}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => toggleStatus(u.id, u.is_active)}
                                className={clsx(
                                  "p-2 rounded-lg border border-[var(--border-default)] transition-all",
                                  u.is_active ? "text-red-400 hover:bg-red-500/10 hover:border-red-500/30" : "text-green-400 hover:bg-green-500/10 hover:border-green-500/30"
                                )}
                                title={u.is_active ? "Suspend User" : "Activate User"}
                              >
                                 {u.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                              </button>
                              <button className="p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-sos hover:border-sos/30 transition-all">
                                 <MoreHorizontal className="w-4 h-4" />
                              </button>
                           </div>
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
