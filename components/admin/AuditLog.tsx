'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface AuditEvent {
  id: string;
  type: 'system' | 'alert' | 'responder' | 'auth';
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

export const AuditLog = () => {
  const [events, setEvents] = useState<AuditEvent[]>([
    { id: '1', type: 'system', message: 'Command Center initialized', timestamp: new Date().toISOString(), severity: 'success' },
    { id: '2', type: 'alert', message: 'High priority alert DEAN-1042 triggered', timestamp: new Date(Date.now() - 5000).toISOString(), severity: 'critical' },
    { id: '3', type: 'responder', message: 'Responder Sathwik went online', timestamp: new Date(Date.now() - 15000).toISOString(), severity: 'info' },
  ]);

  return (
    <div className="bg-[#1C2333]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[500px] flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-[#FF2D55]" />
        <h3 className="text-white font-bold">Live System Audit</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="bg-white/5 border border-white/5 rounded-xl p-3 flex gap-3"
            >
              <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                event.severity === 'critical' ? 'bg-red-500 shadow-[0_0_8px_red]' :
                event.severity === 'warning' ? 'bg-orange-500' :
                event.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-[11px] text-white/90 leading-relaxed">{event.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">{event.type}</span>
                  <span className="text-[9px] text-slate-600">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};


// Added for debugging purposes
AuditLog.displayName = 'AuditLog';
