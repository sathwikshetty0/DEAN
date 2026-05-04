'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
  { name: 'Mon', alerts: 4 },
  { name: 'Tue', alerts: 7 },
  { name: 'Wed', alerts: 5 },
  { name: 'Thu', alerts: 12 },
  { name: 'Fri', alerts: 9 },
  { name: 'Sat', alerts: 15 },
  { name: 'Sun', alerts: 10 },
];

const pieData = [
  { name: 'Medical', value: 40, color: '#FF2D55' },
  { name: 'Fire', value: 25, color: '#FF9500' },
  { name: 'Security', value: 20, color: '#5856D6' },
  { name: 'Other', value: 15, color: '#8E8E93' },
];

export const AdminStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Stat Cards */}
      <StatCard 
        title="Total Alerts" 
        value="124" 
        change="+12%" 
        icon={<AlertTriangle className="w-5 h-5 text-[#FF2D55]" />} 
      />
      <StatCard 
        title="Resolved" 
        value="118" 
        change="+8%" 
        icon={<CheckCircle className="w-5 h-5 text-green-500" />} 
      />
      <StatCard 
        title="Avg Response" 
        value="4.2m" 
        change="-1.5m" 
        icon={<Clock className="w-5 h-5 text-blue-500" />} 
      />
      <StatCard 
        title="Active Mesh Nodes" 
        value="32" 
        change="+4" 
        icon={<TrendingUp className="w-5 h-5 text-orange-500" />} 
      />

      {/* Charts */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#1C2333]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px]">
        <h3 className="text-white font-bold mb-6">Incident Frequency (Weekly)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF2D55" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF2D55" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ background: '#1C2333', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="alerts" stroke="#FF2D55" strokeWidth={3} fillOpacity={1} fill="url(#colorAlerts)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-1 bg-[#1C2333]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px]">
        <h3 className="text-white font-bold mb-6">By Category</h3>
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
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: '#1C2333', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-[#1C2333]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
      <span className={change.startsWith('+') ? 'text-green-500 text-xs font-bold' : 'text-blue-500 text-xs font-bold'}>
        {change}
      </span>
    </div>
    <h4 className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</h4>
    <p className="text-2xl font-black text-white mt-1">{value}</p>
  </motion.div>
);
