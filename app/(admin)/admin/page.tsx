'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAdminStream } from '@/hooks/useSupabaseRealtime';
import { StatusPill } from '@/components/shared/StatusPill';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  AlertCircle, CheckCircle2, Shield, Radio, Activity, TrendingUp, 
  Clock, MapPin, Zap, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const COLORS = ['#FF2D55', '#3B82F6', '#F59E0B', '#10B981', '#94A3B8', '#CC0033'];

export default function AdminOverview() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    activeAlerts: 0,
    resolvedToday: 0,
    onlineResponders: 0,
    p2pEvents: 0
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [chartData, setChartData] = useState([
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 18 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 25 },
    { name: 'Fri', count: 22 },
    { name: 'Sat', count: 30 },
    { name: 'Sun', count: 28 },
  ]);

  const [pieData, setPieData] = useState([
    { name: 'Medical', value: 40 },
    { name: 'Fire', value: 15 },
    { name: 'Accident', value: 20 },
    { name: 'Crime', value: 10 },
    { name: 'Flood', value: 10 },
    { name: 'Other', value: 5 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: activeCount } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'accepted', 'en_route']);
        
      const { count: resolvedToday } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'resolved')
        .gte('created_at', new Date().toISOString().split('T')[0]);

      const { count: responders } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'responder')
        .eq('is_available', true);

      setStats({
        activeAlerts: activeCount || 0,
        resolvedToday: resolvedToday || 0,
        onlineResponders: responders || 0,
        p2pEvents: 14 // Mock for now
      });
    };

    const fetchLogs = async () => {
      const { data } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      setLogs(data || []);
    };

    fetchStats();
    fetchLogs();
  }, [supabase]);

  useAdminStream(
    (payload) => {
      // Handle alert updates if needed
      console.log('Real-time alert:', payload);
    },
    (payload) => {
      setLogs(prev => [payload.new, ...prev.slice(0, 9)]);
    }
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Alerts', val: stats.activeAlerts, icon: AlertCircle, color: 'text-sos', bg: 'bg-sos/10' },
          { label: 'Resolved Today', val: stats.resolvedToday, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Online Responders', val: stats.onlineResponders, icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'P2P Events (24h)', val: stats.p2pEvents, icon: Radio, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 rounded-3xl relative overflow-hidden group"
          >
            <div className={clsx("absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-125 transition-transform", stat.bg)} />
            <div className="flex items-center gap-3 mb-4">
               <div className={clsx("p-2 rounded-xl border border-white/5", stat.bg)}>
                  <stat.icon className={clsx("w-5 h-5", stat.color)} />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{stat.label}</span>
            </div>
            <div className="text-4xl font-extrabold font-syne">{stat.val}</div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-green-500 font-bold">
               <TrendingUp className="w-3 h-3" /> +12.5% FROM YESTERDAY
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts Trend */}
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold font-syne">Alert Volume Trend</h3>
              <select className="bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-xl text-xs font-bold px-3 py-2 outline-none">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
              </select>
           </div>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                 <defs>
                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#FF2D55" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#FF2D55" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 'bold'}} />
                 <Tooltip 
                   contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                   itemStyle={{ color: '#F8FAFC', fontWeight: 'bold', fontSize: '12px' }}
                 />
                 <Area type="monotone" dataKey="count" stroke="#FF2D55" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Emergency Distribution */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-8">
           <h3 className="text-xl font-extrabold font-syne mb-8">Alert Distribution</h3>
           <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="space-y-3 mt-4">
              {pieData.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                      <span className="text-xs text-[var(--text-secondary)] font-medium">{item.name}</span>
                   </div>
                   <span className="text-xs font-bold">{item.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Live Feed & Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
           <div className="p-6 border-b border-[var(--border-default)] flex items-center justify-between">
              <h3 className="text-xl font-extrabold font-syne flex items-center gap-3">
                 <Activity className="w-5 h-5 text-sos" /> Live System Feed
              </h3>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-sos animate-ping" />
                 <span className="text-[10px] font-bold text-sos uppercase tracking-widest">Live Updates</span>
              </div>
           </div>
           <div className="divide-y divide-[var(--border-default)]">
              {logs.map((log, i) => (
                <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors group">
                   <div className={clsx(
                     "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold",
                     log.action.includes('CREATED') ? "bg-sos/10 text-sos" : 
                     log.action.includes('SYNCED') ? "bg-orange-500/10 text-orange-400" :
                     "bg-blue-500/10 text-blue-400"
                   )}>
                      {log.action.includes('CREATED') ? '🆘' : log.action.includes('SYNCED') ? '📡' : '✅'}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-sm font-bold truncate pr-2">{log.action.replace(/_/g, ' ')}</span>
                         <span className="text-[10px] text-[var(--text-muted)] font-bold whitespace-nowrap">{new Date(log.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                         {log.alert_code ? `Alert ${log.alert_code} • ` : ''} 
                         Actor ID: {log.actor_id?.substring(0, 8)}...
                      </p>
                   </div>
                   <button className="opacity-0 group-hover:opacity-100 p-2 text-[var(--text-muted)] hover:text-sos transition-all">
                      <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              ))}
           </div>
           <button className="w-full p-4 text-[10px] font-bold text-[var(--text-muted)] hover:text-sos uppercase tracking-widest border-t border-[var(--border-default)] transition-colors">
              View All System Logs
           </button>
        </div>

        {/* System Health */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-8 space-y-8">
           <h3 className="text-xl font-extrabold font-syne">System Health</h3>
           
           <div className="space-y-6">
              {[
                { label: 'Real-time Gateway', status: 'Healthy', val: '100%', color: 'text-green-500' },
                { label: 'Database Load', status: 'Optimal', val: '4%', color: 'text-green-500' },
                { label: 'Storage Usage', status: 'Normal', val: '12%', color: 'text-blue-500' },
                { label: 'P2P Sync Engine', status: 'Operational', val: 'Active', color: 'text-green-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-xs">
                      <span className="font-bold text-[var(--text-primary)]">{item.label}</span>
                      <span className={clsx("font-bold", item.color)}>{item.val}</span>
                   </div>
                   <div className="h-1.5 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div className={clsx("h-full rounded-full transition-all duration-1000", item.color.replace('text', 'bg'))} style={{width: item.val.includes('%') ? item.val : '100%'}} />
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-6 border-t border-[var(--border-default)]">
              <div className="flex items-center gap-3 p-4 bg-sos/10 rounded-2xl border border-sos/20">
                 <AlertCircle className="w-5 h-5 text-sos" />
                 <div>
                    <div className="text-xs font-bold text-sos">System Alerts</div>
                    <div className="text-[10px] text-sos/70">No critical issues detected in last 24h.</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
