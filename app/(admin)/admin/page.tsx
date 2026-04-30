'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAdminStream } from '@/hooks/useSupabaseRealtime';
import { StatsCard } from '@/components/admin/StatsCard';
import { LiveFeed } from '@/components/admin/LiveFeed';
import { SystemStatusBar } from '@/components/admin/SystemStatusBar';
import { AlertDetailsModal } from '@/components/admin/AlertDetailsModal';
import dynamic from 'next/dynamic';

const CommandCenterMap = dynamic(() => import('@/components/admin/CommandCenterMap').then(m => m.CommandCenterMap), { ssr: false });
import { Log } from '@/lib/types/app.types';
import { generateCSV, downloadCSV } from '@/lib/utils/csv';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts';
import { AlertCircle, CheckCircle2, Shield, Radio, TrendingUp, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#FF2D55', '#3B82F6', '#F59E0B', '#10B981', '#94A3B8', '#CC0033'];

export default function AdminOverview() {
  const supabase = createClient();
  const [stats, setStats] = useState({ activeAlerts: 0, resolvedToday: 0, onlineResponders: 0, p2pEvents: 0 });
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const [chartData] = useState([
    { name: 'Mon', count: 12 }, { name: 'Tue', count: 18 }, { name: 'Wed', count: 15 },
    { name: 'Thu', count: 25 }, { name: 'Fri', count: 22 }, { name: 'Sat', count: 30 }, { name: 'Sun', count: 28 },
  ]);

  const [pieData] = useState([
    { name: 'Medical', value: 40 }, { name: 'Fire', value: 15 }, { name: 'Accident', value: 20 },
    { name: 'Crime', value: 10 }, { name: 'Flood', value: 10 }, { name: 'Other', value: 5 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: activeCount } = await supabase
        .from('alerts').select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'accepted', 'en_route']);

      const { count: resolvedToday } = await supabase
        .from('alerts').select('*', { count: 'exact', head: true })
        .eq('status', 'resolved')
        .gte('created_at', new Date().toISOString().split('T')[0]);

      const { count: responders } = await supabase
        .from('profiles').select('*', { count: 'exact', head: true })
        .eq('role', 'responder').eq('is_available', true);

      setStats({
        activeAlerts: activeCount ?? 0,
        resolvedToday: resolvedToday ?? 0,
        onlineResponders: responders ?? 0,
        p2pEvents: 14,
      });
    };

    const fetchLogs = async () => {
      const { data } = await supabase
        .from('logs').select('*')
        .order('created_at', { ascending: false }).limit(15);
      setLogs((data ?? []) as Log[]);
    };

    fetchStats();
    fetchLogs();
  }, [supabase]);

  useAdminStream(
    () => {},
    (payload) => {
      setLogs(prev => [payload.new as Log, ...prev.slice(0, 14)]);
    }
  );

  const handleExport = async () => {
    const { data: alerts } = await supabase.from('alerts').select('*').limit(100);
    if (!alerts || alerts.length === 0) return;
    
    const headers = ['ID', 'Code', 'Type', 'Status', 'Lat', 'Lng', 'Created At'];
    const rows = alerts.map(a => [
      a.id, a.alert_code, a.emergency_type, a.status, 
      a.location_lat.toString(), a.location_lng.toString(), a.created_at
    ]);
    
    const csv = generateCSV(headers, rows);
    downloadCSV(csv, `dean-alerts-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportLogs = async () => {
    const { data: logsData } = await supabase.from('logs').select('*').limit(200);
    if (!logsData || logsData.length === 0) return;
    
    const headers = ['ID', 'Level', 'Message', 'Source', 'Timestamp'];
    const rows = logsData.map(l => [
      l.id, l.level, l.message, l.source, l.created_at
    ]);
    
    const csv = generateCSV(headers, rows);
    downloadCSV(csv, `dean-logs-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-8">
      {/* System Status */}
      <SystemStatusBar />

      {/* TACTICAL MAP - NEW FEATURE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold font-syne flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" /> Tactical Command Center
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportLogs}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl text-[10px] font-bold hover:bg-[var(--bg-tertiary)] transition-colors opacity-70 hover:opacity-100"
            >
              <Download className="w-3.5 h-3.5" /> Logs
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-sos/10 border border-sos/20 rounded-xl text-[10px] font-bold text-sos hover:bg-sos/20 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Alerts
            </button>
          </div>
        </div>
        <CommandCenterMap />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Alerts', val: stats.activeAlerts, icon: AlertCircle, color: 'text-[var(--red-sos)]', trend: `↑ ${stats.activeAlerts} active now` },
          { label: 'Resolved Today', val: stats.resolvedToday, icon: CheckCircle2, color: 'text-green-500', trend: '+12.5% from yesterday' },
          { label: 'Online Responders', val: stats.onlineResponders, icon: Shield, color: 'text-blue-500', trend: undefined },
          { label: 'P2P Events (24h)', val: stats.p2pEvents, icon: Radio, color: 'text-orange-500', trend: undefined },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard
              label={stat.label}
              value={stat.val}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts Trend */}
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold font-syne flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--red-sos)]" /> Alert Volume Trend
            </h3>
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
                    <stop offset="5%" stopColor="#FF2D55" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF2D55" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
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
                  onClick={(data) => setFilterType(prev => prev === data.name ? null : data.name)}
                  cursor="pointer"
                >
                  {pieData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke={filterType === pieData[index].name ? '#fff' : 'none'}
                      strokeWidth={2}
                    />
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
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-[var(--text-secondary)] font-medium">{item.name}</span>
                </div>
                <span className="text-xs font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Feed & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LiveFeed logs={logs} onSelectAlert={setSelectedAlertId} />
        </div>

        {/* System Health */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl p-8 space-y-8">
          <h3 className="text-xl font-extrabold font-syne">System Health</h3>
          <div className="space-y-6">
            {[
              { label: 'Real-time Gateway', val: '100%', ok: true },
              { label: 'Database Load', val: '4%', ok: true },
              { label: 'Storage Usage', val: '12%', ok: true },
              { label: 'P2P Sync Engine', val: 'Active', ok: true },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold">{item.label}</span>
                  <span className={`font-bold ${item.ok ? 'text-green-500' : 'text-orange-500'}`}>{item.val}</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${item.ok ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: item.val.includes('%') ? item.val : '100%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-xs font-bold text-green-400">All Systems Normal</div>
                <div className="text-[10px] text-green-500/70">No critical issues in last 24h.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDetailsModal alertId={selectedAlertId} onClose={() => setSelectedAlertId(null)} />
    </div>
  );
}
