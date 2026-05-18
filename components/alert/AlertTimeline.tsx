'use client';

import React from 'react';
import { AlertStatus } from '@/lib/types/app.types';
import { formatRelativeTime } from '@/lib/utils/formatters';
import { Activity, Shield, Navigation, CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface TimelineStep {
  key: AlertStatus | 'created';
  label: string;
  icon: React.ElementType;
  timestamp?: string | null;
}

interface AlertTimelineProps {
  status: AlertStatus;
  createdAt: string;
  acceptedAt?: string | null;
  enRouteAt?: string | null;
  resolvedAt?: string | null;
  cancelledAt?: string | null;
  vertical?: boolean;
}

export const AlertTimeline = ({
  status,
  createdAt,
  acceptedAt,
  enRouteAt,
  resolvedAt,
  cancelledAt,
  vertical = false,
}: AlertTimelineProps) => {
  const isCancelled = status === 'cancelled';

  const steps: TimelineStep[] = isCancelled
    ? [
        { key: 'created', label: 'SOS Broadcasted', icon: Activity, timestamp: createdAt },
        { key: 'cancelled', label: 'Mission Cancelled', icon: XCircle, timestamp: cancelledAt },
      ]
    : [
        { key: 'created', label: 'SOS Broadcasted', icon: Activity, timestamp: createdAt },
        { key: 'accepted', label: 'Responder Assigned', icon: Shield, timestamp: acceptedAt },
        { key: 'en_route', label: 'Responder En Route', icon: Navigation, timestamp: enRouteAt },
        { key: 'resolved', label: 'Mission Resolved', icon: CheckCircle2, timestamp: resolvedAt },
      ];

  const statusOrder: (AlertStatus | 'created')[] = ['created', 'pending', 'accepted', 'en_route', 'resolved'];
  const currentIndex = statusOrder.indexOf(status === 'pending' ? 'created' : status);

  if (vertical) {
    return (
      <div className="space-y-0 py-4">
        {steps.map((step, i) => {
          const stepIndex = statusOrder.indexOf(step.key);
          const isCompleted = step.key === 'created' || stepIndex <= currentIndex;
          const isActive = step.key === status || (step.key === 'created' && status === 'pending');

          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-5 relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[17px] top-10 w-[2px] h-[calc(100%-10px)] bg-white/5">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: isCompleted ? '100%' : '0%' }}
                    className="w-full bg-sos shadow-[0_0_8px_rgba(255,45,85,0.5)]"
                  />
                </div>
              )}

              <div className="relative">
                <div className={clsx(
                  'w-9 h-9 rounded-2xl flex items-center justify-center border-2 flex-shrink-0 transition-all z-10 relative bg-[#121212]',
                  isCompleted
                    ? 'border-sos text-sos shadow-[0_0_15px_rgba(255,45,85,0.2)]'
                    : 'border-white/5 text-white/20'
                )}>
                  <step.icon className={clsx('w-4 h-4', isCompleted ? 'animate-pulse' : '')} />
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -inset-1 rounded-[1.25rem] border border-sos/50"
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              <div className="pb-10">
                <span className={clsx(
                  'text-sm font-bold tracking-tight',
                  isCompleted ? 'text-white' : 'text-white/20'
                )}>
                  {step.label}
                </span>
                {step.timestamp && (
                  <div className="flex items-center gap-1.5 mt-1">
                     <div className={clsx('w-1 h-1 rounded-full', isCompleted ? 'bg-sos' : 'bg-white/10')} />
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                       {formatRelativeTime(step.timestamp)}
                     </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className="flex justify-between relative px-4 py-8">
      {steps.map((step, i) => {
        const stepIndex = statusOrder.indexOf(step.key);
        const isCompleted = step.key === 'created' || stepIndex <= currentIndex;
        const isActive = step.key === status || (step.key === 'created' && status === 'pending');
        const isLast = i === steps.length - 1;

        return (
          <div key={i} className="flex-1 flex flex-col items-center relative">
            {/* Connection Line */}
            {!isLast && (
              <div className="absolute top-5 left-[50%] w-full h-[2px] bg-white/5 -z-10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  className="h-full bg-sos shadow-[0_0_10px_rgba(255,45,85,0.3)]"
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3 relative"
            >
              <div className={clsx(
                'w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 bg-[#121212] z-10',
                isCompleted
                  ? 'border-sos text-sos shadow-[0_0_20px_rgba(255,45,85,0.3)]'
                  : 'border-white/5 text-white/20',
                isActive && 'scale-110'
              )}>
                <step.icon className={clsx('w-5 h-5', isActive && 'animate-pulse')} />
              </div>
              <div className="flex flex-col items-center">
                <span className={clsx(
                  'text-[9px] font-black uppercase tracking-[0.2em] text-center max-w-[80px]',
                  isCompleted ? 'text-white' : 'text-white/20'
                )}>
                  {step.label}
                </span>
                {step.timestamp && isCompleted && (
                  <span className="text-[8px] font-bold text-sos/60 mt-0.5">
                    {formatRelativeTime(step.timestamp).split(' ')[0]}
                  </span>
                )}
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute -bottom-2 w-1.5 h-1.5 bg-sos rounded-full shadow-[0_0_10px_#FF2D55]"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};


// Added for debugging purposes
AlertTimeline.displayName = 'AlertTimeline';
