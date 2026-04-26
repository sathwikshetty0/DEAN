'use client';

import React from 'react';
import { Log } from '@/lib/types/app.types';
import { formatRelativeTime } from '@/lib/utils/formatters';
import { Activity, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveFeedProps {
  logs: Log[];
}

const getLogStyle = (action: string) => {
  if (action.includes('CREATED')) return { bg: 'bg-[var(--red-sos)]/10', text: 'text-[var(--red-sos)]', emoji: '🆘' };
  if (action.includes('RESOLVED')) return { bg: 'bg-green-500/10', text: 'text-green-400', emoji: '✅' };
  if (action.includes('ACCEPTED')) return { bg: 'bg-blue-500/10', text: 'text-blue-400', emoji: '🦺' };
  if (action.includes('SYNC') || action.includes('P2P')) return { bg: 'bg-orange-500/10', text: 'text-orange-400', emoji: '📡' };
  if (action.includes('EN_ROUTE')) return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', emoji: '🚗' };
  return { bg: 'bg-[var(--bg-tertiary)]', text: 'text-[var(--text-secondary)]', emoji: '📋' };
};

export const LiveFeed = ({ logs }: LiveFeedProps) => {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-[var(--border-default)] flex items-center justify-between">
        <h3 className="text-xl font-extrabold font-syne flex items-center gap-3">
          <Activity className="w-5 h-5 text-[var(--red-sos)]" /> Live System Feed
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--red-sos)] animate-ping" />
          <span className="text-[10px] font-bold text-[var(--red-sos)] uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="divide-y divide-[var(--border-default)] max-h-[400px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] text-sm">No activity yet.</div>
          ) : (
            logs.map((log) => {
              const style = getLogStyle(log.action);
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className={clsx('w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold', style.bg)}>
                    {style.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={clsx('text-sm font-bold truncate pr-2', style.text)}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold whitespace-nowrap">
                        {formatRelativeTime(log.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {log.alert_code ? `Alert ${log.alert_code}` : 'System Event'}
                      {log.routing_mode ? ` · ${log.routing_mode.toUpperCase()}` : ''}
                    </p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-2 text-[var(--text-muted)] hover:text-[var(--red-sos)] transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
