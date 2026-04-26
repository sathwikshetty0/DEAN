'use client';

import React from 'react';
import { AlertStatus } from '@/lib/types/app.types';
import { formatRelativeTime, getStatusColor } from '@/lib/utils/formatters';
import { Activity, Shield, Navigation, CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

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
        { key: 'created', label: 'Sent', icon: Activity, timestamp: createdAt },
        { key: 'cancelled', label: 'Cancelled', icon: XCircle, timestamp: cancelledAt },
      ]
    : [
        { key: 'created', label: 'Sent', icon: Activity, timestamp: createdAt },
        { key: 'accepted', label: 'Responder Found', icon: Shield, timestamp: acceptedAt },
        { key: 'en_route', label: 'En Route', icon: Navigation, timestamp: enRouteAt },
        { key: 'resolved', label: 'Help Arrived', icon: CheckCircle2, timestamp: resolvedAt },
      ];

  const statusOrder: (AlertStatus | 'created')[] = ['created', 'pending', 'accepted', 'en_route', 'resolved'];
  const currentIndex = statusOrder.indexOf(status === 'pending' ? 'created' : status);

  if (vertical) {
    return (
      <div className="space-y-0">
        {steps.map((step, i) => {
          const stepIndex = statusOrder.indexOf(step.key);
          const isCompleted = step.key === 'created' || stepIndex <= currentIndex;
          const isActive = step.key === status || (step.key === 'created' && status === 'pending');

          return (
            <div key={i} className="flex items-start gap-4 relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className={clsx(
                  'absolute left-[15px] top-8 w-0.5 h-8',
                  isCompleted ? 'bg-[var(--red-sos)]' : 'bg-[var(--bg-tertiary)]'
                )} />
              )}

              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all z-10',
                isCompleted
                  ? 'bg-[var(--red-sos)] border-[var(--red-sos)] text-white'
                  : 'bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-muted)]',
                isActive && 'scale-110 shadow-lg shadow-[var(--red-sos)]/30'
              )}>
                <step.icon className="w-4 h-4" />
              </div>

              <div className="pb-8">
                <span className={clsx(
                  'text-xs font-bold',
                  isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                )}>
                  {step.label}
                </span>
                {step.timestamp && (
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {formatRelativeTime(step.timestamp)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className="flex justify-between relative px-2">
      <div className="absolute top-4 left-0 w-full h-1 bg-[var(--bg-tertiary)] -z-10" />
      {steps.map((step, i) => {
        const stepIndex = statusOrder.indexOf(step.key);
        const isCompleted = step.key === 'created' || stepIndex <= currentIndex;
        const isActive = step.key === status || (step.key === 'created' && status === 'pending');

        return (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500',
              isCompleted
                ? 'bg-[var(--red-sos)] border-[var(--red-sos)] text-white shadow-lg shadow-[var(--red-sos)]/30'
                : 'bg-[var(--bg-primary)] border-[var(--border-default)] text-[var(--text-muted)]',
              isActive && 'scale-125 animate-pulse'
            )}>
              <step.icon className="w-4 h-4" />
            </div>
            <span className={clsx(
              'text-[10px] font-bold uppercase tracking-widest',
              isCompleted ? 'text-[var(--red-sos)]' : 'text-[var(--text-muted)]'
            )}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
